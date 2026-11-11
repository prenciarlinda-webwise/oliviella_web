import Container from "@/components/Container";
import InquiryForm from "@/components/InquiryForm";
import { BOOKING_PARAGRAPH } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Check Your Date",
  description:
    "Check your date for a flower cart or charcuterie cart in Miami. It's free and takes about a minute; we send your proposal within one business day.",
  path: "/book",
  robots: { index: false, follow: true },
});

export const dynamic = "force-dynamic";

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ experience?: string }>;
}) {
  const { experience } = await searchParams;

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
            Free date check
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-balance text-4xl text-olive-deep sm:text-5xl">
            Check your date
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            {BOOKING_PARAGRAPH}
          </p>
        </div>

        <div className="mt-10">
          <InquiryForm initialExperience={experience} minDate={today()} source="book" />
        </div>
      </Container>
    </section>
  );
}
