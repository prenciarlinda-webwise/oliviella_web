import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { LeafSmall, OliveSprig, FlowerBloom } from "@/components/icons";
import { getExperience } from "@/lib/products-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Food Cart Miami | Mediterranean Grazing Cart Experience",
  description:
    "Book a luxury Mediterranean grazing cart in Miami for weddings, corporate events, bridal showers and parties. Premium imported cheeses, charcuterie and seasonal accompaniments styled by Olivella across South Florida.",
  alternates: { canonical: "/food-cart-miami" },
};

const events = [
  "Weddings",
  "Bridal Showers",
  "Baby Showers",
  "Birthday Celebrations",
  "Corporate Events",
  "Brand Activations",
  "Engagement Parties",
  "Grand Openings",
  "Holiday Events",
  "Private Gatherings",
];

export default async function FoodCartMiamiPage() {
  const cart = await getExperience("food-cart-miami");
  if (!cart) return null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 60% at 90% 5%, rgba(231,233,214,0.7) 0%, rgba(250,246,238,0) 60%), radial-gradient(45% 50% at 5% 90%, rgba(231,233,214,0.4) 0%, rgba(250,246,238,0) 60%)",
          }}
        />
        <Container className="relative py-20 text-center sm:py-28">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            Food Cart Miami
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-5xl text-olive-deep sm:text-6xl">
            Mediterranean grazing cart experience in Miami
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            An elevated grazing cart featuring premium imported cheeses, artisanal
            charcuterie, fresh fruits, honey and breads — beautifully styled and
            continuously replenished throughout your event in {site.serviceArea}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/book?experience=food-cart-miami" withArrow>
              Book your food cart
            </Button>
            <Button href="/contact" variant="secondary">
              Request a custom quote
            </Button>
          </div>
        </Container>
      </section>

      {/* Main experience */}
      <section className="py-16 sm:py-20">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Image
              src={cart.image}
              alt={cart.alt}
              width={1023}
              height={1537}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-auto"
            />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              {cart.subtitle}
            </span>
            <h2 className="mt-3 text-4xl text-olive-deep sm:text-5xl">
              {cart.name}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {cart.description}
            </p>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.12em] text-olive-deep">
              Includes
            </p>
            <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {cart.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-soft">
                  <LeafSmall className="mt-0.5 h-5 w-5 shrink-0 text-olive" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="mt-7 rounded-2xl bg-white/70 p-6 ring-1 ring-olive-mist">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-olive">
                Starting Investment
              </p>
              <dl className="mt-4 divide-y divide-olive-mist/70">
                {cart.pricing.tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex items-baseline justify-between gap-4 py-2.5"
                  >
                    <dt className="text-ink-soft">{tier.label}</dt>
                    <dd className="text-right font-display text-xl text-olive-deep">
                      {tier.price}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-7">
              <Button href="/book?experience=food-cart-miami" withArrow>
                Book this experience
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Events */}
      <section className="bg-cream-deep/50 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              Perfect for
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              Miami food cart events
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Our grazing cart transforms any event into a Mediterranean dining
              experience guests will keep talking about.
            </p>
          </div>
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
            {events.map((event) => (
              <span
                key={event}
                className="rounded-full border border-olive-mist bg-white/60 px-5 py-2 text-sm font-medium text-olive-deep ring-1 ring-white/60"
              >
                {event}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush via-blush-soft to-olive-mist px-8 py-16 text-center ring-1 ring-white/60 sm:px-16">
            <OliveSprig className="absolute -left-6 -top-6 h-32 w-32 text-olive/20" />
            <FlowerBloom className="absolute -bottom-6 -right-6 h-32 w-32 text-rose/30" />
            <h2 className="text-4xl text-olive-deep sm:text-5xl">
              Reserve your grazing cart in {site.city}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Tell us your event date, location and guest count. We reply within
              one business day with a curated proposal for your celebration.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/book?experience=food-cart-miami" variant="secondary" withArrow>
                Book your food cart
              </Button>
              <Button href="/contact" variant="secondary">
                Get in touch
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
