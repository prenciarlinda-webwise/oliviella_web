import { createHash } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";

import { resolveBooking, checkBookingDate, formatDeposit } from "@/lib/booking";
import { parseBookingInput } from "@/lib/validation";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";

// This is an external-facing payment endpoint, so it must run dynamically on the
// Node runtime and never be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reject bodies larger than this before parsing — the legitimate payload is tiny.
const MAX_BODY_BYTES = 8 * 1024;

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Same-origin check: a cross-site POST won't carry a matching Origin/Host pair.
 * Combined with the JSON content-type requirement, this blocks basic CSRF.
 */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Trusted base URL for redirect targets — env first, else the request origin. */
function baseUrl(req: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return new URL(req.url).origin;
}

export async function POST(req: NextRequest) {
  // 1. CSRF mitigation first: reject untrusted origins before doing anything
  //    else (don't even reveal configuration state to a cross-site caller).
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: "Unsupported content type." },
      { status: 415 },
    );
  }

  // 2. Configuration guard.
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Online booking is not available right now." },
      { status: 503 },
    );
  }

  // 3. Rate limit per IP.
  const limit = rateLimit(`checkout:${clientIp(req)}`, 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  // 4. Read + size-guard the body.
  const rawText = await req.text();
  if (rawText.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }
  let json: unknown;
  try {
    json = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: "Malformed JSON." }, { status: 400 });
  }

  // 5. Validate + sanitize the client payload.
  const parsed = parseBookingInput(json);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Please check the form.", fields: parsed.errors },
      { status: 422 },
    );
  }
  const input = parsed.value;

  // 6. Re-derive everything price/date-related from the trusted catalog.
  const booking = await resolveBooking(input.experienceSlug, input.tierId);
  if (!booking) {
    return NextResponse.json(
      { error: "That experience or guest tier can't be booked online." },
      { status: 422 },
    );
  }
  const dateCheck = checkBookingDate(input.date);
  if (!dateCheck.ok) {
    return NextResponse.json(
      { error: dateCheck.reason, fields: { date: dateCheck.reason } },
      { status: 422 },
    );
  }

  // 7. Create the Checkout Session. Amount is the SERVER deposit, never client.
  const base = baseUrl(req);
  const metadata: Record<string, string> = {
    experienceSlug: booking.experience.slug,
    experienceName: booking.experience.name,
    tierId: booking.tierId,
    tierLabel: booking.tier.label,
    eventDate: dateCheck.date,
    customerName: input.name,
    customerEmail: input.email,
    customerPhone: input.phone,
    notes: input.notes,
  };

  // Idempotency: identical re-submits (double-clicks) reuse the same session
  // within Stripe's 24h window instead of creating duplicates.
  const idempotencyKey = createHash("sha256")
    .update(
      JSON.stringify([
        input.email,
        booking.experience.slug,
        booking.tierId,
        dateCheck.date,
        booking.depositCents,
      ]),
    )
    .digest("hex");

  try {
    const session = await getStripe().checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: booking.currency,
              unit_amount: booking.depositCents,
              product_data: {
                name: `${booking.experience.name} — booking deposit`,
                description: `${booking.tier.label} • Event date ${dateCheck.date} • ${formatDeposit()} deposit to reserve. Balance settled after your custom proposal.`,
              },
            },
          },
        ],
        customer_email: input.email,
        // Always create a real Customer record (not just an email on the
        // session) so this person is findable under Customers/Payments in
        // the Dashboard and reusable for the balance invoice later.
        customer_creation: "always",
        metadata,
        // Hold the deposit rather than charging it immediately, so it can be
        // reviewed and confirmed (date/availability) before capturing in Stripe.
        payment_intent_data: { metadata, capture_method: "manual" },
        success_url: `${base}/book/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/book/cancelled`,
      },
      { idempotencyKey },
    );

    if (!session.url) {
      throw new Error("Stripe session created without a redirect URL.");
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Don't leak internal/Stripe error details to the client.
    console.error("[checkout] Failed to create Stripe session", err);
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again." },
      { status: 502 },
    );
  }
}
