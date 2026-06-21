import { site } from "@/lib/site";

export default function JsonLd() {
  // A `<script type="application/ld+json">` is a non-executable data block, so
  // CSP's script-src/strict-dynamic never applies to it — no nonce is needed
  // (and adding one caused a hydration mismatch, since browsers strip the nonce
  // content attribute from the DOM). This is Next's recommended JSON-LD pattern.
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phoneDisplay,
    image: `${site.url}/opengraph-image`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: site.city,
    },
    sameAs: [site.instagramUrl],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "The Riviera Bloom Cart — Flower Cart Miami",
          description:
            "A luxury flower cart experience where guests receive hand-wrapped bouquets curated with premium seasonal blooms and signature Olivella styling.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "The Mediterranean Table Cart — Food Cart Miami",
          description:
            "An elevated grazing cart inspired by the Mediterranean coast, featuring premium imported cheeses, artisanal charcuterie, fresh fruits, honey, breads, and beautifully styled presentation.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "The Olivella Signature Experience",
          description:
            "Our signature immersive experience blending floral artistry and Mediterranean grazing into one beautifully curated event centerpiece.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "The Riviera Bouquet Bar",
          description:
            "Individual hand-wrapped bouquets perfect for guest favors, intimate gatherings, pop-ups and luxury gifting.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape `<` so a stray "</script>" in any field can't break out of the
      // tag (XSS). Per Next's JSON-LD guide, since JSON.stringify won't.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
