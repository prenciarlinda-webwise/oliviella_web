import { type NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin";
import { mutateAdmins, type AdminRole } from "@/lib/auth/admins-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 1 * 1024;

function countOtherSystemAdmins(admins: { id: string; role: AdminRole }[], excludeId: string): number {
  return admins.filter((a) => a.id !== excludeId && a.role === "system").length;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi(req, { role: "system" });
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (id === auth.admin.id) {
    return NextResponse.json({ error: "You can't change your own role." }, { status: 400 });
  }

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
  const role = body.role;
  if (role !== "system" && role !== "shop") {
    return NextResponse.json({ error: "Invalid role." }, { status: 422 });
  }

  // Lookup, last-system-admin check and write happen under one lock, so two
  // system admins demoting each other at the same moment can't leave zero.
  const outcome = await mutateAdmins((admins) => {
    const index = admins.findIndex((a) => a.id === id);
    if (index === -1) return { next: null, result: "not-found" as const };
    const target = admins[index]!;
    if (target.role === "system" && role === "shop" && countOtherSystemAdmins(admins, id) === 0) {
      return { next: null, result: "last-system" as const };
    }
    admins[index] = { ...target, role, updatedAt: new Date().toISOString() };
    return { next: admins, result: "ok" as const };
  });

  if (outcome === "not-found") {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }
  if (outcome === "last-system") {
    return NextResponse.json(
      { error: "Can't demote the last system admin." },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi(req, { role: "system" });
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (id === auth.admin.id) {
    return NextResponse.json({ error: "You can't remove yourself." }, { status: 400 });
  }

  const outcome = await mutateAdmins((admins) => {
    const target = admins.find((a) => a.id === id);
    if (!target) return { next: null, result: "not-found" as const };
    if (target.role === "system" && countOtherSystemAdmins(admins, id) === 0) {
      return { next: null, result: "last-system" as const };
    }
    return { next: admins.filter((a) => a.id !== id), result: "ok" as const };
  });

  if (outcome === "not-found") {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }
  if (outcome === "last-system") {
    return NextResponse.json(
      { error: "Can't remove the last system admin." },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true });
}
