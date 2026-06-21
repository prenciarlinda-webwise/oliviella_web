import type { NextConfig } from "next";

// Hardening headers applied to every response. These are static (no per-request
// value), so they live here rather than in the proxy. The Content-Security-
// Policy is per-request (it carries a nonce) and is set in `proxy.ts`.
const securityHeaders = [
  // Force HTTPS for two years, including subdomains. Harmless over plain HTTP
  // in local dev; takes effect once served over TLS in production.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Don't let browsers MIME-sniff responses into a different content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Defense-in-depth against clickjacking (CSP frame-ancestors is the modern
  // equivalent and is also set).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Drop access to powerful features the site doesn't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Prevent cross-origin windows from retaining a reference to this page.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  // Prevent external sites from embedding our resources.
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/events",
        destination: "/catering-services",
        permanent: true,
      },
      {
        source: "/experiences",
        destination: "/catering-services",
        permanent: true,
      },
      // Temporary: route all booking traffic to the contact form until
      // Stripe is configured. Remove once STRIPE_SECRET_KEY is in production.
      {
        source: "/book",
        destination: "/contact",
        permanent: false,
      },
      // Canonical redirect for the short URL variant.
      {
        source: "/terms",
        destination: "/terms-and-conditions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
