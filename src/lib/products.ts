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

export type AddOn = { name: string; price: string };

export const addOns: AddOn[] = [
  { name: "Extra hour of service", price: "$250 flower cart · $350 charcuterie cart" },
  { name: "Premium blooms upgrade (garden roses, peonies in season)", price: "+$10 per guest" },
  { name: "Engraved mini olive-wood board favor", price: "$7 each" },
];

// ─── Shared customer-facing copy ─────────────────────────────────────────
// Kept in code (not in data/products.json) so the same words appear on every
// page that shows them.

export const SALES_TAX_NOTE = "Prices do not include Florida sales tax.";

export const TRAVEL_NOTE =
  "No travel fee in Miami-Dade; $150 in Broward and $300 in Palm Beach County.";

/** The "Every package includes…" line shown under each experience's price table. */
export const INCLUDED_NOTES: Record<string, string> = {
  "flower-cart-miami": `Every package includes about 8 premium stems per guest, a hand-wrapped bouquet, an on-site attendant, 2 hours of service, delivery, setup and breakdown. ${TRAVEL_NOTE} ${SALES_TAX_NOTE}`,
  "food-cart-miami": `Every package includes imported cheeses and charcuterie, seasonal fruit, honey and bread, an on-site attendant, 2 hours of continuous service, delivery, setup and breakdown. Every item is labeled; vegetarian and nut-free options with notice. Tell us about allergies when you book. ${TRAVEL_NOTE} ${SALES_TAX_NOTE}`,
};

export const SIGNATURE_SAVINGS =
  "Save about 10% (up to $1,050) compared with booking the Flower Cart and Charcuterie Cart Experiences separately.";

export const BOOKING_PARAGRAPH =
  "Booking takes three steps. First, check your date with our short form; it’s free. Within one business day we send a proposal for your event. To reserve your date, sign the agreement and pay a 30% non-refundable retainer. The balance is due 14 days before your event.";

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

/** Lines shown under an experience's price table. */
export function priceNotes(slug: string): string[] {
  if (slug === "olivella-signature-experience") {
    return [
      SIGNATURE_SAVINGS,
      `Includes everything in the Flower Cart and Charcuterie Cart Experiences. ${TRAVEL_NOTE} ${SALES_TAX_NOTE}`,
    ];
  }
  const note = INCLUDED_NOTES[slug];
  return note ? [note] : [SALES_TAX_NOTE];
}
