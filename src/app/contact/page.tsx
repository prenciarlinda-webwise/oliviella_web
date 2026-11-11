import Link from "next/link";
import Container from "@/components/Container";
import InquiryForm from "@/components/InquiryForm";
import {
  MailIcon,
  PhoneIcon,
  InstagramIcon,
  PinIcon,
  FlowerBloom,
  WhatsAppIcon,
} from "@/components/icons";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Olivella | Check Your Date",
  description:
    "Contact Olivella to check your date for a flower cart or charcuterie cart in Miami, Fort Lauderdale or the Palm Beaches. Free, about one minute; we reply within one business day.",
  path: "/contact",
});

export const dynamic = "force-dynamic";

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

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
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: site.phoneDisplay,
    href: site.whatsappUrl,
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

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ experience?: string }>;
}) {
  const { experience } = await searchParams;

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
            Check your date
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Three short steps, about one minute, and it&apos;s free. We send
            your proposal within one business day.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <InquiryForm initialExperience={experience} minDate={today()} source="contact" />

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
    <section className="bg-cream-deep/40 py-14">
      <Container className="flex items-center justify-center gap-3 text-center">
        <PinIcon className="h-5 w-5 shrink-0 text-olive" />
        <Link
          href="/locations"
          className="font-semibold text-olive-deep underline underline-offset-4 hover:text-olive"
        >
          See the areas we serve
        </Link>
      </Container>
    </section>
    </>
  );
}
