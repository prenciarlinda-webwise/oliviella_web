// Central place for business details.
// Update these as the real branding and contact info come in.
export const site = {
  name: "Olivella",
  tagline: "Charcuterie carts and flower cart rental in Miami",
  description:
    "Olivella designs Mediterranean charcuterie carts and pick-your-own flower cart rentals for weddings, bridal showers and parties across Miami and South Florida.",

  url: "https://www.olivellamiami.com",

  email: "olivellamiami@gmail.com",
  phoneDisplay: "(786) 557-1878",
  phoneHref: "+17865571878",

  instagramHandle: "olivella",
  instagramUrl: "https://instagram.com/olivella",

  city: "Miami",
  region: "FL",
  regionName: "Florida",
  serviceArea: "Miami, Fort Lauderdale and the Palm Beaches",

  // Formspree AJAX endpoint shared by the contact + newsletter forms.
  formspreeEndpoint: "https://formspree.io/f/xaqzdpyo",
} as const;

export const navLinks = [
  { href: "/catering-services", label: "Services" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const serviceDropdown = [
  { href: "/flower-cart-miami", label: "Flower Cart Miami" },
  { href: "/food-cart-miami", label: "Food Cart Miami" },
  { href: "/olivella-signature-experience", label: "The Olivella Signature Experience" },
  { href: "/riviera-bouquet-bar", label: "Bouquet Bar" },
] as const;
