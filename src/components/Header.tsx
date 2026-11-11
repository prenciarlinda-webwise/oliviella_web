"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, serviceDropdown, site } from "@/lib/site";
import { ChevronDown, CloseIcon, MenuIcon, PhoneIcon } from "./icons";

// Menu order: Home · Experiences (dropdown) · Areas We Serve · FAQ · About · Contact.
// The header is sticky on every screen size, so "Check your date" is always one tap away.

const [experiencesLink, ...otherLinks] = navLinks;

const experiencePaths = [
  experiencesLink.href,
  ...serviceDropdown.map((item) => item.href),
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const isExperiences = experiencePaths.some((p) => pathname.startsWith(p));

  const desktopLink = (active: boolean) =>
    `text-sm font-medium tracking-wide transition-colors ${
      active ? "text-olive-deep" : "text-ink-soft hover:text-olive-deep"
    }`;

  const mobileLink = (active: boolean) =>
    `rounded-xl px-3 py-3 text-base font-medium transition-colors ${
      active ? "bg-olive-mist/70 text-olive-deep" : "text-ink-soft hover:bg-blush-soft"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-olive-mist/70 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-2.5 sm:px-8 md:py-3.5">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} className="shrink-0">
          <Image
            src="/logo-olivella.png"
            alt={site.name}
            width={1583}
            height={770}
            priority
            className="h-14 w-auto md:h-24"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden flex-1 items-center justify-center gap-7 md:flex">
          <Link href="/" className={desktopLink(pathname === "/")}>
            Home
          </Link>

          {/* Experiences — hover dropdown */}
          <div className="group relative">
            <Link
              href={experiencesLink.href}
              className={`flex items-center gap-1 ${desktopLink(isExperiences)}`}
            >
              {experiencesLink.label}
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </Link>

            {/* Dropdown panel — pt-2 fills the hover gap so the menu stays open */}
            <div className="pointer-events-none absolute left-1/2 top-full w-60 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-olive-mist bg-cream/98 py-1.5 shadow-lg shadow-olive-deep/8 ring-1 ring-white/50 backdrop-blur">
                {serviceDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 text-sm text-ink-soft transition-colors hover:bg-olive-mist/50 hover:text-olive-deep"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {otherLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={desktopLink(pathname.startsWith(link.href))}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop: phone + CTA */}
        <div className="hidden items-center gap-5 md:flex">
          <a
            href={`tel:${site.phoneHref}`}
            className="flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-olive-deep"
          >
            <PhoneIcon className="h-4 w-4 text-olive" />
            {site.phoneDisplay}
          </a>
          <Link
            href="/book"
            className="rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-berry transition-colors hover:bg-blush"
          >
            Check your date
          </Link>
        </div>

        {/* Mobile: CTA always visible + burger */}
        <div className="ml-auto flex items-center gap-3 md:hidden">
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="rounded-full bg-rose px-4 py-2 text-sm font-semibold text-berry transition-colors hover:bg-blush"
          >
            Check your date
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-olive-deep"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-olive-mist/70 bg-cream/98 md:hidden">
          <div className="flex flex-col px-6 py-4">
            <Link href="/" onClick={() => setOpen(false)} className={mobileLink(pathname === "/")}>
              Home
            </Link>

            {/* Experiences accordion */}
            <button
              type="button"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className={`flex items-center justify-between ${mobileLink(false)} ${
                isExperiences ? "font-semibold text-olive-deep" : ""
              }`}
            >
              <span>{experiencesLink.label}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {servicesOpen && (
              <div className="mb-1 ml-3 mt-0.5 space-y-0.5">
                {serviceDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm text-ink-soft hover:bg-olive-mist/50 hover:text-olive-deep"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {otherLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={mobileLink(pathname.startsWith(link.href))}
              >
                {link.label}
              </Link>
            ))}

            <a
              href={`tel:${site.phoneHref}`}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-ink-soft"
            >
              <PhoneIcon className="h-4 w-4 shrink-0 text-olive" />
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
