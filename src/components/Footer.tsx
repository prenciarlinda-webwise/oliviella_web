import Link from "next/link";
import { navLinks, site } from "@/lib/site";
import NewsletterForm from "./NewsletterForm";
import {
  OliveSprig,
  MailIcon,
  PhoneIcon,
  InstagramIcon,
  PinIcon,
} from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-olive-deep text-cream/90">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8">
        {/* Newsletter signup */}
        <div className="flex flex-col gap-6 border-b border-cream/15 pb-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h4 className="font-display text-2xl text-cream">Stay in the loop</h4>
            <p className="mt-2 text-sm text-cream/70">
              Seasonal menus, new flower carts and game-day dates, straight to
              your inbox.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-12 pt-12 md:grid-cols-3">
          <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <OliveSprig className="h-7 w-7 text-blush" />
            <span className="font-display text-2xl text-cream">{site.name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            Charcuterie carts and pick-your-own flower cart rentals for
            weddings, showers and parties across {site.serviceArea}.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg text-cream">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-cream/70 transition-colors hover:text-blush">
                Home
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-cream/70 transition-colors hover:text-blush"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-cream">Say hello</h4>
          <ul className="mt-4 space-y-3 text-sm text-cream/80">
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition-colors hover:text-blush">
                <MailIcon className="h-5 w-5 text-blush" />
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phoneHref}`} className="flex items-center gap-3 transition-colors hover:text-blush">
                <PhoneIcon className="h-5 w-5 text-blush" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-blush">
                <InstagramIcon className="h-5 w-5 text-blush" />
                @{site.instagramHandle}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <PinIcon className="h-5 w-5 text-blush" />
              {site.serviceArea}
            </li>
          </ul>
        </div>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="transition-colors hover:text-blush">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="transition-colors hover:text-blush">
              Terms &amp; Conditions
            </Link>
            <span>Made with care in {site.city}, {site.regionName}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
