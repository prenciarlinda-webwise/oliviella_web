import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionCookie } from "@/lib/auth/session";
import { findAdminById, type AdminRole } from "@/lib/auth/admins-store";
import { isSameOrigin } from "@/lib/request";

export type AdminIdentity = {
  id: string;
  email: string;
  role: AdminRole;
};

async function resolveIdentity(
  sessionCookie: string | undefined,
): Promise<AdminIdentity | null> {
  const session = verifySessionCookie(sessionCookie);
  if (!session) return null;

  const admin = await findAdminById(session.adminId);
  if (!admin) return null; // deleted admin — session is immediately invalid

  // A password reset/change after this session was issued invalidates it,
  // even though the signature and expiry are still otherwise valid.
  if (Date.parse(admin.passwordChangedAt) > session.iat) return null;

  return { id: admin.id, email: admin.email, role: admin.role };
}

/** Server Components/pages. Does not redirect — returns null if not logged in. */
export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  const cookieStore = await cookies();
  return resolveIdentity(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

/**
 * Server Components/pages — the authoritative auth+role check. `proxy.ts`
 * also does an optimistic cookie check for a faster redirect, but every
 * admin page calls this independently; the optimistic check is a UX nicety,
 * not the security boundary.
 */
export async function requireAdmin(opts?: { role?: AdminRole }): Promise<AdminIdentity> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (opts?.role && admin.role !== opts.role) redirect("/admin");
  return admin;
}

export type AdminApiResult =
  | { ok: true; admin: AdminIdentity }
  | { ok: false; response: NextResponse };

/**
 * Route Handlers. `proxy.ts`'s matcher excludes `/api/*` entirely, so this is
 * the ONLY auth check for admin API routes — call it first, before anything
 * else, in every handler under src/app/api/admin/.
 */
export async function requireAdminApi(
  req: NextRequest,
  opts?: { role?: AdminRole },
): Promise<AdminApiResult> {
  // CSRF defense in depth (the SameSite=Lax cookie is the first layer): every
  // state-changing admin call must come from our own pages.
  if (req.method !== "GET" && req.method !== "HEAD" && !isSameOrigin(req)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid origin." }, { status: 403 }),
    };
  }
  const admin = await resolveIdentity(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!admin) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Not authenticated." }, { status: 401 }),
    };
  }
  if (opts?.role && admin.role !== opts.role) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    };
  }
  return { ok: true, admin };
}
