import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { LeafSmall, FlowerBloom, OliveSprig } from "@/components/icons";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Olivella | Flower Cart & Charcuterie Cart Studio in Miami",
  description:
    "Meet Olivella, a new Miami studio bringing a pick-your-own flower cart and a Mediterranean charcuterie cart to weddings, showers and celebrations across South Florida.",
  path: "/about",
});

// Founder story — fill these in when the owner sends them. Until `name` is
// set the page shows the studio paragraph instead; until `photo` is set (a
// path under /public) the section is text only.
const founder = {
  name: "",
  story: "", // 1–2 sentences: where she's from, why Mediterranean food and flowers matter to her.
  photo: "",
};

const values = [
  {
    title: "Beauty in every detail",
    copy: "From the first bloom placed in the cart to the last cheese arrangement, every element is considered. We believe the details are what guests remember.",
  },
  {
    title: "Imported cheeses, fresh stems",
    copy: "Imported cheeses and charcuterie with fresh South Florida fruit and flowers, chosen for every event.",
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
        <Container
          className={
            founder.photo
              ? "grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]"
              : "max-w-3xl text-center"
          }
        >
          {founder.photo && (
            <div>
              <Image
                src={founder.photo}
                alt={`${founder.name}, founder of ${site.name}`}
                width={1200}
                height={1500}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-auto w-full rounded-[2rem]"
              />
            </div>
          )}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              Who we are
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              A Miami charcuterie and flower cart studio
            </h2>
            {founder.name ? (
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                Hi, I&apos;m {founder.name}, the founder of {site.name}.{" "}
                {founder.story} I started {site.name} to bring that feeling to
                Miami celebrations: a flower cart your guests remember and a
                table that invites them to linger. I personally design every
                event and I&apos;m on site for every setup.
              </p>
            ) : (
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                {site.name} is a new event studio in {site.city}, Florida,
                bringing a pick-your-own flower cart and a Mediterranean
                charcuterie cart to celebrations: a flower cart your guests
                remember and a table that invites them to linger. Every event
                is designed personally, and we&apos;re on site for every setup.
              </p>
            )}
            <div className="mt-7">
              <Button href="/catering-services" withArrow>
                Explore our experiences
              </Button>
            </div>
          </div>
        </Container>
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
              Tell us your date and guest count and we&apos;ll send your
              proposal within one business day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/book" withArrow>
                Check your date
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
