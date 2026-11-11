// Central place for business details.
// Update these as the real branding and contact info come in.
export const site = {
  name: "Olivella",
  tagline:
    "Floral and charcuterie experiences for weddings, showers and celebrations across Miami, Fort Lauderdale and the Palm Beaches.",
  description:
    "Olivella brings a pick-your-own flower cart and a Mediterranean charcuterie cart, hosted by our attendants, to weddings, showers and celebrations across Miami, Fort Lauderdale and the Palm Beaches.",

  // Canonical host. www.olivellamiami.com should 301 to this at the host/DNS level.
  url: "https://olivellamiami.com",

  // Legal name for the footer copyright. Replace with the business's legal
  // name exactly as registered once the owner sends it.
  legalName: "Olivella",

  whatsappUrl: `https://wa.me/17865571878?text=${encodeURIComponent("Hi Olivella, I'd like to check a date.")}`,

  email: "olivellamiami@gmail.com",
  phoneDisplay: "(786) 557-1878",
  phoneHref: "+17865571878",

  instagramHandle: "olivellamiami",
  instagramUrl: "https://instagram.com/olivellamiami",

  city: "Miami",
  region: "FL",
  regionName: "Florida",
  serviceArea: "Miami, Fort Lauderdale and the Palm Beaches",

  // Formspree AJAX endpoint shared by the contact form, newsletter form and
  // the Stripe webhook's order notifications.
  formspreeEndpoint: "https://formspree.io/f/xaqzdpyo",
} as const;

export const navLinks = [
  { href: "/catering-services", label: "Experiences" },
  { href: "/locations", label: "Areas We Serve" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const serviceDropdown = [
  { href: "/flower-cart-miami", label: "Flower Cart" },
  { href: "/food-cart-miami", label: "Charcuterie Cart" },
  { href: "/olivella-signature-experience", label: "Signature Experience" },
] as const;
