import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readExperiences } from "@/lib/products-data";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const experiences = await readExperiences();

  return (
    <div>
      <h1 className="font-display text-3xl text-olive-deep">Products</h1>
      <p className="mt-2 text-ink-soft">
        Edit the 3 Olivella experiences — text, pricing tiers and images.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {experiences.map((experience) => (
          <Link
            key={experience.slug}
            href={`/admin/products/${experience.slug}`}
            className="group overflow-hidden rounded-2xl border border-olive-mist bg-white/70 transition hover:border-olive"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={experience.image}
                alt={experience.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-olive-deep">{experience.name}</h2>
              <p className="mt-1 text-sm text-ink-soft">{experience.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
