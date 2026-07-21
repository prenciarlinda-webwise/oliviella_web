import "server-only";

import { site } from "@/lib/site";

// Order-notification "email" via Formspree — the same endpoint already used
// by the contact and newsletter forms, so there's no separate account, API
// key or sender domain to configure. Stripe remains the source of truth
// either way; this is best-effort.

export type OrderNotification = {
  experienceName: string;
  tierLabel: string;
  eventDate: string;
  depositFormatted: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  stripeId: string;
  amountFormatted: string;
};

export async function sendOrderNotification(
  order: OrderNotification,
): Promise<boolean> {
  try {
    const res = await fetch(site.formspreeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: `Booking request — confirm to capture: ${order.experienceName} — ${order.eventDate}`,
        _replyto: order.customerEmail,
        experience: order.experienceName,
        guest_tier: order.tierLabel,
        event_date: order.eventDate,
        deposit_authorized: `${order.amountFormatted} (of ${order.depositFormatted}) — held, not yet captured`,
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone || "Not provided",
        notes: order.notes || "None",
        stripe_reference: order.stripeId,
        action_needed:
          "Confirm availability, then capture the payment in the Stripe Dashboard to charge the deposit and finalize this booking.",
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        "[email] Formspree rejected the order notification",
        res.status,
        detail,
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Failed to send order notification", err);
    return false;
  }
}
