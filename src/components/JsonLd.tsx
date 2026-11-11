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
    telephone: "+1-786-557-1878",
    image: `${site.url}/opengraph-image`,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Miami-Dade County, FL" },
      { "@type": "AdministrativeArea", name: "Broward County, FL" },
      { "@type": "AdministrativeArea", name: "Palm Beach County, FL" },
    ],
    sameAs: [site.instagramUrl],
    makesOffer: [
      {
        "@type": "Offer",
        url: `${site.url}/flower-cart-miami`,
        priceSpecification: { "@type": "PriceSpecification", minPrice: 1500, priceCurrency: "USD" },
        itemOffered: {
          "@type": "Service",
          name: "The Flower Cart Experience",
          description:
            "An interactive flower cart: each guest chooses their stems and our attendant wraps a bouquet for them to take home.",
        },
      },
      {
        "@type": "Offer",
        url: `${site.url}/food-cart-miami`,
        priceSpecification: { "@type": "PriceSpecification", minPrice: 1500, priceCurrency: "USD" },
        itemOffered: {
          "@type": "Service",
          name: "The Charcuterie Cart Experience",
          description:
            "A Mediterranean charcuterie cart with imported cheeses and charcuterie, seasonal fruit, honey and bread, hosted by our attendant.",
        },
      },
      {
        "@type": "Offer",
        url: `${site.url}/olivella-signature-experience`,
        priceSpecification: { "@type": "PriceSpecification", minPrice: 2700, priceCurrency: "USD" },
        itemOffered: {
          "@type": "Service",
          name: "The Signature Experience",
          description:
            "The flower cart and the Mediterranean charcuterie cart together, styled in one color story.",
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
