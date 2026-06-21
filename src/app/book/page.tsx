import type { Metadata } from "next";
import Container from "@/components/Container";
import BookingForm from "@/components/BookingForm";
import { bookingWindow, formatDeposit } from "@/lib/booking";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reserve Your Date",
  description:
    "Reserve your Olivella experience with a booking deposit. Choose your experience, guest count and date, then pay securely with Stripe.",
  alternates: { canonical: "/book" },
  // A transactional page should not be indexed as marketing content.
  robots: { index: false, follow: true },
};

// Reservations depend on request-time data (today's date, query params).
export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ experience?: string }>;
}) {
  const { experience } = await searchParams;
  const { minDate, maxDate } = bookingWindow();
  const depositLabel = formatDeposit();

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            Reserve your date
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-balance text-4xl text-olive-deep sm:text-5xl">
            Secure your Olivella experience
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Choose your experience and date, and reserve with a {depositLabel}{" "}
            deposit. We&apos;ll follow up with a custom proposal for your
            celebration across {site.serviceArea}.
          </p>
        </div>

        <div className="mt-10">
          <BookingForm
            depositLabel={depositLabel}
            minDate={minDate}
            maxDate={maxDate}
            initialSlug={experience}
          />
        </div>
      </Container>
    </section>
  );
}
