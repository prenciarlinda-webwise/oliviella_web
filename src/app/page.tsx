import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import Button from "@/components/Button";
import MatchTicker from "@/components/MatchTicker";
import {
  OliveSprig,
  FlowerBloom,
  LeafSmall,
  Quote,
  ArrowRight,
  SoccerBall,
} from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Food And Flower Cart in Miami",
  description: site.description,
  alternates: { canonical: "/" },
};

const products = [
  {
    image: "/images/food-cart.jpeg",
    alt: "Charcuterie food cart styled with cheeses, cured meats, fruit and crackers",
    name: "Charcuterie carts and boards",
    copy: "Charcuterie carts and boards loaded with seasonal cheeses, cured meats, honey, fresh fruit and warm bread, styled to anchor your Miami event.",
    tone: "from-olive-mist to-cream",
  },
  {
    image: "/images/flower-cart-miami.jpeg",
    alt: "Flower cart styled for a Miami event",
    name: "Flower cart experience",
    copy: "A vintage flower cart your guests pick fresh stems from and take home as a keepsake, a popular wedding and bridal shower experience across South Florida.",
    tone: "from-blush-soft to-cream",
  },
];

const features = [
  {
    title: "Locally sourced in Miami",
    copy: "We source cheeses, produce and flowers fresh from Miami markets and South Florida growers for every charcuterie board and flower cart.",
  },
  {
    title: "Custom event styling",
    copy: "Your colors, guest count and occasion shape every charcuterie board and flower arrangement we build.",
  },
  {
    title: "Full setup and cleanup",
    copy: "We deliver, style on site and clear everything away, so your charcuterie cart and flower cart are stress free.",
  },
];

const gameDayPoints = [
  "Delivered and styled before kickoff, so you never miss a goal.",
  "Boards and carts that feed your whole crew, from a few friends to a full house.",
  "Customized in your team's colors on request.",
];

