import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import {
  isBookableSlug,
  type Experience,
} from "@/lib/products";

// File-backed Experiences catalog. `data/products.json` (gitignored) is the
// sole source of truth once it exists on disk — self-seeded from
// DEFAULT_EXPERIENCES below on first read. Editing DEFAULT_EXPERIENCES after
// that point has no effect on a live site; it's the initial seed, not a
// fallback consulted on every request.

const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

const DEFAULT_EXPERIENCES: Experience[] = [
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
        { id: "flower-cart-miami-tier-0", label: "Up to 50 Guests", price: "Starting at $1,300", priceCents: 130_000 },
        { id: "flower-cart-miami-tier-1", label: "51–100 Guests", price: "Starting at $2,050", priceCents: 205_000 },
        { id: "flower-cart-miami-tier-2", label: "101–150 Guests", price: "Starting at $2,950", priceCents: 295_000 },
        { id: "flower-cart-miami-tier-3", label: "151–200 Guests", price: "Starting at $3,850", priceCents: 385_000 },
        { id: "flower-cart-miami-tier-4", label: "200+ Guests", price: "Custom proposal", priceCents: null },
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
        { id: "food-cart-miami-tier-0", label: "Up to 50 Guests", price: "Starting at $1,500", priceCents: 150_000 },
        { id: "food-cart-miami-tier-1", label: "51–100 Guests", price: "Starting at $2,400", priceCents: 240_000 },
        { id: "food-cart-miami-tier-2", label: "101–150 Guests", price: "Starting at $3,500", priceCents: 350_000 },
        { id: "food-cart-miami-tier-3", label: "151–200 Guests", price: "Starting at $4,500", priceCents: 450_000 },
        { id: "food-cart-miami-tier-4", label: "200+ Guests", price: "Custom proposal", priceCents: null },
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
        { id: "olivella-signature-experience-tier-0", label: "Up to 50 Guests", price: "Starting at $2,400", priceCents: 240_000 },
        { id: "olivella-signature-experience-tier-1", label: "51–100 Guests", price: "Starting at $3,800", priceCents: 380_000 },
        { id: "olivella-signature-experience-tier-2", label: "101–150 Guests", price: "Starting at $5,200", priceCents: 520_000 },
        { id: "olivella-signature-experience-tier-3", label: "151–200 Guests", price: "Starting at $6,300", priceCents: 630_000 },
        { id: "olivella-signature-experience-tier-4", label: "200+ Guests", price: "Custom proposal", priceCents: null },
      ],
    },
    bookable: true,
  },
];

async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  const tmp = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  );
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, filePath);
}

// Single-process write serialization — this app runs as one persistent Node
// process on the VPS (not serverless), so an in-memory lock per file is
// enough to prevent a lost-update race between two near-simultaneous admin
// writes. No cross-instance locking needed.
const locks = new Map<string, Promise<unknown>>();
function withFileLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const run = (locks.get(key) ?? Promise.resolve()).then(fn, fn);
  locks.set(
    key,
    run.catch(() => {}),
  );
  return run as Promise<T>;
}

export async function readExperiences(): Promise<Experience[]> {
  try {
    const raw = await fs.readFile(PRODUCTS_PATH, "utf8");
    return JSON.parse(raw) as Experience[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    await withFileLock("products", () =>
      atomicWriteJson(PRODUCTS_PATH, DEFAULT_EXPERIENCES),
    );
    return DEFAULT_EXPERIENCES;
  }
}

export async function writeExperiences(next: Experience[]): Promise<void> {
  await withFileLock("products", () => atomicWriteJson(PRODUCTS_PATH, next));
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
