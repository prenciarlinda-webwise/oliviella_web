import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { FlowerBloom, OliveSprig, LeafSmall } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Olivella's flower cart and charcuterie cart experiences in Miami — how they work, what's included, pricing, booking and more.",
  alternates: { canonical: "/faq" },
};

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
        a: "We currently serve Miami and surrounding South Florida areas. Travel fees may apply for locations outside our standard service area.",
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
        q: "How does the Flower Cart work?",
        a: "Guests select flowers from a beautifully styled cart and create a bouquet to take home. The experience is interactive, elegant, and designed to leave guests with a meaningful keepsake from your event.",
      },
      {
        q: "Can guests create their own bouquets?",
        a: "Yes! Our Build-Your-Own Bouquet Experience allows guests to personally select and arrange their own bouquets from the flower selection available at your event.",
      },
      {
        q: "Is bouquet assembly included?",
        a: [
          "You may choose between two experiences:",
          "Build-Your-Own Bouquet Experience — Guests select and arrange their own bouquets.",
          "Full-Service Bouquet Experience — Guests select their flowers, and an Olivella attendant professionally wraps and finishes each bouquet.",
        ],
      },
      {
        q: "How many stems are included in each bouquet?",
        a: "Each bouquet includes approximately 8 premium stems, creating a full and beautiful arrangement.",
      },
      {
        q: "What flowers are included?",
        a: "Flower selections vary based on season and availability and may include roses, spray roses, carnations, chrysanthemums, stock, alstroemeria, greenery, and other premium blooms.",
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
          "Optional attendant service",
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
        a: "Guests enjoy a beautifully displayed grazing experience featuring artisan cheeses, cured meats, fresh fruits, nuts, crackers, breads, and gourmet accompaniments.",
      },
      {
        q: "Can dietary preferences be accommodated?",
        a: "Yes. We can offer vegetarian-friendly selections and accommodate certain dietary preferences with advance notice.",
      },
      {
        q: "Is an attendant included?",
        a: "Yes. A professional Olivella attendant can assist with guest service, restocking, and maintaining the presentation throughout the event.",
      },
    ],
  },
  {
    title: "Booking & Logistics",
    items: [
      {
        q: "Can I combine the Flower Cart and Charcuterie Cart?",
        a: "Absolutely. Many clients choose both experiences to create a unique and elevated event for their guests.",
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
        a: "Yes. A non-refundable retainer is required to secure your event date. The remaining balance is due before the event.",
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
        q: "Can I see photos of previous events before booking?",
        a: "Of course. We would be happy to share our portfolio and inspiration gallery so you can explore past Olivella experiences and find inspiration for your event.",
      },
      {
        q: "How do I book?",
        a: "Simply submit an inquiry through our website with your event date, location, estimated guest count, and preferred service. We will contact you to discuss availability, customization options, and provide a personalized proposal.",
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

export default function FaqPage() {
  return (
    <>
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
              <Button href="/contact" withArrow>
                Get in touch
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
