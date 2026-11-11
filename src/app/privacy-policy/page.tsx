import Container from "@/components/Container";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${site.name}: what we collect through our booking form and email list, and how we use it.`,
  path: "/privacy-policy",
});

const LAST_UPDATED = "November 2026";

export default function PrivacyPolicyPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
          Legal
        </span>
        <h1 className="mt-4 text-4xl text-olive-deep sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-ink-soft">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-sm mt-10 max-w-none text-ink-soft [&_a]:text-olive [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-medium [&_h2]:text-olive-deep [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li]:mt-1">

          <p>
            {site.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) operates the website{" "}
            <a href={site.url} target="_blank" rel="noopener noreferrer">
              {site.url}
            </a>{" "}
            (the &ldquo;Site&rdquo;). This Privacy Policy explains what personal
            information we collect, how we use it, and your rights under
            applicable law, including the{" "}
            <strong>Florida Information Protection Act (FIPA), Fla. Stat. § 501.171</strong>.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>Information you provide directly</h3>
          <p>
            When you use our booking form, we collect your name, email, phone,
            event details and any food allergies you tell us about. We use this
            only to plan and quote your event.
          </p>
          <p>
            Allergy details are kept only for that event and shared only with
            the staff serving it.
          </p>

          <h3>Email list</h3>
          <p>
            If you join our email list, we store your email address to send our
            newsletter and offers. You can unsubscribe at any time. We never
            sell personal information.
          </p>

          <h3>Information collected automatically</h3>
          {/* TODO(launch): confirm which tags GTM-5J9VLXHM loads. If it includes
              a Meta (Facebook/Instagram) pixel, add it to this paragraph. */}
          <p>
            We use Google Tag Manager and Google Analytics to understand how
            visitors use our site, for example which pages are viewed. These
            tools may set cookies. You can opt out with Google&apos;s browser
            add-on or your browser settings.
          </p>

          <h3>Cookies</h3>
          <p>
            Apart from the analytics cookies described above, this Site does not
            set advertising cookies. Third-party services we use (Formspree for
            form submissions, Stripe for card payments) may set their own
            cookies when you interact with them. Please review their privacy
            policies for details.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the personal information you provide to:</p>
          <ul>
            <li>Respond to your inquiry or event request</li>
            <li>Prepare and send a customized event proposal or quote</li>
            <li>Process retainer and balance payments for a booked event</li>
            <li>Communicate with you about your event before, during and after the service date</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>
            We do not sell, rent or trade your personal information to any third
            party for marketing purposes.
          </p>

          <h2>3. Third-Party Service Providers</h2>
          <p>
            We share your information only with the following processors, each
            engaged solely to help us deliver our services:
          </p>
          <ul>
            <li>
              <strong>Formspree</strong> — processes contact form submissions on
              our behalf. Data is transmitted to Formspree servers and forwarded
              to our business email. See{" "}
              <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                formspree.io/legal/privacy-policy
              </a>
              .
            </li>
            <li>
              <strong>Stripe</strong> — processes card payments for a booked
              event&apos;s retainer and balance. We never see or store your full card
              number. See{" "}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
                stripe.com/privacy
              </a>
              .
            </li>
            <li>
              <strong>Resend</strong> — sends transactional booking confirmation
              emails. See{" "}
              <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                resend.com/legal/privacy-policy
              </a>
              .
            </li>
            <li>
              <strong>Google (Tag Manager and Analytics)</strong> — measures how
              visitors use the Site. See{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                policies.google.com/privacy
              </a>
              .
            </li>
            <li>
              <strong>Vercel</strong> — hosts this website and may process server
              log data. See{" "}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                vercel.com/legal/privacy-policy
              </a>
              .
            </li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to
            fulfill the purposes described in this policy — typically the
            duration of our business relationship plus a reasonable period
            afterward for record-keeping — unless a longer retention period is
            required by law.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement reasonable administrative and technical safeguards to
            protect your personal information, including encrypted connections
            (HTTPS/TLS), strict Content Security Policy headers, and limiting
            data access to authorized personnel only. In the event of a data
            breach affecting your personal information, we will notify you as
            required by the Florida Information Protection Act.
          </p>

          <h2>6. Children&apos;s Privacy</h2>
          <p>
            This Site is not directed at individuals under 13 years of age. We
            do not knowingly collect personal information from children. If you
            believe a child has provided us with personal data, please contact us
            and we will delete it promptly.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion
            of the personal information we hold about you. To exercise any of
            these rights, please contact us using the information below. We will
            respond within 30 days.
          </p>

          <h2>8. Links to Other Websites</h2>
          <p>
            Our Site may contain links to Instagram and other third-party
            websites. We are not responsible for the privacy practices of those
            sites and encourage you to review their policies before providing any
            personal information.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The
            &ldquo;Last updated&rdquo; date at the top of this page will reflect the date of the latest
            revision. Continued use of the Site after changes are posted
            constitutes your acceptance of the updated policy.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise
            your data rights, please contact us:
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
            <li>
              <strong>Service area:</strong> {site.serviceArea}
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
