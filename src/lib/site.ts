// Central place for business details.
// Update these as the real branding and contact info come in.
export const site = {
  name: "Olivella",
  tagline: "Charcuterie carts and flower cart in Miami",
  description:
    "Olivella designs Mediterranean charcuterie carts and pick-your-own flower carts for weddings, bridal showers and parties across Miami and South Florida.",

  url: "https://www.olivellamiami.com",

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
  { href: "/catering-services", label: "Services" },
  { href: "/locations", label: "Areas We Serve" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const serviceDropdown = [
  { href: "/flower-cart-miami", label: "Flower Cart Miami" },
  { href: "/food-cart-miami", label: "Food Cart Miami" },
  { href: "/olivella-signature-experience", label: "The Olivella Signature Experience" },
] as const;

export const aboutDropdown = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
] as const;
