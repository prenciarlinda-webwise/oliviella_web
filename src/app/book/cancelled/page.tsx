import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Booking Cancelled",
  robots: { index: false, follow: false },
};

export default function BookingCancelledPage() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
          Checkout cancelled
        </span>
        <h1 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
          No payment was taken
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Your date hasn&apos;t been reserved yet. You can pick up right where
          you left off whenever you&apos;re ready — or reach out and we&apos;ll
          help you personally.
        </p>
        <div className="mt-9 flex justify-center gap-3">
          <Button href="/book" withArrow>
            Try again
          </Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </Container>
    </section>
  );
}
