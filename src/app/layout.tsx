import type { Metadata } from "next";
import { Cormorant_Garamond, Mulish } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const body = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mulish",
  display: "swap",
});

// Render every page per request so the strict, nonce-based Content-Security-
// Policy set in `proxy.ts` can be applied to inline scripts. A static page
// can't carry a fresh per-request nonce, so static prerendering is traded away
// here in favor of the stricter CSP. This cascades to all routes below the root
// layout. (Special metadata routes like sitemap/robots have their own config.)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Food And Flower Cart in Miami`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "charcuterie Miami",
    "charcuterie cart Miami",
    "flower cart Miami",
    "charcuterie board Miami",
    "charcuterie catering Miami",
    "event styling Miami",
    "bridal shower charcuterie",
    "wedding flower cart",
    "flower cart South Florida",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | Food And Flower Cart in Miami`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Food And Flower Cart in Miami`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
      style={{ backgroundColor: "#faf6ee" }}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <JsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
