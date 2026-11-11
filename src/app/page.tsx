import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Button from "@/components/Button";
import {
  OliveSprig,
  FlowerBloom,
  ArrowRight,
  AttendantIcon,
  SparkleIcon,
} from "@/components/icons";
import { formatTierPrice, type Experience } from "@/lib/products";
import { readExperiences } from "@/lib/products-data";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Flower Cart & Charcuterie Cart in Miami | Olivella",
  absoluteTitle: true,
  description:
    "Flower cart and Mediterranean charcuterie cart experiences in Miami, starting at $1,500, hosted by our attendants. Serving Miami, Fort Lauderdale and the Palm Beaches.",
  path: "/",
});

// Card copy and imagery per experience; names and prices come from the catalog.
const cards: Record<string, { copy: string; image: string; alt: string; tone: string; extra?: string }> = {
  "flower-cart-miami": {
    copy: "Guests choose their own stems and our attendant wraps each bouquet to take home.",
    image: "/images/flower-cart.jpeg",
    alt: "Flower cart styled for a Miami celebration",
    tone: "from-blush-soft to-cream",
  },
  "food-cart-miami": {
    // TODO(photos): replace with a Mediterranean charcuterie photo from the styled shoot.
    copy: "Imported cheeses and charcuterie with seasonal fruit, honey and bread, hosted by our attendant.",
    image: "/images/food-cart.jpeg",
    alt: "Mediterranean charcuterie cart with cheeses, charcuterie and fruit",
    tone: "from-olive-mist to-cream",
  },
  "olivella-signature-experience": {
    copy: "Both carts together, styled in one color story.",
    image: "/images/flower-and-food-cart.jpeg",
    alt: "A flower cart and a charcuterie cart styled together",
    tone: "from-blush-soft to-cream",
    extra: "Save about 10%",
  },
};

const steps = [
  { n: "01", title: "Check your date.", copy: "It’s free and takes about a minute." },
  { n: "02", title: "Get your proposal in one business day.", copy: "We send a proposal built around your event." },
  { n: "03", title: "We set up, host and clear away.", copy: "You enjoy the celebration with your guests." },
];

const features = [
  {
    icon: AttendantIcon,
    title: "An attendant at every cart",
    copy: "An Olivella attendant hosts each cart, wrapping bouquets and keeping the charcuterie fresh.",
  },
  {
    icon: FlowerBloom,
    title: "Premium stems, imported cheeses",
    copy: "Premium seasonal stems and imported cheeses and charcuterie with fresh South Florida fruit.",
  },
  {
    icon: SparkleIcon,
    title: "Full setup and cleanup",
    copy: "We deliver, style on site and clear everything away, so your day stays stress free.",
  },
];

function startingPrice(experience: Experience): string {
  const first = experience.pricing.tiers.find((t) => t.priceCents !== null);
  return first ? formatTierPrice(first).replace("Starting at", "from") : "";
}

