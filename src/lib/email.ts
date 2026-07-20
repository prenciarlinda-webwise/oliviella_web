import "server-only";

// Order-notification email via the Resend HTTP API (no SDK dependency — one
// fetch call). When the keys below are absent we log and no-op so the rest of
// the flow keeps working in dev. Stripe remains the source of truth either way.
//
//   RESEND_API_KEY          – Resend API key
//   ORDER_NOTIFICATION_EMAIL – where order notifications are sent (the business)
//   ORDER_FROM_EMAIL         – verified Resend sender, e.g. bookings@olivella.com

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendOrderNotification(
  order: OrderNotification,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;
  const from = process.env.ORDER_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn(
      "[email] Skipping order notification — RESEND_API_KEY / ORDER_NOTIFICATION_EMAIL / ORDER_FROM_EMAIL not all set.",
      { stripeId: order.stripeId },
    );
    return false;
  }

  const subject = `Booking request — confirm to capture: ${order.experienceName} — ${order.eventDate}`;

  const rows: [string, string][] = [
    ["Experience", order.experienceName],
    ["Guest tier", order.tierLabel],
    ["Event date", order.eventDate],
    [
      "Deposit authorized",
      `${order.amountFormatted} (of ${order.depositFormatted}) — held, not yet captured`,
    ],
    ["Name", order.customerName],
    ["Email", order.customerEmail],
    ["Phone", order.customerPhone || "—"],
    ["Notes", order.notes || "—"],
    ["Stripe reference", order.stripeId],
  ];

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Confirm availability, then capture the payment in the Stripe Dashboard to charge the deposit and finalize this booking.",
  ].join("\n");
  const html = `<h2>New Olivella booking request</h2><p>Confirm availability, then capture the payment in the Stripe Dashboard to charge the deposit and finalize this booking.</p><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="font-weight:600;color:#5b6236">${escapeHtml(
          k,
        )}</td><td>${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: order.customerEmail,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[email] Resend rejected the notification", res.status, detail);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Failed to send order notification", err);
    return false;
  }
}
