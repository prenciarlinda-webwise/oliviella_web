import type { Metadata } from "next";
import Container from "@/components/Container";
import BookingForm from "@/components/BookingForm";
import { bookingWindow, formatDeposit } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Book Your Experience",
  description:
    "Reserve your Olivella experience online. Tell us your event date and guest count, hold your date with a deposit and we will send a custom proposal within one business day.",
  alternates: { canonical: "/book" },
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ experience?: string }>;
}) {
  const { experience } = await searchParams;
  const { minDate, maxDate } = bookingWindow();
  const deposit = formatDeposit();

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            Book your experience
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-balance text-4xl text-olive-deep sm:text-5xl">
            Tell us about your event
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Choose your experience, customize it to your event and reserve
            your date with a <span className="font-semibold">{deposit}</span>{" "}
            deposit hold. We confirm availability before it&apos;s charged,
            then follow up with your custom proposal within one business day.
          </p>
        </div>

        <div className="mt-10">
          <BookingForm
            minDate={minDate}
            maxDate={maxDate}
            initialSlug={experience}
            depositFormatted={deposit}
          />
        </div>
      </Container>
    </section>
  );
}
