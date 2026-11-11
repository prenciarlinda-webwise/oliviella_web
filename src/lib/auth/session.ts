import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

// Hand-rolled signed-cookie session — HMAC-SHA256 over a small JSON payload,
// base64url-encoded. No JWT library: this app is both the sole issuer and
// sole verifier, so JWT's broader interop surface (multiple algorithms, JWKS,
// etc.) buys nothing here, and this keeps the zero-new-dependency pattern
// already established in this codebase (see node:crypto usage elsewhere).
//
// The payload is deliberately minimal — { adminId, iat, exp }, no role. Role
// is always looked up fresh from data/admins.json on every request (see
// require-admin.ts), which doubles as the revocation mechanism: deleting an
// admin, changing their role, or resetting their password all take effect on
// the very next request, not just next login.

export const SESSION_COOKIE_NAME = "olivella_admin_session";

const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours, no silent refresh
export const SESSION_MAX_AGE_SEC = Math.floor(SESSION_MAX_AGE_MS / 1000);

export type SessionPayload = {
  adminId: string;
  iat: number;
  exp: number;
};

// A short secret makes session cookies forgeable by brute force. 32+
// characters (e.g. `openssl rand -base64 48`) is required.
const MIN_SECRET_LENGTH = 32;

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= MIN_SECRET_LENGTH ? secret : null;
}

function requireSecret(): string {
  const secret = getSecret();
  if (!secret) {
    throw new Error(
      `ADMIN_SESSION_SECRET must be set to at least ${MIN_SECRET_LENGTH} characters to enable admin login.`,
    );
  }
  return secret;
}

function sign(payloadB64url: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadB64url).digest("base64url");
}

export function signSessionCookie(adminId: string): string {
  const now = Date.now();
  const payload: SessionPayload = { adminId, iat: now, exp: now + SESSION_MAX_AGE_MS };
  const payloadB64url = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${payloadB64url}.${sign(payloadB64url, requireSecret())}`;
}

export function verifySessionCookie(raw: string | undefined | null): SessionPayload | null {
  if (!raw) return null;
  // Fail closed (treat as logged out) rather than crash every admin request.
  const secret = getSecret();
  if (!secret) return null;
  const dotIndex = raw.indexOf(".");
  if (dotIndex === -1) return null;

  const payloadB64url = raw.slice(0, dotIndex);
  const signature = raw.slice(dotIndex + 1);

  const expectedSignature = sign(payloadB64url, secret);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64url, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (
    typeof payload.adminId !== "string" ||
    typeof payload.iat !== "number" ||
    typeof payload.exp !== "number"
  ) {
    return null;
  }
  if (Date.now() >= payload.exp) return null;

  return payload;
}
