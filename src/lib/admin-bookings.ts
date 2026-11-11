import "server-only";

import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { readExperiences } from "@/lib/products-data";

// Bookings dashboard data. Deliberately reads live from Stripe on every call
// rather than caching/duplicating anything locally — Stripe stays the single
// source of truth for order/customer PII, nothing sensitive is stored on the
// VPS disk. `list()` (not `search()`) is used because it's strongly
// consistent — a booking a customer just submitted must show up immediately,
// and Stripe's own docs warn `search()` can lag up to about a minute.

export type BookingSummary = {
  id: string;
  status: string;
  createdAt: string;
  currency: string;
  amountCapturable: number;
  amountReceived: number;
  experienceName: string;
  tierLabel: string;
  eventDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  /** (tier's list price - amount already received), clamped at 0. A suggestion only — always editable before charging. */
  suggestedBalanceCents: number;
  balanceStatus: string;
  balanceInvoiceId: string;
  hasCustomer: boolean;
};

export type LoadBookingsResult = {
  bookings: BookingSummary[];
  /** Set when Stripe couldn't be reached/authenticated — shown as a banner, never crashes the page. */
  error: string | null;
};

export async function loadBookings(): Promise<LoadBookingsResult> {
  if (!isStripeConfigured()) {
    return { bookings: [], error: "Stripe is not configured (STRIPE_SECRET_KEY is not set)." };
  }

  let data;
  try {
    const stripe = getStripe();
    // Auto-paginate so older bookings don't silently drop off, and keep only
    // website bookings — balance-invoice payments are PaymentIntents too.
    data = (await stripe.paymentIntents.list({ limit: 100 }).autoPagingToArray({ limit: 500 }))
      .filter((pi) => Boolean(pi.metadata?.experienceSlug));
  } catch (err) {
    console.error("[admin/bookings] Failed to load bookings from Stripe", err);
    return {
      bookings: [],
      error: "Couldn't load bookings from Stripe. Check the Stripe configuration and try again.",
    };
  }

  const experiences = await readExperiences();

  const bookings: BookingSummary[] = data.map((pi) => {
    const m = pi.metadata;
    const experience = experiences.find((e) => e.slug === m.experienceSlug);
    const tier = experience?.pricing.tiers.find((t) => t.id === m.tierId);
    const suggestedBalanceCents = Math.max(0, (tier?.priceCents ?? 0) - pi.amount_received);

    return {
      id: pi.id,
      status: pi.status,
      createdAt: new Date(pi.created * 1000).toISOString(),
      currency: pi.currency,
      amountCapturable: pi.amount_capturable,
      amountReceived: pi.amount_received,
      experienceName: m.experienceName ?? "Unknown experience",
      tierLabel: m.tierLabel ?? "—",
      eventDate: m.eventDate ?? "—",
      customerName: m.customerName ?? "—",
      customerEmail: m.customerEmail ?? "—",
      customerPhone: m.customerPhone ?? "",
      notes: m.notes ?? "",
      suggestedBalanceCents,
      balanceStatus: m.balanceStatus ?? "",
      balanceInvoiceId: m.balanceInvoiceId ?? "",
      hasCustomer: Boolean(pi.customer),
    };
  });

  // Needs-action bookings (authorized, awaiting capture) surface first;
  // list() already returns each group newest-first and Array#sort is stable.
  bookings.sort((a, b) => {
    const aNeeds = a.status === "requires_capture" ? 0 : 1;
    const bNeeds = b.status === "requires_capture" ? 0 : 1;
    return aNeeds - bNeeds;
  });

  return { bookings, error: null };
}
