import "server-only";

import type { NextRequest } from "next/server";

/**
 * Same-origin check for state-changing requests: browsers always send `Origin`
 * on non-GET fetches, and a cross-site request won't match our Host.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Client IP for rate limiting. Uses the RIGHTMOST X-Forwarded-For entry: a
 * reverse proxy (nginx `$proxy_add_x_forwarded_for`, Vercel, etc.) appends the
 * real peer address last, while anything to the left can be typed by the
 * client. Taking the leftmost entry would let an attacker pick a fresh "IP"
 * per request and bypass the limit.
 */
export function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1]!;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
