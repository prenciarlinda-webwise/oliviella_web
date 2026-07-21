import { type NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin";
import { readAdmins, writeAdmins, type AdminRole } from "@/lib/auth/admins-store";

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

  const admins = await readAdmins();
  const index = admins.findIndex((a) => a.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }

  const target = admins[index]!;
  if (target.role === "system" && role === "shop" && countOtherSystemAdmins(admins, id) === 0) {
    return NextResponse.json(
      { error: "Can't demote the last system admin." },
      { status: 409 },
    );
  }

  admins[index] = { ...target, role, updatedAt: new Date().toISOString() };
  await writeAdmins(admins);

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

  const admins = await readAdmins();
  const target = admins.find((a) => a.id === id);
  if (!target) {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }
  if (target.role === "system" && countOtherSystemAdmins(admins, id) === 0) {
    return NextResponse.json(
      { error: "Can't remove the last system admin." },
      { status: 409 },
    );
  }

  await writeAdmins(admins.filter((a) => a.id !== id));

  return NextResponse.json({ ok: true });
}
