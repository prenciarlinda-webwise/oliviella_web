import "server-only";

// Server-only booking rules. This module is the single source of truth for the
// money and date logic of a reservation. It must NEVER be imported by a Client
// Component — the `server-only` import above turns any such attempt into a build
// error. The client only ever sends a product slug, a tier index and a date;
// every price and rule is re-derived here from the trusted catalog.

import {
  experiences,
  isBookableSlug,
  isPayableTier,
  type Experience,
  type PriceTier,
} from "@/lib/products";

/** Read a positive integer env var, falling back to a default. */
function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const bookingConfig = {
  /**
   * Flat booking deposit/retainer charged to reserve a date, in the smallest
   * currency unit (cents). The listed tier prices are "starting at" estimates;
   * the balance is settled offline after a custom proposal. Override with
   * BOOKING_DEPOSIT_CENTS. Default: $300.00.
   */
  depositCents: intFromEnv("BOOKING_DEPOSIT_CENTS", 30_000),
  currency: (process.env.BOOKING_CURRENCY ?? "usd").toLowerCase(),
  /** Earliest a date may be booked: today + this many days. */
  minLeadDays: intFromEnv("BOOKING_MIN_LEAD_DAYS", 7),
  /** Latest a date may be booked: today + this many days. */
  maxAdvanceDays: intFromEnv("BOOKING_MAX_ADVANCE_DAYS", 540),
} as const;

/** Human-readable deposit, e.g. "$300". Safe to render in the UI. */
export function formatDeposit(): string {
  const amount = bookingConfig.depositCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: bookingConfig.currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export type ResolvedBooking = {
  experience: Experience;
  tier: PriceTier;
  tierIndex: number;
  depositCents: number;
  currency: string;
};

/**
 * Resolve and validate a (slug, tierIndex) pair against the trusted catalog.
 * Returns null when the experience is not bookable, the tier does not exist, or
 * the tier is the non-payable "Custom proposal" band. The returned deposit is
 * always the server constant — the caller must use it, not any client value.
 */
export function resolveBooking(
  slug: string,
  tierIndex: number,
): ResolvedBooking | null {
  if (!isBookableSlug(slug)) return null;

  const experience = experiences.find((e) => e.slug === slug);
  if (!experience || !experience.bookable) return null;
  if (experience.pricing.kind !== "guests") return null;

  const tier = experience.pricing.tiers[tierIndex];
  if (!tier || !isPayableTier(tier)) return null;

  return {
    experience,
    tier,
    tierIndex,
    depositCents: bookingConfig.depositCents,
    currency: bookingConfig.currency,
  };
}

/** Today's date at UTC midnight — the reference point for the booking window. */
function todayUtc(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function toYmd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Selectable date range as YYYY-MM-DD strings, for the date input bounds. */
export function bookingWindow(): { minDate: string; maxDate: string } {
  const today = todayUtc();
  const min = new Date(today);
  min.setUTCDate(min.getUTCDate() + bookingConfig.minLeadDays);
  const max = new Date(today);
  max.setUTCDate(max.getUTCDate() + bookingConfig.maxAdvanceDays);
  return { minDate: toYmd(min), maxDate: toYmd(max) };
}

export type DateCheck =
  | { ok: true; date: string }
  | { ok: false; reason: string };

/**
 * Validate a YYYY-MM-DD calendar date against the booking window. Rejects
 * malformed strings, impossible dates (e.g. 2026-02-31), past/too-soon dates
 * and dates too far out. Returns the normalized date string on success.
 */
export function checkBookingDate(input: string): DateCheck {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!match) return { ok: false, reason: "Date must be in YYYY-MM-DD format." };

  const [, y, m, d] = match;
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);

  const date = new Date(Date.UTC(year, month - 1, day));
  // Round-trip check catches overflow like 2026-02-31 -> 2026-03-03.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return { ok: false, reason: "That date does not exist." };
  }

  const today = todayUtc();
  const earliest = new Date(today);
  earliest.setUTCDate(earliest.getUTCDate() + bookingConfig.minLeadDays);
  const latest = new Date(today);
  latest.setUTCDate(latest.getUTCDate() + bookingConfig.maxAdvanceDays);

  if (date < earliest) {
    return {
      ok: false,
      reason: `Please choose a date at least ${bookingConfig.minLeadDays} days out so we can prepare.`,
    };
  }
  if (date > latest) {
    return { ok: false, reason: "That date is too far in the future to book online." };
  }

  return { ok: true, date: input };
}
