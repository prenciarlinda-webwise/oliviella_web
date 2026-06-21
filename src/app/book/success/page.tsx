import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { isStripeConfigured, getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function getSummary(sessionId: string | undefined) {
  if (!sessionId || !isStripeConfigured()) return null;
  try {
    // Re-verify the session server-side; never trust the redirect alone.
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return null;
    return {
      name: session.metadata?.customerName ?? "",
      experience: session.metadata?.experienceName ?? "",
      date: session.metadata?.eventDate ?? "",
    };
  } catch {
    return null;
  }
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const summary = await getSummary(session_id);

  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
          Reservation received
        </span>
        <h1 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
          Thank you{summary?.name ? `, ${summary.name}` : ""}!
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Your deposit is confirmed and your date is reserved
          {summary?.experience ? (
            <>
              {" "}
              for <span className="font-semibold">{summary.experience}</span>
            </>
          ) : null}
          {summary?.date ? (
            <>
              {" "}
              on <span className="font-semibold">{summary.date}</span>
            </>
          ) : null}
          . We&apos;ll be in touch shortly with your custom proposal. A receipt
          is on its way to your email.
        </p>
        <div className="mt-9 flex justify-center">
          <Button href="/" withArrow>
            Back to home
          </Button>
        </div>
      </Container>
    </section>
  );
}
