import { createHash } from "node:crypto";

import { type NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PI_ID_RE = /^pi_[A-Za-z0-9]+$/;
const MAX_BODY_BYTES = 2 * 1024;
// Sanity ceiling so a typo (e.g. an extra digit) can't create a wildly wrong
// invoice — raise in code if a real event genuinely needs more.
const MAX_AMOUNT_CENTS = 100_000_00; // $100,000

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi(req);
  if (!auth.ok) return auth.response;

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe isn't configured on this server." }, { status: 503 });
  }

  const { id } = await params;
  if (!PI_ID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid booking id." }, { status: 400 });
  }

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
  const body = (json ?? {}) as Record<string, unknown>;
  const amountCents =
    typeof body.amountCents === "number" ? Math.round(body.amountCents) : NaN;
  const force = body.force === true;

  if (!Number.isInteger(amountCents) || amountCents <= 0 || amountCents > MAX_AMOUNT_CENTS) {
    return NextResponse.json({ error: "Enter a valid amount." }, { status: 422 });
  }

  const stripe = getStripe();

  try {
    const pi = await stripe.paymentIntents.retrieve(id);

    // Only website bookings, and only once the deposit has actually been
    // charged — never invoice a balance on an expired/cancelled hold.
    if (!pi.metadata.experienceSlug) {
      return NextResponse.json({ error: "That payment isn't a website booking." }, { status: 404 });
    }
    if (pi.status !== "succeeded") {
      return NextResponse.json(
        { error: "Capture the deposit before sending the balance invoice." },
        { status: 409 },
      );
    }
    if (!pi.customer) {
      return NextResponse.json(
        {
          error:
            "This booking has no linked Stripe customer. Charge manually in the Stripe Dashboard.",
        },
        { status: 422 },
      );
    }
    if (pi.metadata.balanceStatus === "sent" && !force) {
      return NextResponse.json(
        { error: "A balance invoice was already sent for this booking." },
        { status: 409 },
      );
    }

    const customerId = typeof pi.customer === "string" ? pi.customer : pi.customer.id;

    // Same booking + amount + prior invoice => same Stripe objects. A double
    // click or a retry after a network error returns the existing invoice
    // instead of billing the client twice. A deliberate resend (force) comes
    // after a previous invoice, so it gets a new key.
    const key = createHash("sha256")
      .update(["balance", pi.id, amountCents, pi.metadata.balanceInvoiceId || "first"].join("|"))
      .digest("hex");

    // Create the draft invoice first and attach the line item to IT. The old
    // order (loose "pending" item, then an invoice that sweeps up all pending
    // items) meant a failure mid-way left an orphan item that the next attempt
    // would also bill.
    const invoice = await stripe.invoices.create(
      {
        customer: customerId,
        collection_method: "send_invoice",
        days_until_due: 7,
        auto_advance: false,
        pending_invoice_items_behavior: "exclude",
        metadata: { relatedPaymentIntentId: pi.id },
      },
      { idempotencyKey: `${key}:invoice` },
    );
    await stripe.invoiceItems.create(
      {
        customer: customerId,
        invoice: invoice.id,
        amount: amountCents,
        currency: pi.currency,
        description: `${pi.metadata.experienceName || "Event"} — remaining balance (${pi.metadata.tierLabel || ""}, event ${pi.metadata.eventDate || ""})`,
      },
      { idempotencyKey: `${key}:item` },
    );
    const finalized = await stripe.invoices.retrieve(invoice.id);
    if (finalized.status === "draft") {
      await stripe.invoices.finalizeInvoice(invoice.id, {}, { idempotencyKey: `${key}:finalize` });
    }
    await stripe.invoices.sendInvoice(invoice.id, {}, { idempotencyKey: `${key}:send` });

    // Must spread existing metadata — update() replaces the whole object otherwise.
    await stripe.paymentIntents.update(pi.id, {
      metadata: {
        ...pi.metadata,
        balanceInvoiceId: invoice.id,
        balanceStatus: "sent",
        balanceAmountCents: String(amountCents),
        balanceSentAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ ok: true, invoiceId: invoice.id });
  } catch (err) {
    console.error("[admin/charge-balance] Failed", id, err);
    return NextResponse.json(
      { error: "Failed to send the balance invoice." },
      { status: 502 },
    );
  }
}
