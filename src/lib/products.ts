// Pure, client-safe types and helpers for the Olivella Experiences catalog.
// The actual experience data lives in `products-data.ts` (server-only, backed
// by data/products.json — see that file for why) and is admin-editable.
// This file only holds the shape of that data plus logic that has no fs
// access, so it stays safely importable from Client Components too.
//
// Tier identity is a stable `id`, not array position — the checkout flow
// looks tiers up by `id` (see `resolveBooking` in `booking.ts`), so it's safe
// for an admin to reorder or delete tiers without corrupting an in-flight
// booking.

export type PriceTier = {
  id: string;
  label: string;
  /** Starting price in cents, or null for the non-payable "Custom proposal" tier. */
  priceCents: number | null;
};

export type Pricing =
  | { kind: "guests"; tiers: PriceTier[]; note?: string }
  | { kind: "bouquets"; tiers: PriceTier[]; note?: string };

export type Experience = {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  /** Tailwind gradient pair for the card background. */
  tone: string;
  /** Accent color used for labels and the "Lovely for" panel. */
  accent: "olive" | "rose";
  includes: string[];
  pricing: Pricing;
  /** Whether the experience can be reserved through the calendar. */
  bookable: boolean;
};

export const addOns: string[] = [
  "Custom Floral Palettes",
  "Premium Imported Roses",
  "Champagne Styling",
  "Riviera Umbrellas & Décor",
  "Personalized Wrapping",
  "Candlelit Ambiance",
  "Personalized Menu Cards",
  "Custom Event Branding",
  "Honeycomb Display",
  "Luxury Floral Installations",
];

// --- Booking eligibility -------------------------------------------------
// These helpers are pure and client-safe (no secrets). They are the single
// source of truth for *which* experiences/tiers can be paid for online. The
// authoritative deposit amount and date rules live in the server-only
// `booking.ts` module — never trust anything price-related from the client.

/**
 * Slugs that can be reserved online with a deposit.
 */
export const BOOKABLE_SLUGS = [
  "flower-cart-miami",
  "food-cart-miami",
  "olivella-signature-experience",
] as const;

export type BookableSlug = (typeof BOOKABLE_SLUGS)[number];

export function isBookableSlug(slug: string): slug is BookableSlug {
  return (BOOKABLE_SLUGS as readonly string[]).includes(slug);
}

/**
 * A tier is payable when it has a concrete starting price. The top
 * "Custom proposal" / "200+ Guests" tier has no fixed amount, so it routes to
 * a quote request instead of checkout.
 */
export function isPayableTier(tier: PriceTier): boolean {
  return tier.priceCents !== null;
}

/** The single source of truth for a tier's displayed price — derived from
 * `priceCents` rather than stored as separate free text, so the display copy
 * can never drift out of sync with the number used for balance math. */
export function formatTierPrice(tier: PriceTier): string {
  if (tier.priceCents === null) return "Custom proposal";
  return `Starting at $${(tier.priceCents / 100).toLocaleString("en-US")}`;
}
