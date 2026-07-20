import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { sendOrderNotification } from "@/lib/email";
import { formatDeposit } from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort in-memory dedupe so retried webhook deliveries don't email twice
// within an instance's lifetime. For hard guarantees across instances, persist
// processed event IDs in a shared store.
const processed = new Set<string>();

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // The signature is computed over the exact raw bytes — read text, don't parse.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      rawBody,
      signature,
      secret,
    );
  } catch (err) {
    console.error("[webhook] Signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (processed.has(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }
  processed.add(event.id);

  // Deposits use manual capture (see /api/checkout), so the moment a booking
  // request is actually ready to review is when the authorization succeeds —
  // not "checkout.session.completed", whose payment_status stays "unpaid"
  // until someone captures it from the Stripe Dashboard.
  if (event.type === "payment_intent.amount_capturable_updated") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const m = intent.metadata ?? {};
    await sendOrderNotification({
      experienceName: m.experienceName ?? "Unknown experience",
      tierLabel: m.tierLabel ?? "—",
      eventDate: m.eventDate ?? "—",
      depositFormatted: formatDeposit(),
      customerName: m.customerName ?? "—",
      customerEmail: m.customerEmail ?? "—",
      customerPhone: m.customerPhone ?? "",
      notes: m.notes ?? "",
      stripeId: intent.id,
      amountFormatted: formatMoney(intent.amount_capturable, intent.currency),
    });
  }

  // Always 200 on a verified event so Stripe stops retrying.
  return NextResponse.json({ received: true });
}
