// The Olivella Experiences — single source of truth for our bookable
// experiences. The experiences page and the booking flow both render from this,
// so keep `slug`s and tier order stable: the checkout flow references tiers by
// their index within `pricing.tiers` (see `resolveBooking` in `booking.ts`).
//
// Payment model: reservations charge a flat, server-defined deposit (see
// `booking.ts`) created on the fly via Stripe `price_data` — there are no
// per-tier Stripe Price objects to maintain. If pricing ever moves to charging
// exact tier amounts, add an optional `stripePriceId` to `PriceTier` and have
// `resolveBooking` prefer it. The "Custom proposal" tier (no fixed figure) is
// detected by `isPayableTier` and routed to a quote request instead of checkout.

export type PriceTier = {
  label: string;
  price: string;
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

export const experiences: Experience[] = [
  {
    slug: "flower-cart-miami",
    name: "The Riviera Bloom Cart",
    subtitle: "Interactive Floral Cart Experience",
    description:
      "A luxury flower cart experience where guests receive hand-wrapped bouquets curated with premium seasonal blooms and signature Olivella styling. Designed to feel elegant, interactive, and unforgettable.",
    image: "/images/flower-card-florida.jpeg",
    alt: "Luxury flower cart experience styled for a South Florida event",
    tone: "from-blush-soft to-cream",
    accent: "rose",
    includes: [
      "Luxury flower cart setup",
      "Premium seasonal blooms",
      "Bouquet wrapping station",
      "Signature wrapping paper & ribbon",
      "Personalized signage",
      "On-site attendants",
      "Setup & breakdown",
      "Curated color palette styling",
    ],
    pricing: {
      kind: "guests",
      tiers: [
        { label: "Up to 50 Guests", price: "Starting at $1,300" },
        { label: "51–100 Guests", price: "Starting at $2,050" },
        { label: "101–150 Guests", price: "Starting at $2,950" },
        { label: "151–200 Guests", price: "Starting at $3,850" },
        { label: "200+ Guests", price: "Custom proposal" },
      ],
    },
    bookable: true,
  },
  {
    slug: "food-cart-miami",
    name: "The Mediterranean Table Cart",
    subtitle: "Luxury Grazing Experience",
    description:
      "An elevated grazing cart inspired by the Mediterranean coast, featuring premium imported cheeses, artisanal charcuterie, fresh fruits, honey, breads, and beautifully styled presentation.",
    image: "/images/food-cart.jpeg",
    alt: "Mediterranean grazing cart styled with cheeses, meats and seasonal accompaniments",
    tone: "from-olive-mist to-cream",
    accent: "olive",
    includes: [
      "Fully styled grazing cart",
      "Premium imported cheeses & meats",
      "Seasonal accompaniments",
      "White-glove service",
      "Continuous replenishment",
      "Elegant serving ware",
      "Personalized menus & signage",
      "Setup & breakdown",
    ],
    pricing: {
      kind: "guests",
      tiers: [
        { label: "Up to 50 Guests", price: "Starting at $1,500" },
        { label: "51–100 Guests", price: "Starting at $2,400" },
        { label: "101–150 Guests", price: "Starting at $3,500" },
        { label: "151–200 Guests", price: "Starting at $4,500" },
        { label: "200+ Guests", price: "Custom proposal" },
      ],
    },
    bookable: true,
  },
  {
    slug: "olivella-signature-experience",
    name: "The Olivella Signature Experience",
    subtitle: "Flowers + Grazing Combined",
    description:
      "Our signature immersive experience blending floral artistry and Mediterranean grazing into one beautifully curated event centerpiece. Designed for hosts who want more than catering or décor — they want an atmosphere their guests will remember.",
    image: "/images/flower-and-food-cart.jpeg",
    alt: "The Olivella Signature Experience combining luxury flower cart and Mediterranean grazing",
    tone: "from-blush-soft to-cream",
    accent: "rose",
    includes: [
      "Interactive flower cart",
      "Mediterranean grazing cart",
      "Premium floral selections",
      "Luxury charcuterie service",
      "Signature Olivella styling",
      "Personalized event details",
      "On-site attendants",
      "Setup & breakdown",
      "Custom signage & menus",
    ],
    pricing: {
      kind: "guests",
      tiers: [
        { label: "Up to 50 Guests", price: "Starting at $2,400" },
        { label: "51–100 Guests", price: "Starting at $3,800" },
        { label: "101–150 Guests", price: "Starting at $5,200" },
        { label: "151–200 Guests", price: "Starting at $6,300" },
        { label: "200+ Guests", price: "Custom proposal" },
      ],
    },
    bookable: true,
  },
];

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

export function getExperience(slug: string): Experience | undefined {
  return experiences.find((experience) => experience.slug === slug);
}

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
 * a quote request instead of checkout. We detect it by the absence of a
 * currency figure rather than hard-coding labels, so copy can change freely.
 */
export function isPayableTier(tier: PriceTier): boolean {
  return /\$\s?\d/.test(tier.price);
}

/** Experiences that are bookable online via the deposit flow. */
export function getBookableExperiences(): Experience[] {
  return experiences.filter(
    (e) => e.bookable && e.pricing.kind === "guests" && isBookableSlug(e.slug),
  );
}
