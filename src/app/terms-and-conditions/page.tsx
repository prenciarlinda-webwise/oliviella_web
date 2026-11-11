import Container from "@/components/Container";
import { site } from "@/lib/site";
import { BOOKING_PARAGRAPH } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms and Conditions",
  description: `Terms for booking ${site.name} flower cart and charcuterie cart experiences in Miami, Florida.`,
  path: "/terms-and-conditions",
});

const LAST_UPDATED = "November 2026";

export default function TermsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
          Legal
        </span>
        <h1 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
          Terms and Conditions
        </h1>
        <p className="mt-4 text-sm text-ink-soft">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-sm mt-10 max-w-none text-ink-soft [&_a]:text-olive [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-medium [&_h2]:text-olive-deep [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li]:mt-1">

          <p>
            Please read these Terms and Conditions (&ldquo;Terms&rdquo;) carefully
            before booking or using any services offered by {site.name}
            (&ldquo;we,&rdquo; &ldquo;us&rdquo; or &ldquo;our&rdquo;). By
            submitting a form, paying a retainer, or entering into a service
            agreement with us, you agree to be bound by these Terms.
          </p>

          <h2>1. Services</h2>
          <p>
            {site.name} provides event experiences including The Flower Cart
            Experience, The Charcuterie Cart Experience and The Signature
            Experience (both carts together) for events across{" "}
            {site.serviceArea}.
          </p>

          <h2>2. Inquiries and Proposals</h2>
          <p>
            Submitting an inquiry through our contact form does not constitute a
            booking or reservation. Your date is not held until a signed service
            agreement and retainer payment are received. We will respond to
            inquiries within one business day with a customized proposal.
          </p>

          <h2>3. Booking</h2>
          <p>{BOOKING_PARAGRAPH}</p>

          <h2>4. Prices</h2>
          <p>
            Website prices are starting prices. Your signed proposal is the
            final price. Florida sales tax is added.
          </p>

          <h2>5. Changes and Cancellations</h2>
          <p>
            One free date change if you ask at least 30 days before your event
            and the new date is open; your retainer moves to the new date. If
            you cancel, the retainer is not refunded. Payments made within 14
            days of the event are not refunded.
          </p>
          <p>
            If {site.name} must cancel due to circumstances beyond our control
            (force majeure, illness, emergency), we will refund all amounts paid
            or offer to reschedule at no additional charge.
          </p>

          <h2>6. Food Allergies</h2>
          <p>
            Our charcuterie includes common allergens such as nuts, dairy,
            gluten and pork. Tell us about allergies when you book. Every item
            is labeled, and we can prepare nut-free or vegetarian options on
            request. Because everything is prepared in the same space, we cannot
            guarantee any item is allergen-free. Please share this with your
            guests.
          </p>

          <h2>7. Outdoor Events and Venues</h2>
          <p>
            For outdoor events, please arrange shade or cover and a flat spot
            for the carts. In heavy rain or heat we may move the carts under
            cover to protect guests, food and flowers. You confirm your venue
            allows our carts and tell us any venue rules (load-in times,
            insurance certificate).
          </p>

          <h2>8. Photos</h2>
          <p>
            We may photograph our setup for our website and Instagram. We do not
            post guests&apos; faces without permission. Tell us if you&apos;d
            rather we didn&apos;t take photos.
          </p>

          <h2>9. Promo Codes</h2>
          <p>
            OLIVELLA5 gives 5% off the experience price of one new booking. One
            code per event; codes can&apos;t be combined, except with the
            founding-client extra hour.
          </p>

          <h2>10. Client Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>
              Provide accurate event details including date, location, guest
              count, venue access requirements and any relevant venue policies
            </li>
            <li>
              Ensure adequate space, power access (if required) and safe working
              conditions at the venue
            </li>
            <li>
              Obtain any permits or venue approvals required for our services
            </li>
            <li>
              Provide venue contact information and setup access at least 2 hours
              before the event start time
            </li>
          </ul>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by Florida law, {site.name}&apos;s
            total liability for any claim arising from our services shall not
            exceed the total amount paid by you for the specific service giving
            rise to the claim. We are not liable for indirect, incidental,
            special or consequential damages, including lost profits or
            reputational harm.
          </p>

          <h2>12. Intellectual Property</h2>
          <p>
            All photographs, videos and written content on this website are the
            property of {site.name} and may not be used, reproduced or
            distributed without our written permission. By sharing photos or
            videos of your event with us, you grant us a non-exclusive,
            royalty-free license to use them for marketing purposes, including on
            our website and social media.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Florida, without
            regard to conflict-of-law principles. Any disputes arising from these
            Terms or our services shall be resolved in the state or federal courts
            located in Miami-Dade County, Florida.
          </p>

          <h2>14. Changes to These Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. Changes take
            effect when posted to this page. Service agreements already in place
            are governed by the Terms in effect at the time of signing.
          </p>

          <h2>15. Contact</h2>
          <p>
            Questions about these Terms can be directed to:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
