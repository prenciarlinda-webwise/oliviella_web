"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingSummary } from "@/lib/admin-bookings";

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  requires_capture: { label: "Needs action — deposit authorized", className: "bg-rose/15 text-rose" },
  succeeded: { label: "Deposit captured", className: "bg-olive-mist text-olive-deep" },
  canceled: { label: "Canceled", className: "bg-ink-soft/10 text-ink-soft" },
  processing: { label: "Processing", className: "bg-blush-soft text-olive-deep" },
  requires_payment_method: { label: "Payment failed", className: "bg-rose/15 text-rose" },
  requires_action: { label: "Needs customer action", className: "bg-blush-soft text-olive-deep" },
};

export default function BookingsTable({ bookings }: { bookings: BookingSummary[] }) {
  if (bookings.length === 0) {
    return (
      <p className="rounded-2xl border border-olive-mist bg-white/60 p-8 text-center text-ink-soft">
        No bookings yet.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

function BookingCard({ booking }: { booking: BookingSummary }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBalanceForm, setShowBalanceForm] = useState(false);
  const [amount, setAmount] = useState((booking.suggestedBalanceCents / 100).toFixed(2));

  const status = STATUS_LABELS[booking.status] ?? {
    label: booking.status,
    className: "bg-ink-soft/10 text-ink-soft",
  };

  async function capture() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/capture`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Failed to capture.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  async function chargeBalance(force: boolean) {
    const amountCents = Math.round(Number(amount) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      setError("Enter a valid amount greater than $0.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/charge-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents, force }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Failed to send invoice.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-olive-mist bg-white/70 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${status.className}`}>
            {status.label}
          </span>
          <h2 className="mt-2 text-xl font-semibold text-olive-deep">
            {booking.experienceName} — {booking.tierLabel}
          </h2>
          <p className="text-sm text-ink-soft">Event date: {booking.eventDate}</p>
        </div>
        <div className="text-right text-sm text-ink-soft">
          <p>
            Authorized: <span className="font-semibold text-olive-deep">{formatMoney(booking.amountCapturable || booking.amountReceived, booking.currency)}</span>
          </p>
          {booking.amountReceived > 0 && (
            <p>Captured: <span className="font-semibold text-olive-deep">{formatMoney(booking.amountReceived, booking.currency)}</span></p>
          )}
          <p className="mt-1 text-xs">{booking.id}</p>
        </div>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div><dt className="inline text-ink-soft">Name: </dt><dd className="inline text-ink">{booking.customerName}</dd></div>
        <div><dt className="inline text-ink-soft">Email: </dt><dd className="inline text-ink">{booking.customerEmail}</dd></div>
        <div><dt className="inline text-ink-soft">Phone: </dt><dd className="inline text-ink">{booking.customerPhone || "—"}</dd></div>
      </dl>
      {booking.notes && (
        <p className="mt-3 whitespace-pre-line rounded-xl bg-olive-mist/30 p-3 text-sm text-ink-soft">
          {booking.notes}
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-xl bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {booking.status === "requires_capture" && (
          <button
            type="button"
            onClick={capture}
            disabled={busy}
            className="rounded-full bg-rose px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-olive-deep transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Capturing…" : "Capture deposit"}
          </button>
        )}

        {booking.status === "succeeded" && !booking.hasCustomer && (
          <p className="text-sm text-ink-soft">
            No linked Stripe customer — this booking predates automatic customer
            creation. Charge the balance manually in the Stripe Dashboard.
          </p>
        )}

        {booking.status === "succeeded" && booking.hasCustomer && !showBalanceForm && (
          <button
            type="button"
            onClick={() => setShowBalanceForm(true)}
            className="rounded-full border border-olive-mist px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-olive-deep transition hover:border-olive"
          >
            {booking.balanceStatus === "sent" ? "Send another balance invoice" : "Charge remaining balance"}
          </button>
        )}

        {booking.status === "succeeded" && booking.balanceStatus === "sent" && !showBalanceForm && (
          <span className="text-sm text-ink-soft">Balance invoice already sent ({booking.balanceInvoiceId}).</span>
        )}
      </div>

      {showBalanceForm && (
        <div className="mt-4 rounded-2xl bg-olive-mist/20 p-4">
          <label className="block text-sm font-semibold text-olive-deep" htmlFor={`amount-${booking.id}`}>
            Amount to invoice ({booking.currency.toUpperCase()})
          </label>
          <p className="mt-1 text-xs text-ink-soft">
            Pre-filled from the listed tier price minus the deposit already
            captured — review and edit to match what was actually agreed in
            the proposal.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input
              id={`amount-${booking.id}`}
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-40 rounded-xl border border-olive-mist bg-white px-3 py-2 text-ink outline-none focus:border-olive focus:ring-2 focus:ring-olive/20"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => chargeBalance(booking.balanceStatus === "sent")}
              className="rounded-full bg-rose px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-olive-deep transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send invoice"}
            </button>
            <button
              type="button"
              onClick={() => { setShowBalanceForm(false); setError(null); }}
              className="text-sm font-medium text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
