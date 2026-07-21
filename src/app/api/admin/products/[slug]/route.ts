import { type NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin";
import { readExperiences, writeExperiences } from "@/lib/products-data";
import type { PriceTier } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32 * 1024;
const LIMITS = {
  name: 120,
  subtitle: 160,
  description: 2000,
  includeItem: 120,
  includesCount: 30,
  tierLabel: 80,
  tierPrice: 80,
  tiersCount: 12,
} as const;

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function parseTiers(raw: unknown): PriceTier[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > LIMITS.tiersCount) return null;

  const tiers: PriceTier[] = [];
  const seenIds = new Set<string>();
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;
    const obj = item as Record<string, unknown>;

    const id = asString(obj.id);
    const label = asString(obj.label);
    const price = asString(obj.price);
    const priceCentsRaw = obj.priceCents;
    const priceCents =
      typeof priceCentsRaw === "number" && Number.isFinite(priceCentsRaw) && priceCentsRaw > 0
        ? Math.round(priceCentsRaw)
        : null;

    if (!id || seenIds.has(id)) return null;
    if (!label || label.length > LIMITS.tierLabel) return null;
    if (!price || price.length > LIMITS.tierPrice) return null;

    seenIds.add(id);
    tiers.push({ id, label, price, priceCents });
  }
  return tiers;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const auth = await requireAdminApi(req);
  if (!auth.ok) return auth.response;

  const { slug } = await params;

  const rawText = await req.text();
  if (rawText.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }
  let json: unknown;
  try {
    json = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: "Malformed JSON." }, { status: 400 });
  }
  const body = (json ?? {}) as Record<string, unknown>;

  const name = asString(body.name);
  const subtitle = asString(body.subtitle);
  const description = asString(body.description);
  const tiers = parseTiers(body.tiers);

  const errors: Record<string, string> = {};
  if (!name || name.length > LIMITS.name) errors.name = "Enter a name.";
  if (!subtitle || subtitle.length > LIMITS.subtitle) errors.subtitle = "Enter a subtitle.";
  if (!description || description.length > LIMITS.description) {
    errors.description = "Enter a description.";
  }

  let includes: string[] = [];
  if (!Array.isArray(body.includes)) {
    errors.includes = "Invalid includes list.";
  } else {
    includes = body.includes
      .filter((s): s is string => typeof s === "string")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, LIMITS.includesCount);
    if (includes.some((item) => item.length > LIMITS.includeItem)) {
      errors.includes = "One of the include items is too long.";
    }
  }

  if (!tiers) {
    errors.tiers = "Check the pricing tiers — each needs a label and a display price.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please check the form.", fields: errors },
      { status: 422 },
    );
  }

  const experiences = await readExperiences();
  const index = experiences.findIndex((e) => e.slug === slug);
  if (index === -1) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const current = experiences[index]!;
  experiences[index] = {
    ...current,
    name,
    subtitle,
    description,
    includes,
    pricing: { ...current.pricing, tiers: tiers! },
  };
  await writeExperiences(experiences);

  return NextResponse.json({ ok: true });
}