export default async function HomePage() {
  const experiences = (await readExperiences()).filter((e) => cards[e.slug]);

  return (
    <>
      {/* Hero */}
      <section className="relative w-full min-h-[560px] sm:min-h-[620px] lg:min-h-[760px]">
        <Image
          src="/images/food-and-flower-cart.jpeg"
          alt="Olivella flower cart and charcuterie cart at a Miami celebration"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-olive-deep/55">
          <Container className="rise text-center">
            <h1 className="mx-auto max-w-4xl text-balance text-5xl text-cream sm:text-6xl lg:text-7xl">
              Floral and charcuterie experiences for Miami celebrations
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/85">
              Guests choose their own bouquet, gather around a Mediterranean
              charcuterie cart, and our attendants host it all, for weddings,
              showers and celebrations across Miami, Fort Lauderdale and the
              Palm Beaches.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              <Button href="/book" withArrow>
                Check your date
              </Button>
              <Link
                href="/catering-services"
                className="text-sm font-semibold uppercase tracking-[0.12em] text-cream underline underline-offset-4 hover:text-blush"
              >
                See prices
              </Link>
            </div>
          </Container>
        </div>
      </section>

      {/* Founding clients */}
      <section className="pt-10">
        <Container>
          <div className="mx-auto max-w-3xl rounded-3xl bg-rose/60 px-6 py-6 text-center ring-1 ring-white/60 sm:px-10">
            <p className="text-lg leading-relaxed text-olive-deep">
              <strong className="font-semibold">Now booking our first season.</strong>{" "}
              Our first 10 clients receive a complimentary extra hour of
              service.{" "}
              <Link href="/book" className="font-semibold underline underline-offset-2">
                Check your date
              </Link>{" "}
              to reserve a founding spot.
            </p>
          </div>
        </Container>
      </section>

      {/* About strip — text only until the styled photo shoot */}
      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            About {site.name}
          </span>
          <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
            A Miami charcuterie and flower cart studio
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            {site.name} is a Miami event studio specializing in Mediterranean
            charcuterie carts and flower carts. Imported cheeses and charcuterie
            with fresh South Florida fruit and flowers, chosen for every event.
          </p>
          <div className="mt-7">
            <Button href="/catering-services" variant="secondary" withArrow>
              See the experiences
            </Button>
          </div>
        </Container>
      </section>

      {/* Experiences */}
      <section className="bg-cream-deep/50 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              Our experiences
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              Choose your experience
            </h2>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {experiences.map((experience) => {
              const card = cards[experience.slug];
              return (
                <article
                  key={experience.slug}
                  className={`group flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br ${card.tone} ring-1 ring-white/60 transition-shadow hover:shadow-xl hover:shadow-olive/10`}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7 sm:p-8">
                    <h3 className="text-3xl text-olive-deep">{experience.name}</h3>
                    <p className="mt-2 font-display text-xl text-olive">
                      {startingPrice(experience)}
                      {card.extra && (
                        <span className="ml-2 font-body text-sm font-semibold text-berry">
                          · {card.extra}
                        </span>
                      )}
                    </p>
                    <p className="mt-3 flex-1 text-base leading-relaxed text-ink-soft">
                      {card.copy}
                    </p>
                    <Link
                      href={`/${experience.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-olive-deep transition-colors hover:text-olive"
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              How it works
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              Three simple steps
            </h2>
          </div>
          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="rounded-3xl bg-white/60 p-8 ring-1 ring-olive-mist">
                <span className="font-display text-5xl text-olive-soft">{step.n}</span>
                <h3 className="mt-3 text-2xl text-olive-deep">{step.title}</h3>
                <p className="mt-2 text-ink-soft">{step.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Olivella */}
      <section className="bg-olive-deep py-20 text-cream sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blush">
              Why {site.name}
            </span>
            <h2 className="mt-4 text-4xl text-cream sm:text-5xl">
              Miami charcuterie and flower carts, fully handled
            </h2>
          </div>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream/15">
                  <feature.icon className="h-7 w-7 text-blush" />
                </div>
                <h3 className="mt-5 text-2xl text-cream">{feature.title}</h3>
                <p className="mt-2 text-cream/75">{feature.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* TODO(owner): "Meet the founder" strip — round photo + "Hi, I'm [first name].
          I design every event and I'm there for every setup." Add once the owner
          sends her photo and first name. */}

      {/* Final call to action */}
      <section className="py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush via-blush-soft to-olive-mist px-8 py-16 text-center ring-1 ring-white/60 sm:px-16">
            <FlowerBloom className="absolute -left-6 -top-6 h-32 w-32 text-rose/30" />
            <OliveSprig className="absolute -bottom-6 -right-6 h-32 w-32 text-olive/30" />
            <h2 className="text-4xl text-olive-deep sm:text-5xl">
              Ready to see your date?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Tell us your date and guest count and we&apos;ll send your
              proposal within one business day.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/book" withArrow>
                Check your date
              </Button>
            </div>
            <p className="mt-5 text-sm text-ink-soft">
              Or{" "}
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-olive-deep underline underline-offset-2"
              >
                message us on WhatsApp
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
