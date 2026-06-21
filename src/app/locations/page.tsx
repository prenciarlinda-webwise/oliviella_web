import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { PinIcon, FlowerBloom } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Flower Cart & Food Cart Locations in Miami | Areas We Serve",
  description:
    "Olivella serves flower cart and food cart events across Miami, Fort Lauderdale and the Palm Beaches. See our primary and extended service areas throughout South Florida.",
  alternates: { canonical: "/locations" },
};

const primaryAreas = [
  "Coral Gables",
  "Coconut Grove",
  "Brickell",
  "Key Biscayne",
  "South Miami",
  "Pinecrest",
  "Coral Way",
  "Downtown Miami",
  "The Roads",
  "Shenandoah",
];

const extendedAreas = [
  "Miami Beach",
  "Bal Harbour",
  "Surfside",
  "Bay Harbor Islands",
  "Sunny Isles Beach",
  "Aventura",
  "Doral",
  "Weston",
  "Fort Lauderdale",
  "Boca Raton",
  "Delray Beach",
  "Palm Beach",
];

export default function LocationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 85% 10%, rgba(231,233,214,0.7) 0%, rgba(250,246,238,0) 60%), radial-gradient(45% 55% at 5% 80%, rgba(241,207,211,0.4) 0%, rgba(250,246,238,0) 60%)",
          }}
        />
        <Container className="relative py-20 text-center sm:py-28">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            Areas We Serve
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-5xl text-olive-deep sm:text-6xl">
            Flower cart &amp; food cart across South Florida
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {site.name} proudly serves clients throughout South Florida, bringing
            luxury floral and grazing experiences directly to your celebration
            in {site.serviceArea}.
          </p>
        </Container>
      </section>

      {/* Service areas */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-7 md:grid-cols-2">
            {/* Primary */}
            <div className="rounded-[2rem] bg-white/60 p-8 ring-1 ring-olive-mist sm:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
                Priority scheduling
              </span>
              <h2 className="mt-3 font-display text-3xl text-olive-deep">
                Primary service areas
              </h2>
              <p className="mt-3 text-ink-soft">
                Our core Miami neighborhoods, with priority scheduling and same-day
                styling available.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {primaryAreas.map((city) => (
                  <li
                    key={city}
                    className="rounded-full bg-olive-mist/60 px-4 py-1.5 text-sm font-medium text-olive-deep ring-1 ring-white/60"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </div>

            {/* Extended */}
            <div className="rounded-[2rem] bg-white/60 p-8 ring-1 ring-olive-mist sm:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
                South Florida coverage
              </span>
              <h2 className="mt-3 font-display text-3xl text-olive-deep">
                Extended service areas
              </h2>
              <p className="mt-3 text-ink-soft">
                From the beaches up through Broward and the Palm Beaches — we
                bring the full Olivella experience wherever you celebrate.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {extendedAreas.map((city) => (
                  <li
                    key={city}
                    className="rounded-full bg-blush-soft px-4 py-1.5 text-sm font-medium text-olive-deep ring-1 ring-white/60"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Destination */}
          <div className="mt-7 flex items-start gap-5 rounded-[2rem] bg-gradient-to-br from-blush-soft to-cream p-8 ring-1 ring-white/60 sm:p-10">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/70 text-olive">
              <PinIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-3xl text-olive-deep">
                Destination events
              </h2>
              <p className="mt-2 text-lg text-ink-soft">
                Planning something beyond South Florida? We are available for
                destination celebrations and fully customized experiences upon
                request. Reach out and tell us about your event.
              </p>
              <div className="mt-5">
                <Button href="/contact" variant="secondary" withArrow>
                  Tell us about your destination event
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What we bring */}
      <section className="bg-olive py-16 text-cream sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blush">
              Fully mobile
            </span>
            <h2 className="mt-4 text-4xl text-cream sm:text-5xl">
              We come to you
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-cream/80">
              Our flower cart and food cart experiences are fully mobile. We
              arrive, style everything on-site, and break down once the last
              guest has gone — no venue setup required on your end.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush-soft to-cream px-8 py-16 text-center ring-1 ring-white/60 sm:px-16">
            <FlowerBloom className="absolute -bottom-6 -right-6 h-28 w-28 text-rose/25" />
            <h2 className="text-4xl text-olive-deep sm:text-5xl">
              Book a flower cart or food cart in {site.city}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Tell us your event date, location and guest count and we will put
              together a curated proposal for your celebration.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/book" withArrow>
                Reserve your experience
              </Button>
              <Button href="/contact" variant="secondary">
                Request a custom quote
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
