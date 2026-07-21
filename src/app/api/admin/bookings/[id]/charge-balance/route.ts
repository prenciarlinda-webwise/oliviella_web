import { type NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin";
import { getStripe } from "@/lib/stripe";

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

    await stripe.invoiceItems.create({
      customer: customerId,
      amount: amountCents,
      currency: pi.currency,
      description: `${pi.metadata.experienceName || "Event"} — remaining balance (${pi.metadata.tierLabel || ""}, event ${pi.metadata.eventDate || ""})`,
    });

    // auto_advance: false + explicit finalize/send below, rather than relying
    // on Stripe's async auto-advance, so this sequence is deterministic and
    // can't race a still-draft invoice.
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: 7,
      auto_advance: false,
      pending_invoice_items_behavior: "include",
      metadata: { relatedPaymentIntentId: pi.id },
    });
    await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(invoice.id);

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
