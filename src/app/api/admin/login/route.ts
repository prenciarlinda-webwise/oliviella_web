import { type NextRequest, NextResponse } from "next/server";

import { findAdminByEmail } from "@/lib/auth/admins-store";
import { DUMMY_PASSWORD_HASH, verifyPassword } from "@/lib/auth/password";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SEC, signSessionCookie } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4 * 1024;
const GENERIC_ERROR = "Invalid email or password.";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
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
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  // Rate-limit by IP and by the submitted email independently — blocks one IP
  // hammering many emails AND many IPs hammering one target account.
  const ip = clientIp(req);
  const ipLimit = rateLimit(`admin-login:ip:${ip}`, 8, 15 * 60_000);
  const emailLimit = email
    ? rateLimit(`admin-login:email:${email}`, 8, 15 * 60_000)
    : { allowed: true, retryAfterSec: 0 };
  if (!ipLimit.allowed || !emailLimit.allowed) {
    const retryAfterSec = Math.max(ipLimit.retryAfterSec, emailLimit.retryAfterSec);
    return NextResponse.json(
      { error: "Too many attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
    );
  }

  if (!email || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const admin = await findAdminByEmail(email);
  // Always run verifyPassword, even when the account doesn't exist, against
  // a fixed dummy hash — keeps response time constant so it can't be used to
  // enumerate which emails have accounts.
  const valid = await verifyPassword(password, admin?.passwordHash ?? DUMMY_PASSWORD_HASH);
  if (!admin || !valid) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  let cookieValue: string;
  try {
    cookieValue = signSessionCookie(admin.id);
  } catch (err) {
    console.error("[admin/login]", err);
    return NextResponse.json(
      { error: "Admin login isn't configured on this server." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return response;
}
