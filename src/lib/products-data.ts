import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { isBookableSlug, type Experience } from "@/lib/products";
import { atomicWriteJson, mutateJson, withFileLock, type Mutation } from "@/lib/json-store";

// File-backed Experiences catalog. `data/products.json` (gitignored) is the
// sole source of truth once it exists on disk — self-seeded from
// DEFAULT_EXPERIENCES below on first read. Editing DEFAULT_EXPERIENCES after
// that point has no effect on a live site; it's the initial seed, not a
// fallback consulted on every request.

const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

const DEFAULT_EXPERIENCES: Experience[] = [
  {
    slug: "flower-cart-miami",
    name: "The Flower Cart Experience",
    subtitle: "Interactive Flower Cart",
    description: "An interactive floral favor your guests will love: each guest chooses their stems and our attendant wraps a bouquet for them to take home.",
    image: "/images/flower-card-florida.jpeg",
    alt: "Flower cart with premium seasonal blooms styled for a South Florida event",
    tone: "from-blush-soft to-cream",
    accent: "rose",
    includes: [
      "Styled flower cart",
      "Premium seasonal blooms",
      "About 8 stems per guest",
      "Hand-wrapped bouquets",
      "Signature wrapping paper & ribbon",
      "On-site attendants",
      "Personalized signage",
      "Setup & breakdown"
    ],
    pricing: {
      kind: "guests",
      tiers: [
        {
          id: "flower-cart-miami-guests-upto30",
          label: "Up to 30 Guests",
          priceCents: 150000
        },
        {
          id: "flower-cart-miami-guests-31-50",
          label: "31–50 Guests",
          priceCents: 195000
        },
        {
          id: "flower-cart-miami-guests-51-100",
          label: "51–100 Guests",
          priceCents: 340000
        },
        {
          id: "flower-cart-miami-guests-101-150",
          label: "101–150 Guests",
          priceCents: 470000
        },
        {
          id: "flower-cart-miami-guests-151-200",
          label: "151–200 Guests",
          priceCents: 590000
        },
        {
          id: "flower-cart-miami-guests-200plus",
          label: "200+ Guests",
          priceCents: null
        }
      ]
    },
    bookable: true
  },
  {
    slug: "food-cart-miami",
    name: "The Charcuterie Cart Experience",
    subtitle: "Mediterranean Charcuterie Cart",
    description: "A Mediterranean charcuterie cart with imported cheeses and charcuterie, seasonal fruit, honey and bread, styled for your celebration and hosted by our attendant.",
    image: "/images/food-cart.jpeg",
    alt: "Mediterranean charcuterie cart styled with cheeses, meats and seasonal accompaniments",
    tone: "from-olive-mist to-cream",
    accent: "olive",
    includes: [
      "Fully styled charcuterie cart",
      "Imported cheeses & charcuterie",
      "Seasonal fruit, honey & bread",
      "On-site attendant",
      "Continuous replenishment",
      "Elegant serving ware",
      "Labeled menu & signage",
      "Setup & breakdown"
    ],
    pricing: {
      kind: "guests",
      tiers: [
        {
          id: "food-cart-miami-guests-upto30",
          label: "Up to 30 Guests",
          priceCents: 150000
        },
        {
          id: "food-cart-miami-guests-31-50",
          label: "31–50 Guests",
          priceCents: 150000
        },
        {
          id: "food-cart-miami-guests-51-100",
          label: "51–100 Guests",
          priceCents: 240000
        },
        {
          id: "food-cart-miami-guests-101-150",
          label: "101–150 Guests",
          priceCents: 350000
        },
        {
          id: "food-cart-miami-guests-151-200",
          label: "151–200 Guests",
          priceCents: 450000
        },
        {
          id: "food-cart-miami-guests-200plus",
          label: "200+ Guests",
          priceCents: null
        }
      ]
    },
    bookable: true
  },
  {
    slug: "olivella-signature-experience",
    name: "The Signature Experience",
    subtitle: "Flowers + Charcuterie Combined",
    description: "Our signature immersive experience blending floral artistry and Mediterranean charcuterie into one beautifully curated event centerpiece. Designed for hosts who want more than catering or décor — they want an atmosphere their guests will remember.",
    image: "/images/flower-and-food-cart.jpeg",
    alt: "The Signature Experience: a flower cart and a Mediterranean charcuterie cart styled together",
    tone: "from-blush-soft to-cream",
    accent: "rose",
    includes: [
      "Interactive flower cart",
      "Mediterranean charcuterie cart",
      "Premium floral selections",
      "Imported cheeses & charcuterie",
      "One shared color story",
      "Personalized event details",
      "On-site attendants",
      "Setup & breakdown",
      "Custom signage & menus"
    ],
    pricing: {
      kind: "guests",
      tiers: [
        {
          id: "olivella-signature-experience-guests-upto30",
          label: "Up to 30 Guests",
          priceCents: 270000
        },
        {
          id: "olivella-signature-experience-guests-31-50",
          label: "31–50 Guests",
          priceCents: 310000
        },
        {
          id: "olivella-signature-experience-guests-51-100",
          label: "51–100 Guests",
          priceCents: 520000
        },
        {
          id: "olivella-signature-experience-guests-101-150",
          label: "101–150 Guests",
          priceCents: 740000
        },
        {
          id: "olivella-signature-experience-guests-151-200",
          label: "151–200 Guests",
          priceCents: 935000
        },
        {
          id: "olivella-signature-experience-guests-200plus",
          label: "200+ Guests",
          priceCents: null
        }
      ]
    },
    bookable: true
  }
];

/** Read without taking the lock (seeds the file on first run). */
async function readExperiencesUnlocked(): Promise<Experience[]> {
  try {
    const raw = await fs.readFile(PRODUCTS_PATH, "utf8");
    return JSON.parse(raw) as Experience[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    await atomicWriteJson(PRODUCTS_PATH, DEFAULT_EXPERIENCES);
    return structuredClone(DEFAULT_EXPERIENCES);
  }
}

export async function readExperiences(): Promise<Experience[]> {
  try {
    const raw = await fs.readFile(PRODUCTS_PATH, "utf8");
    return JSON.parse(raw) as Experience[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    return withFileLock("products", readExperiencesUnlocked);
  }
}

/** Locked read-modify-write of the catalog — use this for every admin edit. */
export function mutateExperiences<R>(
  fn: (current: Experience[]) => Mutation<Experience[], R> | Promise<Mutation<Experience[], R>>,
): Promise<R> {
  return mutateJson("products", readExperiencesUnlocked, PRODUCTS_PATH, fn);
}

export async function getExperience(slug: string): Promise<Experience | undefined> {
  const experiences = await readExperiences();
  return experiences.find((experience) => experience.slug === slug);
}

/** Experiences that are bookable online via the deposit flow. */
export async function getBookableExperiences(): Promise<Experience[]> {
  const experiences = await readExperiences();
  return experiences.filter(
    (e) => e.bookable && e.pricing.kind === "guests" && isBookableSlug(e.slug),
  );
}
