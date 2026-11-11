import "server-only";

import path from "node:path";

// Admin-uploaded images. They live under data/uploads (persistent, git-ignored)
// rather than public/, because `next start` only serves public/ files that
// existed at build time: anything written there later returns 404 until the
// next rebuild. They are served by src/app/uploads/[file]/route.ts instead.

export const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
export const UPLOAD_URL_PREFIX = "/uploads/";

/** Uploads written to public/ before this change (served via redirect). */
export const LEGACY_UPLOAD_DIR = path.join(process.cwd(), "public", "images", "uploads");
export const LEGACY_UPLOAD_URL_PREFIX = "/images/uploads/";

/** Generated names only: "<slug>-<uuid>.<ext>". Blocks any path traversal. */
export const UPLOAD_FILE_RE = /^[a-z0-9-]+\.(jpg|png|webp)$/;

export const UPLOAD_CONTENT_TYPES = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

/** Absolute path on disk for an image URL we created, or null. */
export function uploadPathForUrl(url: string): string | null {
  for (const [prefix, dir] of [
    [UPLOAD_URL_PREFIX, UPLOAD_DIR],
    [LEGACY_UPLOAD_URL_PREFIX, LEGACY_UPLOAD_DIR],
  ] as const) {
    if (url.startsWith(prefix)) {
      const name = url.slice(prefix.length);
      return UPLOAD_FILE_RE.test(name) ? path.join(dir, name) : null;
    }
  }
  return null;
}
