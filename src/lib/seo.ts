import type { Metadata } from "next";
import { site } from "@/lib/site";

// Per-page metadata. Next overwrites (does not merge) `openGraph`/`twitter`
// from the root layout when a page sets them, so every page builds its own
// og:title, og:description and og:url here — that's what makes each page show
// its own title when shared on WhatsApp.
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  robots,
}: {
  /** Page title; the layout template appends " | Olivella" unless absoluteTitle. */
  title: string;
  description: string;
  /** Path starting with "/" (use "/" for the homepage). */
  path: string;
  absoluteTitle?: boolean;
  robots?: Metadata["robots"];
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  const url = path === "/" ? site.url : `${site.url}${path}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      url,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(robots ? { robots } : {}),
  };
}
