import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { type NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin";
import { readExperiences, writeExperiences } from "@/lib/products-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "uploads");
const UPLOAD_URL_PREFIX = "/images/uploads/";

/**
 * Sniff magic bytes rather than trusting the client-supplied MIME type
 * (spoofable). Explicitly no SVG — it can carry script.
 */
function detectImageExt(bytes: Uint8Array): "jpg" | "png" | "webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireAdminApi(req);
  if (!auth.ok) return auth.response;

  const { slug } = await params;

  const experiences = await readExperiences();
  const index = experiences.findIndex((e) => e.slug === slug);
  if (index === -1) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Malformed upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "Image must be under 8MB." }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = detectImageExt(bytes);
  if (!ext) {
    return NextResponse.json(
      { error: "Only JPEG, PNG or WebP images are allowed." },
      { status: 415 },
    );
  }

  const filename = `${slug}-${randomUUID()}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);

  const newImagePath = `${UPLOAD_URL_PREFIX}${filename}`;
  const previousImagePath = experiences[index]!.image;

  experiences[index] = { ...experiences[index]!, image: newImagePath };
  await writeExperiences(experiences);

  // Only clean up files this same endpoint previously wrote — never delete
  // the original shipped assets under /images/*, even if a stale record
  // pointed there.
  if (previousImagePath.startsWith(UPLOAD_URL_PREFIX)) {
    const previousFile = path.join(
      process.cwd(),
      "public",
      previousImagePath.replace(/^\//, ""),
    );
    fs.unlink(previousFile).catch((err) => {
      console.error("[admin/products/image] Failed to clean up old image", previousFile, err);
    });
  }

  return NextResponse.json({ ok: true, image: newImagePath });
}
