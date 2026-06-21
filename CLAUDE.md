@AGENTS.md

# Session notes (for continuity)

## Checkout 503 — root cause & fix (resolved 2026-06-07)
- `POST /api/checkout` returning **503 (Service Unavailable)** is **expected behavior, not a bug** when Stripe isn't configured.
- The guard is `src/app/api/checkout/route.ts:59` → calls `isStripeConfigured()` in `src/lib/stripe.ts:30`, which is just `Boolean(process.env.STRIPE_SECRET_KEY)`.
- Cause: there was **no `.env.local`** (only `.env.example`), so `STRIPE_SECRET_KEY` was unset.
- Fix applied: created `.env.local` (git-ignored, confirmed via `git check-ignore`) seeded from `.env.example`.
- **Remaining manual step:** paste a real Stripe **test** key (`sk_test_...`) into `STRIPE_SECRET_KEY`, optionally set `STRIPE_WEBHOOK_SECRET` via `stripe listen --forward-to localhost:3000/api/stripe/webhook`, then **restart `npm run dev`** (env is read only at startup).

## "Deploying local schemas" clarification
- There is **no deploy step, database, ORM, or migration tooling** in this project. `package.json` scripts are only `dev`/`build`/`start`/`lint`; deps are next/react/react-dom/server-only/stripe.
- The only "schema" in the codebase is `src/components/JsonLd.tsx` — **schema.org JSON-LD structured data** for SEO (`LocalBusiness` + charcuterie/flower-cart offers), rendered statically server-side. Nothing is "deployed"; the file is intact.

## Interrupt status
- The accidental interrupt left **nothing half-written or corrupted**. Git is clean apart from unrelated `main.py` placeholder churn. No dev server is currently running (the live node processes are PyCharm language servers, not Next.js).
- Console noise from `quillbot-content.js` is a browser extension — irrelevant to the app.

## Useful pointers
- Checkout route: `src/app/api/checkout/route.ts` (CSRF same-origin check, rate limit, server-side price re-derivation, Stripe idempotency key).
- Stripe singleton: `src/lib/stripe.ts` (lazy client, `getStripe()` throws if key absent).
- Booking form (client): `src/components/BookingForm.tsx` (posts to `/api/checkout`, redirects to Stripe URL).
- Env template: `.env.example` (Stripe keys, booking rules, site URL, Resend email vars).
