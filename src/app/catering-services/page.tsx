import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { OliveSprig, FlowerBloom, LeafSmall } from "@/components/icons";
import {
  experiences,
  addOns,
  isBookableSlug,
  type Experience,
} from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Food &amp; Flower Cart Experiences in Miami",
  description:
    "The Olivella Experiences — a Mediterranean charcuterie cart and a luxury flower cart for Miami weddings, showers and events. Explore what's included, pricing and how to book.",
  alternates: { canonical: "/catering-services" },
};

const accentText = {
  olive: "text-olive",
  rose: "text-rose",
} as const;

const steps = [
  {
    n: "01",
    title: "Tell us about your day",
    copy: "Share your date, your guest count and the feeling you are going for. A few photos you love help too.",
  },
  {
    n: "02",
    title: "We design and quote",
    copy: "We put together a look and a clear quote built around your colors, your space and your budget.",
  },
  {
    n: "03",
    title: "We set up and you celebrate",
    copy: "We arrive early, style everything on site and clear it all away once the last guest has gone.",
  },
];

function PriceTable({ experience }: { experience: Experience }) {
  const { pricing } = experience;
  const heading = pricing.kind === "bouquets" ? "Bouquet Options" : "Starting Investment";

  return (
    <div className="mt-7 rounded-2xl bg-white/70 p-6 ring-1 ring-olive-mist">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.12em] ${accentText[experience.accent]}`}
      >
        {heading}
      </p>
      <dl className="mt-4 divide-y divide-olive-mist/70">
        {pricing.tiers.map((tier) => (
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
      {pricing.note && (
        <p className="mt-4 text-sm italic text-ink-soft">{pricing.note}</p>
      )}
    </div>
  );
}

function ExperienceSection({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  const flip = index % 2 === 1;

  return (
    <section
      id={experience.slug}
      className={`scroll-mt-24 py-16 sm:py-20 ${flip ? "bg-cream-deep/50" : ""}`}
    >
      <Container className="grid items-start gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className={flip ? "lg:order-2" : ""}>
          <Image
            src={experience.image}
            alt={experience.alt}
            width={1402}
            height={1122}
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="w-full h-auto"
          />
        </div>

        {/* Details */}
        <div className={flip ? "lg:order-1" : ""}>
          <span
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${accentText[experience.accent]}`}
          >
            {experience.subtitle}
          </span>
          <h2 className="mt-3 text-4xl text-olive-deep sm:text-5xl">
            {experience.name}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            {experience.description}
          </p>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.12em] text-olive-deep">
            Includes
          </p>
          <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {experience.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-soft">
                <LeafSmall className="mt-0.5 h-5 w-5 shrink-0 text-olive" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <PriceTable experience={experience} />

          <div className="mt-7">
            {isBookableSlug(experience.slug) ? (
              <Button href={`/book?experience=${experience.slug}`} withArrow>
                Book this experience
              </Button>
            ) : (
              <Button href="/contact" withArrow>
                Request a quote
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function CateringServicesPage() {
  return (
    <>
      {/* Intro */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 85% 10%, rgba(231,233,214,0.7) 0%, rgba(250,246,238,0) 60%), radial-gradient(45% 55% at 5% 80%, rgba(241,207,211,0.45) 0%, rgba(250,246,238,0) 60%)",
          }}
        />
        <Container className="relative py-20 text-center sm:py-28">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            The Olivella Experiences
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-5xl text-olive-deep sm:text-6xl">
            Charcuterie &amp; flower cart experiences in Miami
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Mediterranean-inspired floral and charcuterie experiences designed to
            bring beauty, abundance, and connection to every celebration across{" "}
            {site.serviceArea}. Choose the experience that fits your event, then
            reserve your date with us.
          </p>
        </Container>
      </section>

      {/* Quick links */}
      <Container className="pb-4">
        <div className="flex flex-wrap justify-center gap-3">
          {experiences.map((experience) => (
            <a
              key={experience.slug}
              href={`#${experience.slug}`}
              className="rounded-full border border-olive/20 px-5 py-2 text-sm font-medium text-olive-deep transition-colors hover:border-olive hover:bg-olive-mist/50"
            >
              {experience.name}
            </a>
          ))}
        </div>
      </Container>

      {/* Experiences */}
      {experiences.map((experience, index) => (
        <ExperienceSection
          key={experience.slug}
          experience={experience}
          index={index}
        />
      ))}

      {/* Signature add-ons */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              Signature Add-Ons
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              Enhance your experience
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((addOn) => (
              <div
                key={addOn}
                className="flex items-center gap-3 rounded-2xl bg-white/60 p-5 ring-1 ring-olive-mist"
              >
                <FlowerBloom className="h-6 w-6 shrink-0 text-rose" />
                <span className="text-ink-soft">{addOn}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-cream-deep/50 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              How it works
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              Easy from first note to last bloom
            </h2>
          </div>
          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.n}
                className="rounded-3xl bg-white/60 p-8 ring-1 ring-olive-mist"
              >
                <span className="font-display text-5xl text-olive-soft">
                  {step.n}
                </span>
                <h3 className="mt-3 text-2xl text-olive-deep">{step.title}</h3>
                <p className="mt-2 text-ink-soft">{step.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-olive px-8 py-16 text-center text-cream ring-1 ring-white/10 sm:px-16">
            <OliveSprig className="absolute -left-6 -top-6 h-32 w-32 text-cream/15" />
            <FlowerBloom className="absolute -bottom-6 -right-6 h-32 w-32 text-blush/40" />
            <h2 className="text-4xl text-cream sm:text-5xl">
              Reserve your Olivella experience
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-cream/80">
              Tell us your date and guest count, and we will send a curated
              proposal for your celebration in {site.serviceArea}.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/book" variant="light" withArrow>
                Check your date
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
