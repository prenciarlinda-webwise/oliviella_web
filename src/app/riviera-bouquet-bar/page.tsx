import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { LeafSmall, FlowerBloom, OliveSprig } from "@/components/icons";
import { getExperience } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Riviera Bouquet Bar Miami | Individual Bouquet Experience",
  description:
    "The Riviera Bouquet Bar by Olivella — individual hand-wrapped bouquets for guest favors, intimate gatherings, pop-ups and luxury gifting across Miami and South Florida.",
  alternates: { canonical: "/riviera-bouquet-bar" },
};

const useCases = [
  "Wedding guest favors",
  "Bridal shower gifts",
  "Luxury pop-ups",
  "Brand activations",
  "Corporate gifting",
  "Birthday parties",
  "Intimate gatherings",
  "Holiday events",
];

export default function RivieraBouquetBarPage() {
  const bouquetBar = getExperience("riviera-bouquet-bar");
  if (!bouquetBar) return null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 60% at 90% 5%, rgba(241,207,211,0.5) 0%, rgba(250,246,238,0) 60%), radial-gradient(45% 50% at 5% 90%, rgba(241,207,211,0.25) 0%, rgba(250,246,238,0) 60%)",
          }}
        />
        <Container className="relative py-20 text-center sm:py-28">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
            {bouquetBar.subtitle}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-5xl text-olive-deep sm:text-6xl">
            {bouquetBar.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {bouquetBar.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" withArrow>
              Request a bouquet bar quote
            </Button>
            <Button href="/flower-cart-miami" variant="secondary">
              See the full flower cart
            </Button>
          </div>
        </Container>
      </section>

      {/* Bouquet options */}
      <section className="py-16 sm:py-20">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div className="relative h-80 overflow-hidden rounded-[2.5rem] bg-blush-soft ring-1 ring-white/60 lg:h-full lg:min-h-[26rem]">
            <Image
              src={bouquetBar.image}
              alt={bouquetBar.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-opacity duration-300"
            />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
              What we offer
            </span>
            <h2 className="mt-3 text-4xl text-olive-deep sm:text-5xl">
              Bouquets styled in the Olivella aesthetic
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Each bouquet is hand-wrapped by our floral team using premium
              seasonal blooms, signature Olivella ribbon and wrapping paper —
              ready to give, display or take home.
            </p>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.12em] text-olive-deep">
              Includes
            </p>
            <ul className="mt-4 space-y-3">
              {bouquetBar.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-soft">
                  <LeafSmall className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="mt-7 rounded-2xl bg-white/70 p-6 ring-1 ring-olive-mist">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose">
                Bouquet Options
              </p>
              <dl className="mt-4 divide-y divide-olive-mist/70">
                {bouquetBar.pricing.tiers.map((tier) => (
                  <div
                    key={tier.label}
                    className="flex items-baseline justify-between gap-4 py-2.5"
                  >
                    <dt className="text-ink-soft">{tier.label}</dt>
                    <dd className="text-right font-display text-xl text-olive-deep">
                      {tier.price}
                    </dd>
                  </div>
                ))}
              </dl>
              {bouquetBar.pricing.note && (
                <p className="mt-4 text-sm italic text-ink-soft">
                  {bouquetBar.pricing.note}
                </p>
              )}
            </div>

            <div className="mt-7">
              <Button href="/contact" withArrow>
                Request a quote
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Use cases */}
      <section className="bg-cream-deep/50 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
              Perfect for
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              When every guest deserves a bloom
            </h2>
          </div>
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
            {useCases.map((item) => (
              <span
                key={item}
                className="rounded-full border border-olive-mist bg-white/60 px-5 py-2 text-sm font-medium text-olive-deep ring-1 ring-white/60"
              >
                {item}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush via-blush-soft to-cream px-8 py-16 text-center ring-1 ring-white/60 sm:px-16">
            <FlowerBloom className="absolute -left-6 -top-6 h-32 w-32 text-rose/30" />
            <OliveSprig className="absolute -bottom-6 -right-6 h-32 w-32 text-olive/30" />
            <h2 className="text-4xl text-olive-deep sm:text-5xl">
              Add the Riviera Bouquet Bar to your event
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Tell us your date, guest count and occasion. We will put together
              a bouquet proposal for your celebration in {site.serviceArea}.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact" withArrow>
                Request a quote
              </Button>
              <Button href="/flower-cart-miami" variant="secondary">
                Explore the full flower cart
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
