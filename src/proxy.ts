import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionCookie } from "@/lib/auth/session";

// Per-request Content-Security-Policy with a fresh nonce. Next.js detects the
// nonce in the request's CSP header and automatically applies it to its own
// inline/bootstrap scripts, so we get a strict policy without 'unsafe-inline'
// for scripts. (In Next 16 this file is the renamed "middleware" — `proxy.ts`.)
//
// Trade-off: reading per-request headers opts page routes into dynamic
// rendering. The marketing pages are light, and the booking pages are dynamic
// anyway. If you'd rather keep the marketing pages statically prerendered, drop
// the CSP here and serve a static (nonce-less) CSP from next.config instead.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optimistic admin-auth gate: cheap signature+expiry check only, no fs/DB
  // access (proxy checks must stay fast and are not the sole line of
  // defense — see requireAdmin()/requireAdminApi(), which every admin
  // page/route calls independently and which also enforce role).
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = verifySessionCookie(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://www.google-analytics.com https://www.googletagmanager.com;
    font-src 'self';
    connect-src 'self' https://formspree.io https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net;
    frame-src https://www.googletagmanager.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Run on page routes only — skip API routes, static assets, image
    // optimization, metadata files, and link prefetches.
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
