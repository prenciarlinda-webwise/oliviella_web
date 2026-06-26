import type { Metadata } from "next";
import Container from "@/components/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${site.name} event experiences in Miami, Florida.`,
  alternates: { canonical: "/terms-and-conditions" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "June 20, 2025";

export default function TermsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
          Legal
        </span>
        <h1 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-ink-soft">
          Effective date: {EFFECTIVE_DATE}
        </p>

        <div className="prose prose-sm mt-10 max-w-none text-ink-soft [&_a]:text-olive [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-medium [&_h2]:text-olive-deep [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li]:mt-1">

          <p>
            Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully
            before booking or using any services offered by {site.name}
            (&ldquo;we,&rdquo; &ldquo;us&rdquo; or &ldquo;our&rdquo;). By
            submitting an inquiry, paying a deposit, or entering into a service
            agreement with us, you agree to be bound by these Terms.
          </p>

          <h2>1. Services</h2>
          <p>
            {site.name} provides luxury event experiences including but not
            limited to: flower cart experiences, Mediterranean grazing cart
            experiences, the Olivella Signature Experience, and individual
            bouquet services for events across {site.serviceArea}. All pricing listed on
            this website is a &ldquo;starting at&rdquo; figure; final pricing is
            confirmed in your customized proposal.
          </p>

          <h2>2. Inquiries and Proposals</h2>
          <p>
            Submitting an inquiry through our contact form does not constitute a
            booking or reservation. Your date is not held until a signed service
            agreement and deposit payment are received. We will respond to
            inquiries within one business day with a customized proposal.
          </p>

          <h2>3. Booking Deposit</h2>
          <p>
            A non-refundable booking deposit is required to reserve your event
            date. The deposit amount will be specified in your proposal. The
            deposit is applied toward your total invoice. Dates are reserved on a
            first-come, first-served basis; submitting an inquiry does not hold
            your date.
          </p>

          <h2>4. Cancellations and Refunds</h2>
          <ul>
            <li>
              <strong>Cancellations by client:</strong> Booking deposits are
              non-refundable. If you cancel more than 30 days before your event
              date, you may apply the deposit credit toward a rescheduled date
              within 12 months, subject to availability. Cancellations within 30
              days of the event date forfeit the deposit with no credit.
            </li>
            <li>
              <strong>Cancellations by {site.name}:</strong> In the unlikely
              event we must cancel due to circumstances beyond our control (force
              majeure, illness, emergency), we will provide a full refund of all
              amounts paid or offer to reschedule at no additional charge.
            </li>
          </ul>

          <h2>5. Rescheduling</h2>
          <p>
            Requests to reschedule must be made at least 14 days before the
            original event date. Rescheduling is subject to availability and may
            be subject to a rescheduling fee as outlined in your service
            agreement. We cannot guarantee the same pricing for a rescheduled
            date if pricing has changed.
          </p>

          <h2>6. Client Responsibilities</h2>
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

          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by Florida law, {site.name}&apos;s
            total liability for any claim arising from our services shall not
            exceed the total amount paid by you for the specific service giving
            rise to the claim. We are not liable for indirect, incidental,
            special or consequential damages, including lost profits or
            reputational harm.
          </p>

          <h2>8. Food Safety and Allergens</h2>
          <p>
            Our grazing experiences include products containing common allergens
            including dairy, gluten, tree nuts and cured meats. We are not a
            certified allergen-free kitchen. Guests with severe food allergies
            should exercise caution. Please notify us of any severe allergies
            during the inquiry process and we will do our best to accommodate.
          </p>

          <h2>9. Intellectual Property</h2>
          <p>
            All photographs, videos and written content on this website are the
            property of {site.name} and may not be used, reproduced or
            distributed without our written permission. By sharing photos or
            videos of your event with us, you grant us a non-exclusive,
            royalty-free license to use them for marketing purposes, including on
            our website and social media.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Florida, without
            regard to conflict-of-law principles. Any disputes arising from these
            Terms or our services shall be resolved in the state or federal courts
            located in Miami-Dade County, Florida.
          </p>

          <h2>11. Changes to These Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. Changes take
            effect when posted to this page. Service agreements already in place
            are governed by the Terms in effect at the time of signing.
          </p>

          <h2>12. Contact</h2>
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
