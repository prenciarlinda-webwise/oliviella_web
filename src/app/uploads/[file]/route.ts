import fs from "node:fs/promises";
import path from "node:path";

import {
  LEGACY_UPLOAD_DIR,
  UPLOAD_CONTENT_TYPES,
  UPLOAD_DIR,
  UPLOAD_FILE_RE,
} from "@/lib/uploads";

export const runtime = "nodejs";

// Serves admin-uploaded images (see src/lib/uploads.ts for why they're not in public/).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!UPLOAD_FILE_RE.test(file)) {
    return new Response("Not found", { status: 404 });
  }
  const ext = file.slice(file.lastIndexOf(".") + 1) as keyof typeof UPLOAD_CONTENT_TYPES;

  for (const dir of [UPLOAD_DIR, LEGACY_UPLOAD_DIR]) {
    try {
      const bytes = await fs.readFile(path.join(dir, file));
      return new Response(new Uint8Array(bytes), {
        headers: {
          "Content-Type": UPLOAD_CONTENT_TYPES[ext],
          // Every upload gets a new random name, so it never changes in place.
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }
  return new Response("Not found", { status: 404 });
}
