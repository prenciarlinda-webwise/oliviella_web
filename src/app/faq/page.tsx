import Container from "@/components/Container";
import Button from "@/components/Button";
import { FlowerBloom, OliveSprig, LeafSmall } from "@/components/icons";
import { BOOKING_PARAGRAPH } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "How Olivella's flower cart and charcuterie cart work in Miami, what's included, travel fees, food allergies and how booking works. Experiences start at $1,500.",
  path: "/faq",
});

type FaqItem = { q: string; a: string | string[] };
type FaqGroup = { title: string; items: FaqItem[] };

const faqGroups: FaqGroup[] = [
  {
    title: "About Olivella",
    items: [
      {
        q: "What is Olivella?",
        a: "Olivella is a luxury flower cart and charcuterie cart experience designed to elevate weddings, bridal showers, baby showers, birthdays, corporate events, brand activations, and private celebrations. We bring beautifully curated experiences directly to your event, creating memorable moments for your guests.",
      },
      {
        q: "What areas do you serve?",
        a: "Miami-Dade, Broward and Palm Beach counties. Travel is free in Miami-Dade, $150 in Broward and $300 in Palm Beach County.",
      },
    ],
  },
  {
    title: "The Flower Cart",
    items: [
      {
        q: "Can I book only the Flower Cart?",
        a: "Absolutely. The Flower Cart can be booked as a standalone experience or paired with our Charcuterie Cart for a complete Olivella experience.",
      },
      {
        q: "How does the flower cart work?",
        a: "Each guest chooses about 8 stems from the cart and an Olivella attendant wraps them into a bouquet to take home. An attendant is always included.",
      },
      {
        q: "How many stems are included in each bouquet?",
        a: "Each bouquet includes approximately 8 premium stems, creating a full and beautiful arrangement.",
      },
      {
        q: "What flowers are included?",
        a: "Flower selections vary based on season and availability and may include roses, spray roses, stock, alstroemeria, greenery, and other premium blooms.",
      },
      {
        q: "Can I choose my event colors?",
        a: "Yes. We can customize flower selections to complement your event theme, color palette, wedding colors, or brand identity whenever possible.",
      },
      {
        q: "What is included with the Flower Cart?",
        a: [
          "Each Flower Cart package includes:",
          "Fresh seasonal flowers",
          "Premium bouquet wrapping materials",
          "Bouquet station setup",
          "Cart styling and décor",
          "Delivery, setup, and breakdown",
          "On-site attendant",
        ],
      },
    ],
  },
  {
    title: "The Charcuterie Cart",
    items: [
      {
        q: "Can I book only the Charcuterie Cart?",
        a: "Yes. Our Charcuterie Cart is available as a standalone service and can be customized to suit your event style and guest count.",
      },
      {
        q: "How does the Charcuterie Cart work?",
        a: "Guests enjoy a Mediterranean charcuterie cart with imported cheeses and charcuterie, seasonal fruit, honey, bread and accompaniments, hosted by our attendant.",
      },
      {
        q: "Can dietary preferences be accommodated?",
        a: "Yes. We can offer vegetarian-friendly selections and accommodate certain dietary preferences with advance notice.",
      },
      {
        q: "Is an attendant included?",
        a: "Yes. An on-site Olivella attendant is included to serve guests, restock and keep the presentation fresh throughout the event.",
      },
      {
        q: "Can you handle food allergies?",
        a: "Yes. Tell us about any allergies or dietary needs on the booking form. Every item on the cart is labeled, and we can prepare nut-free or vegetarian options. Because everything is prepared in the same space, we can't promise any item is completely allergen-free.",
      },
    ],
  },
  {
    title: "Booking & Logistics",
    items: [
      {
        q: "Can I combine the Flower Cart and Charcuterie Cart?",
        a: "Yes. The Olivella Signature Experience pairs both carts in one color story and costs about 10% less than booking them separately.",
      },
      {
        q: "Do you offer custom branding for corporate events?",
        a: "Yes. We can customize signage, packaging, and presentation for corporate events, product launches, grand openings, and brand activations.",
      },
      {
        q: "How long is the service?",
        a: "Our standard packages include up to 2 hours of service. Additional hours may be added upon request.",
      },
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 4–6 weeks in advance. Popular dates may book earlier, especially during wedding and holiday seasons.",
      },
      {
        q: "Do you require a deposit?",
        a: BOOKING_PARAGRAPH,
      },
      {
        q: "What happens if my guest count changes?",
        a: "Guest counts may be adjusted before your final confirmation date. Additional fees may apply if the guest count increases.",
      },
      {
        q: "Do you handle setup and cleanup?",
        a: "Yes. We take care of delivery, setup, service, and breakdown so you can enjoy your event without the stress.",
      },
      {
        q: "What happens if my event is outdoors?",
        a: "We recommend a covered area or weather backup plan for outdoor events. Our team will work with you to ensure the best setup possible.",
      },
      {
        q: "Can I see photos before booking?",
        a: "Olivella is a new studio opening this season. We're happy to share photos of our styled setups and a sample proposal so you can see exactly what we create.",
      },
      {
        q: "How do I book?",
        a: BOOKING_PARAGRAPH,
      },
    ],
  },
];

function FaqGroup({ group }: { group: FaqGroup }) {
  return (
    <div>
      <h2 className="mb-6 flex items-center gap-3 text-3xl text-olive-deep sm:text-4xl">
        <LeafSmall className="h-6 w-6 shrink-0 text-olive" />
        {group.title}
      </h2>
      <div className="space-y-4">
        {group.items.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl bg-white/60 p-6 ring-1 ring-olive-mist sm:p-8"
          >
            <h3 className="text-lg font-semibold text-olive-deep">{item.q}</h3>
            {Array.isArray(item.a) ? (
              <div className="mt-3 text-ink-soft">
                <p>{item.a[0]}</p>
                <ul className="mt-3 space-y-1.5 pl-4">
                  {item.a.slice(1).map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olive" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-3 text-ink-soft">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// FAQPage structured data, built from the same questions shown on the page.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: Array.isArray(item.a)
          ? `${item.a[0]} ${item.a.slice(1).join("; ")}.`
          : item.a,
      },
    })),
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 55% at 85% 5%, rgba(231,233,214,0.7) 0%, rgba(250,246,238,0) 60%), radial-gradient(45% 50% at 5% 90%, rgba(241,207,211,0.4) 0%, rgba(250,246,238,0) 60%)",
          }}
        />
        <Container className="relative text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            Got questions?
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-balance text-5xl text-olive-deep sm:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Everything you need to know about our flower cart and charcuterie
            cart experiences. Can&apos;t find what you&apos;re looking for?{" "}
            <a href="/contact" className="font-semibold text-olive underline underline-offset-2">
              Just ask us.
            </a>
          </p>
        </Container>
      </section>

      {/* FAQ groups */}
      <section className="pb-20 sm:pb-28">
        <Container className="max-w-3xl">
          <div className="space-y-16">
            {faqGroups.map((group) => (
              <FaqGroup key={group.title} group={group} />
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
              Still have questions?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              We&apos;d love to help. Contact us and let&apos;s create something
              beautiful together.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/book" withArrow>
                Check your date
              </Button>
              <Button href="/catering-services" variant="secondary">
                Explore our experiences
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
