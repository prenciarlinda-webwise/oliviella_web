import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { LeafSmall, FlowerBloom, OliveSprig } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Olivella | Luxury Event Experiences in Miami",
  description:
    "Learn about Olivella — the Miami event studio behind luxury flower cart and charcuterie cart experiences for weddings, bridal showers, birthdays and corporate events across South Florida.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Beauty in every detail",
    copy: "From the first bloom placed in the cart to the last cheese arrangement, every element is considered. We believe the details are what guests remember.",
  },
  {
    title: "Fresh, locally sourced",
    copy: "We source seasonal flowers and premium cheeses, produce and charcuterie fresh from Miami markets and South Florida growers for every event.",
  },
  {
    title: "Stress-free experience",
    copy: "We deliver, set up on site and clear everything away so you can be fully present for your celebration without worrying about a thing.",
  },
  {
    title: "Designed around you",
    copy: "Your colors, your guest count, your vision — we design every cart and board around what makes your event uniquely yours.",
  },
];

const eventTypes = [
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

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 60% at 90% 5%, rgba(241,207,211,0.45) 0%, rgba(250,246,238,0) 60%), radial-gradient(45% 50% at 5% 90%, rgba(231,233,214,0.6) 0%, rgba(250,246,238,0) 60%)",
          }}
        />
        <Container className="relative py-20 text-center sm:py-28">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            Our story
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-5xl text-olive-deep sm:text-6xl">
            About Olivella
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            A Miami event studio bringing Mediterranean-inspired floral artistry
            and charcuterie experiences to weddings, showers, birthdays and
            celebrations across South Florida.
          </p>
        </Container>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Image
              src="/images/flower-setup.jpeg"
              alt="Olivella flowers and graze cart experience, beautifully curated"
              width={1536}
              height={1024}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="w-full h-auto"
            />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              Who we are
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              A Miami charcuterie and flower cart studio
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {site.name} is a luxury event styling studio based in {site.city},
              Florida, specializing in Mediterranean charcuterie carts and
              interactive flower cart experiences. We were born from a love of
              beautiful gatherings — the kind where every detail feels considered
              and every guest feels celebrated.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              We build every charcuterie spread by hand and fill each flower cart
              fresh on the morning of your event, serving bridal showers,
              birthdays, baby showers, corporate events and intimate weddings
              across {site.serviceArea}.
            </p>
            <div className="mt-7">
              <Button href="/catering-services" withArrow>
                Explore our experiences
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Full-width image break */}
      <section className="relative w-full">
        <Image
          src="/images/flower-cart-events.jpeg"
          alt="Full floral event setup styled by Olivella in Miami"
          width={1448}
          height={1086}
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-olive-deep/60 via-transparent to-transparent pb-10">
          <p className="font-display text-2xl text-cream drop-shadow sm:text-3xl">
            Every detail, styled fresh for your event
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-deep/50 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              What we believe
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              The Olivella way
            </h2>
          </div>
          <div className="mt-14 grid gap-7 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-3xl bg-white/60 p-8 ring-1 ring-olive-mist"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-olive-mist">
                  <LeafSmall className="h-6 w-6 text-olive" />
                </div>
                <h3 className="mt-5 text-2xl text-olive-deep">{value.title}</h3>
                <p className="mt-2 text-ink-soft">{value.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Events we serve */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              Perfect for
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              Every celebration deserves Olivella
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              We bring our flower carts and charcuterie carts to all kinds of
              events across {site.serviceArea}.
            </p>
          </div>
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
            {eventTypes.map((event) => (
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
      <section className="pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush via-blush-soft to-olive-mist px-8 py-16 text-center ring-1 ring-white/60 sm:px-16">
            <FlowerBloom className="absolute -left-6 -top-6 h-32 w-32 text-rose/30" />
            <OliveSprig className="absolute -bottom-6 -right-6 h-32 w-32 text-olive/30" />
            <h2 className="text-4xl text-olive-deep sm:text-5xl">
              Let&apos;s create something beautiful
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Tell us about your event and we will send ideas and a custom
              proposal within one business day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact" withArrow>
                Get in touch
              </Button>
              <Button href="/catering-services" variant="secondary">
                See our experiences
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
