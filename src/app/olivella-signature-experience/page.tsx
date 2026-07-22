import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { LeafSmall, OliveSprig, FlowerBloom } from "@/components/icons";
import { formatTierPrice } from "@/lib/products";
import { getExperience } from "@/lib/products-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Olivella Signature Experience | Flowers & Grazing in Miami",
  description:
    "The Olivella Signature Experience combines a luxury flower cart and Mediterranean grazing cart into one immersive event centerpiece. Available for weddings, bridal showers and special events across Miami and South Florida.",
  alternates: { canonical: "/olivella-signature-experience" },
};

export default async function OlivellaSignatureExperiencePage() {
  const experience = await getExperience("olivella-signature-experience");
  if (!experience) return null;

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
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
            {experience.subtitle}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-5xl text-olive-deep sm:text-6xl">
            {experience.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {experience.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/book?experience=olivella-signature-experience" withArrow>
              Reserve this experience
            </Button>
            <Button href="/contact" variant="secondary">
              Request a custom quote
            </Button>
          </div>
        </Container>
      </section>

      {/* Experience detail */}
      <section className="py-16 sm:py-20">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Image
              src={experience.image}
              alt={experience.alt}
              width={1024}
              height={1536}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-auto"
            />
          </div>

          <div>
            <p className="mt-1 text-lg leading-relaxed text-ink-soft">
              Designed for hosts who want more than catering or décor — they
              want an atmosphere their guests will remember. The Signature
              Experience pairs our flower cart and grazing cart side by side,
              styled together for a cohesive, stunning presentation across{" "}
              {site.serviceArea}.
            </p>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.12em] text-olive-deep">
              Everything included
            </p>
            <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {experience.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-soft">
                  <LeafSmall className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="mt-7 rounded-2xl bg-white/70 p-6 ring-1 ring-olive-mist">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose">
                Starting Investment
              </p>
              <dl className="mt-4 divide-y divide-olive-mist/70">
                {experience.pricing.tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex items-baseline justify-between gap-4 py-2.5"
                  >
                    <dt className="text-ink-soft">{tier.label}</dt>
                    <dd className="text-right font-display text-xl text-olive-deep">
                      {formatTierPrice(tier)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-7">
              <Button href="/book?experience=olivella-signature-experience" withArrow>
                Reserve your date
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* What sets it apart */}
      <section className="bg-cream-deep/50 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              One cohesive vision
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              Florals and grazing, styled as one
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              The Signature Experience is curated so your flower cart and grazing
              cart share the same color story, the same visual language, and the
              same level of care — creating a moment your guests will photograph
              and remember.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/flower-cart-miami" variant="secondary">
              See the flower cart
            </Button>
            <Button href="/food-cart-miami" variant="secondary">
              See the food cart
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush via-blush-soft to-olive-mist px-8 py-16 text-center ring-1 ring-white/60 sm:px-16">
            <FlowerBloom className="absolute -left-6 -top-6 h-32 w-32 text-rose/30" />
            <OliveSprig className="absolute -bottom-6 -right-6 h-32 w-32 text-olive/30" />
            <h2 className="text-4xl text-olive-deep sm:text-5xl">
              Reserve the Signature Experience
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Tell us your event date, guest count and vision. We reply within
              one business day with a fully curated proposal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/book?experience=olivella-signature-experience" withArrow>
                Book now
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