export default function HomePage() {
  return (
    <>
      {/* Game-day promo ribbon (top) */}
      <MatchTicker />

      {/* Hero */}
      <section className="relative w-full">
        <Image
          src="/images/hero-image.jpeg"
          alt="Olivella food and flower cart experience at a Miami event"
          width={1536}
          height={1024}
          priority
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-olive-deep/55">
          <Container className="rise text-center">
            <h1 className="text-balance text-5xl text-cream sm:text-6xl lg:text-7xl">
              Food &amp; Flower Cart in Miami
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/85">
              {site.name} designs Mediterranean charcuterie carts and
              pick-your-own flower carts for weddings, bridal showers and
              parties across Miami and South Florida.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button href="/catering-services" withArrow>
                See our experiences
              </Button>
              <Button href="/contact" variant="light">
                Get a Miami event quote
              </Button>
            </div>
          </Container>
        </div>
      </section>

      {/* Game-day promo ribbon (bottom) */}
      <MatchTicker reverse />

      {/* Game day */}
      <section id="game-day" className="scroll-mt-24 py-20 sm:py-24">
        <Container>
          <div className="overflow-hidden rounded-[2.5rem] border-t-4 border-marigold bg-olive-deep ring-1 ring-white/10">
            <div className="grid items-stretch lg:grid-cols-2">
              <div className="relative">
                <Image
                  src="/images/event-planning-miami.jpeg"
                  alt="Event planning setup in Miami styled for a World Cup watch party"
                  width={1024}
                  height={1536}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-auto"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-olive-deep via-olive-deep/30 to-transparent lg:bg-gradient-to-r"
                />
              </div>
              <div className="p-8 text-cream sm:p-12">
                <span className="inline-flex items-center gap-2 rounded-full bg-marigold px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-olive-deep">
                  <SoccerBall className="h-4 w-4" />
                  Matchday menu &middot; June 11&ndash;July 19
                </span>
                <h2 className="mt-5 font-body text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-cream sm:text-5xl">
                  Charcuterie for the{" "}
                  <span className="text-marigold-bright">big matches</span>
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/80">
                  From the June 11 kickoff to the final, the world&apos;s biggest
                  matches roll through Miami. {site.name} delivers game-day
                  charcuterie carts and boards across {site.serviceArea}, set up
                  before kickoff so you never miss a goal.
                </p>
                <ul className="mt-7 space-y-3.5">
                  {gameDayPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-cream/90"
                    >
                      <SoccerBall className="mt-0.5 h-5 w-5 shrink-0 text-marigold" />
                      <span className="font-semibold">{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Button href="/contact" variant="accent" withArrow>
                    Reserve your game-day spread
                  </Button>
                  <span className="text-sm font-medium text-blush">
                    Add a flower cart to match your team colors.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Intro */}
      <section className="py-20 sm:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Image
              src="/images/get-to-know-olivella.jpeg"
              alt="Olivella styled event setup with charcuterie and flowers"
              width={1536}
              height={1024}
              className="w-full h-auto"
            />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              About {site.name}
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              A Miami charcuterie and flower cart studio
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {site.name} is a Miami event styling studio specializing in
              Mediterranean charcuterie carts and flower carts. We build
              every charcuterie spread by hand and fill each flower cart fresh
              that morning for bridal showers, birthdays, baby showers, corporate
              events and intimate weddings across {site.serviceArea}.
            </p>
            <div className="mt-7">
              <Button href="/catering-services" variant="secondary" withArrow>
                See our event styling
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Full-width floral showcase */}
      <section className="relative w-full">
        <Image
          src="/images/floral-setup-events.jpeg"
          alt="Full floral event setup styled by Olivella in Miami"
          width={1254}
          height={1254}
          sizes="100vw"
          className="w-full h-auto"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-olive-deep/50 via-transparent to-transparent"
        />
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-2xl text-cream drop-shadow sm:text-3xl">
          Every detail, styled fresh for your event
        </p>
      </section>

      {/* Products */}
      <section className="bg-cream-deep/50 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              Our services
            </span>
            <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
              Charcuterie carts and flower cart experiences
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Book one service for your Miami event or pair them together.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.name}
                className={`group overflow-hidden rounded-[2rem] bg-gradient-to-br ${product.tone} ring-1 ring-white/60 transition-shadow hover:shadow-xl hover:shadow-olive/10`}
              >
                <div>
                  <Image
                    src={product.image}
                    alt={product.alt}
                    width={1023}
                    height={1537}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 sm:p-10">
                  <h3 className="text-3xl text-olive-deep">{product.name}</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-soft">
                    {product.copy}
                  </p>
                  <a
                    href="/catering-services"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-olive transition-colors group-hover:text-olive-deep"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="bg-olive py-20 text-cream sm:py-24">
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
                  <LeafSmall className="h-7 w-7 text-blush" />
                </div>
                <h3 className="mt-5 text-2xl text-cream">{feature.title}</h3>
                <p className="mt-2 text-cream/75">{feature.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonial */}
      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl text-center">
          <Quote className="mx-auto h-10 w-10 text-blush" />
          <blockquote className="mt-6 font-display text-3xl leading-snug text-olive-deep sm:text-4xl">
            The charcuterie cart was the star of my bridal shower and
            the flower cart had everyone smiling. {site.name} thought of every
            little detail.
          </blockquote>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Camila R, Coral Gables
          </p>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush via-blush-soft to-olive-mist px-8 py-16 text-center ring-1 ring-white/60 sm:px-16">
            <FlowerBloom className="absolute -left-6 -top-6 h-32 w-32 text-rose/30" />
            <OliveSprig className="absolute -bottom-6 -right-6 h-32 w-32 text-olive/30" />
            <h2 className="text-4xl text-olive-deep sm:text-5xl">
              Book a charcuterie table or flower cart in Miami
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Tell us about your event and we will send ideas and a quote for
              your charcuterie cart or flower cart, usually within one business
              day.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/contact" withArrow>
                Get in touch
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
