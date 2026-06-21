import "server-only";

// Best-effort in-memory fixed-window rate limiter. This protects a single
// instance from rapid abuse of the checkout endpoint. It is intentionally
// simple: in a multi-instance / serverless deployment each instance has its own
// counter, so for hard guarantees move this to a shared store (e.g. Upstash
// Redis) keyed the same way.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = { allowed: boolean; retryAfterSec: number };

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  // Opportunistic cleanup so the map can't grow unbounded over time.
  if (buckets.size > 5_000) {
    for (const [k, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(k);
    }
  }
  return { allowed: true, retryAfterSec: 0 };
}
