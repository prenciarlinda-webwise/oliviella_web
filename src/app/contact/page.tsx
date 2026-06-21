import type { Metadata } from "next";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import {
  MailIcon,
  PhoneIcon,
  InstagramIcon,
  PinIcon,
  FlowerBloom,
} from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact for a Miami Charcuterie or Flower Cart Quote",
  description:
    "Contact Olivella for a charcuterie or flower cart rental quote in Miami and South Florida. Tell us about your event and we reply within one business day.",
  alternates: { canonical: "/contact" },
};

const details = [
  {
    icon: MailIcon,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: site.phoneDisplay,
    href: `tel:${site.phoneHref}`,
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    value: `@${site.instagramHandle}`,
    href: site.instagramUrl,
  },
  {
    icon: PinIcon,
    label: "Where we serve",
    value: site.serviceArea,
    href: null,
  },
];

const serviceAreas = [
  {
    title: "Primary service areas",
    copy: "Our core Miami neighborhoods, with priority scheduling and same-day styling.",
    cities: [
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
    ],
  },
  {
    title: "Extended service areas",
    copy: "From the beaches up through Broward and the Palm Beaches.",
    cities: [
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
    ],
  },
];

export default function ContactPage() {
  return (
    <>
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 50% at 90% 0%, rgba(241,207,211,0.4) 0%, rgba(250,246,238,0) 60%)",
        }}
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            Say hello
          </span>
          <h1 className="mt-5 text-balance text-5xl text-olive-deep sm:text-6xl">
            Get a Miami charcuterie or flower cart quote
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Tell us about your event and we will send ideas and a quote for your
            charcuterie or flower cart rental. We usually reply
            within one business day.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm />

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl bg-olive-mist/40 p-7 ring-1 ring-white/60">
              <h2 className="font-display text-2xl text-olive-deep">
                Reach us directly
              </h2>
              <ul className="mt-5 space-y-5">
                {details.map((d) => {
                  const content = (
                    <span className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-olive">
                        <d.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                          {d.label}
                        </span>
                        <span className="mt-0.5 block text-olive-deep">
                          {d.value}
                        </span>
                      </span>
                    </span>
                  );
                  return (
                    <li key={d.label}>
                      {d.href ? (
                        <a
                          href={d.href}
                          target={d.href.startsWith("http") ? "_blank" : undefined}
                          rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="transition-opacity hover:opacity-80"
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blush-soft to-cream p-7 ring-1 ring-white/60">
              <FlowerBloom className="absolute -bottom-5 -right-3 h-28 w-28 text-rose/30" />
              <h2 className="font-display text-2xl text-olive-deep">
                Prefer to scroll and message
              </h2>
              <p className="mt-3 text-ink-soft">
                Find our latest tables and blooms on Instagram and slide into
                our messages at{" "}
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-olive underline"
                >
                  @{site.instagramHandle}
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>

    {/* Areas we serve */}
    <section className="bg-cream-deep/40 py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            Areas we serve
          </span>
          <h2 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
            Luxury florals and charcuterie across South Florida
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            {site.name} brings charcuterie carts and pick-your-own flower carts
            directly to your celebration, from Miami to the Palm Beaches.
          </p>
        </div>

        <div className="mt-14 grid gap-7 md:grid-cols-2">
          {serviceAreas.map((group) => (
            <div
              key={group.title}
              className="rounded-[2rem] bg-white/60 p-8 ring-1 ring-white/60 sm:p-10"
            >
              <h3 className="font-display text-2xl text-olive-deep">
                {group.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{group.copy}</p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {group.cities.map((city) => (
                  <li
                    key={city}
                    className="rounded-full bg-olive-mist/50 px-4 py-1.5 text-sm text-olive-deep ring-1 ring-white/60"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-7 flex items-start gap-4 rounded-[2rem] bg-gradient-to-br from-blush-soft to-cream p-8 ring-1 ring-white/60 sm:p-10">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-olive">
            <PinIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-2xl text-olive-deep">
              Destination events
            </h3>
            <p className="mt-2 text-ink-soft">
              Planning something beyond South Florida? We are available for
              destination celebrations and custom experiences upon request.
            </p>
          </div>
        </div>
      </Container>
    </section>
    </>
  );
}
