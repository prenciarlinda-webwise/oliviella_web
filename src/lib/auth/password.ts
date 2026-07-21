import "server-only";

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

// scrypt params + stored-hash format MUST stay in sync with
// scripts/create-admin.mjs (a standalone script, deliberately not importing
// this file — see that script's header comment for why).

// util.promisify(scrypt) resolves ambiguously against Node's two callback
// overloads (with/without an options object) and loses the options-argument
// overload's types, so this wraps it by hand instead.
function scrypt(
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;

// Fixed, non-secret dummy hash used to keep login response time constant
// whether or not the submitted email exists — see verifyPassword's caller in
// the login route. Generated once; not tied to any real account.
export const DUMMY_PASSWORD_HASH =
  "scrypt$16384$8$1$zPEAJuv/gmzs8KbxsuEuJw==$V1IJRf9pO+iZuUhm+bEWWDi2ZXwVNbN1zhVVRaNW0wzwZKKPCmmKuSoi86cNzm+AhI9y4yZaUhNfRZotPvYPCw==";

/** Stored format: "scrypt$N$r$p$<saltB64>$<hashB64>" — self-describing so
 * cost params can change later without invalidating existing hashes. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("base64")}$${derivedKey.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, nStr, rStr, pStr, saltB64, hashB64] = parts;
  const N = Number(nStr);
  const r = Number(rStr);
  const p = Number(pStr);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;

  const salt = Buffer.from(saltB64!, "base64");
  const expected = Buffer.from(hashB64!, "base64");
  const derivedKey = await scrypt(password, salt, expected.length, { N, r, p });

  if (derivedKey.length !== expected.length) return false;
  return timingSafeEqual(derivedKey, expected);
}
