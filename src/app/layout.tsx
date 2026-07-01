import type { Metadata } from "next";
import { Cormorant_Garamond, Mulish } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

const GTM_ID = "GTM-5J9VLXHM";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
      style={{ backgroundColor: "#faf6ee" }}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        {/* GTM noscript fallback — must be first inside <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <JsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
      <Script
        id="gtm-init"
        nonce={nonce}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
        }}
      />
    </html>
  );
}
