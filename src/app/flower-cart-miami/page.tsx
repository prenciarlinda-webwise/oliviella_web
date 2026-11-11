import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { LeafSmall, FlowerBloom, OliveSprig } from "@/components/icons";
import PriceTable from "@/components/PriceTable";
import { priceNotes } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { getExperience } from "@/lib/products-data";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Flower Cart & Flower Bar in Miami",
  description:
    "Flower cart in Miami from $1,500: guests choose their stems and our attendant wraps a bouquet to take home. Also known as a flower bar or bouquet bar. Serving Miami, Fort Lauderdale and the Palm Beaches.",
  path: "/flower-cart-miami",
});

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

export default async function FlowerCartMiamiPage() {
  const cart = await getExperience("flower-cart-miami");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 60% at 90% 5%, rgba(241,207,211,0.5) 0%, rgba(250,246,238,0) 60%), radial-gradient(45% 50% at 5% 90%, rgba(241,207,211,0.3) 0%, rgba(250,246,238,0) 60%)",
          }}
        />
        <Container className="relative py-20 text-center sm:py-28">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
            Flower Cart Miami
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-5xl text-olive-deep sm:text-6xl">
            Luxury flower cart experience in Miami
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            An interactive floral favor your guests will love: each guest
            chooses their stems and our attendant wraps a bouquet for them to
            take home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/book?experience=flower-cart-miami" withArrow>
              Check your date
            </Button>
          </div>
        </Container>
      </section>

      {/* Main experience */}
      {cart && (
        <section className="py-16 sm:py-20">
          <Container className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <Image
                src={cart.image}
                alt={cart.alt}
                width={1402}
                height={1122}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto"
              />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
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
                    <LeafSmall className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <PriceTable experience={cart}>
                {priceNotes(cart.slug).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </PriceTable>

              <div className="mt-7">
                <Button href="/book?experience=flower-cart-miami" withArrow>
                  Check your date
                </Button>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Events we do */}
      <section className="bg-cream-deep/50 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
              Perfect for
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              Miami flower cart events
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Also known as a flower bar or bouquet bar, it&apos;s the favor
              guests actually keep, for intimate gatherings and large
              celebrations across South Florida.
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
      <section className="pb-24 pt-4">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush via-blush-soft to-cream px-8 py-16 text-center ring-1 ring-white/60 sm:px-16">
            <FlowerBloom className="absolute -left-6 -top-6 h-32 w-32 text-rose/30" />
            <OliveSprig className="absolute -bottom-6 -right-6 h-32 w-32 text-olive/30" />
            <h2 className="text-4xl text-olive-deep sm:text-5xl">
              Reserve your Miami flower cart
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Tell us your event date, guest count and color palette. We reply
              within one business day with a curated proposal for your
              celebration in {site.serviceArea}.
            </p>
            <div className="mt-8 flex flex-col items-center gap-5">
              <Button href="/book?experience=flower-cart-miami" withArrow>
                Check your date
              </Button>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold uppercase tracking-[0.12em] text-olive-deep underline underline-offset-4 hover:text-olive"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
