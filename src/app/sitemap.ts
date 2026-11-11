import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/catering-services",
    "/flower-cart-miami",
    "/food-cart-miami",
    "/olivella-signature-experience",
    "/locations",
    "/faq",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
