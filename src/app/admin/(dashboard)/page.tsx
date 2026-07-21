import type { Metadata } from "next";
import { loadBookings } from "@/lib/admin-bookings";
import BookingsTable from "@/components/admin/BookingsTable";

export const metadata: Metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
};

// Shows customer PII pulled live from Stripe — never cache or prerender.
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const { bookings, error } = await loadBookings();

  return (
    <div>
      <h1 className="font-display text-3xl text-olive-deep">Bookings</h1>
      <p className="mt-2 text-ink-soft">
        {bookings.length} booking{bookings.length === 1 ? "" : "s"} — pulled live
        from Stripe. Needs-action bookings (authorized, awaiting capture)
        appear first.
      </p>

      {error && (
        <p className="mt-4 rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </p>
      )}

      <div className="mt-8">
        <BookingsTable bookings={bookings} />
      </div>
    </div>
  );
}
