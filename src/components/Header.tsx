"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { aboutDropdown, serviceDropdown, site } from "@/lib/site";
import { ChevronDown, CloseIcon, MenuIcon, PhoneIcon } from "./icons";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const isServices = pathname.startsWith("/catering-services");

  return (
    <header className="sticky top-0 z-50 border-b border-olive-mist/70 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3.5 sm:px-8">

        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} className="shrink-0">
          <Image
            src="/logo-olivella.png"
            alt={site.name}
            width={1583}
            height={770}
            priority
            className="h-24 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden flex-1 items-center justify-center gap-7 md:flex">
          <Link
            href="/"
            className={`text-sm font-medium tracking-wide transition-colors ${
              pathname === "/" ? "text-olive" : "text-ink-soft hover:text-olive"
            }`}
          >
            Home
          </Link>

          {/* Services — hover dropdown */}
          <div className="group relative">
            <Link
              href="/catering-services"
              className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors ${
                isServices ? "text-olive" : "text-ink-soft hover:text-olive"
              }`}
            >
              Services
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </Link>

            {/* Dropdown panel — pt-2 fills the hover gap so the menu stays open */}
            <div className="pointer-events-none absolute left-1/2 top-full w-72 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-olive-mist bg-cream/98 py-1.5 shadow-lg shadow-olive-deep/8 ring-1 ring-white/50 backdrop-blur">
                <Link
                  href="/catering-services"
                  className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-olive transition-colors hover:bg-olive-mist/50"
                >
                  All experiences
                </Link>
                <div className="mx-4 my-1 border-t border-olive-mist" />
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

          <Link
            href="/locations"
            className={`text-sm font-medium tracking-wide transition-colors ${
              pathname === "/locations" ? "text-olive" : "text-ink-soft hover:text-olive"
            }`}
          >
            Areas We Serve
          </Link>

          <Link
            href="/faq"
            className={`text-sm font-medium tracking-wide transition-colors ${
              pathname === "/faq" ? "text-olive" : "text-ink-soft hover:text-olive"
            }`}
          >
            FAQ
          </Link>

          {/* About — hover dropdown */}
          <div className="group relative">
            <Link
              href="/about"
              className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors ${
                pathname.startsWith("/about") || pathname === "/privacy-policy" || pathname === "/terms-and-conditions"
                  ? "text-olive"
                  : "text-ink-soft hover:text-olive"
              }`}
            >
              About
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="pointer-events-none absolute left-1/2 top-full w-60 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-olive-mist bg-cream/98 py-1.5 shadow-lg shadow-olive-deep/8 ring-1 ring-white/50 backdrop-blur">
                {aboutDropdown.map((item) => (
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

          <Link
            href="/contact"
            className={`text-sm font-medium tracking-wide transition-colors ${
              pathname === "/contact" ? "text-olive" : "text-ink-soft hover:text-olive"
            }`}
          >
            Contact Us
          </Link>
        </div>

        {/* Desktop: phone + book CTA */}
        <div className="hidden items-center gap-5 md:flex">
          <a
            href={`tel:${site.phoneHref}`}
            className="flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-olive"
          >
            <PhoneIcon className="h-4 w-4 text-olive" />
            {site.phoneDisplay}
          </a>
          <Link
            href="/book"
            className="rounded-full bg-olive px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-olive-deep"
          >
            Book your event
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="ml-auto text-olive-deep md:hidden"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-olive-mist/70 bg-cream/98 md:hidden">
          <div className="flex flex-col px-6 py-4">

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                pathname === "/"
                  ? "bg-olive-mist/70 text-olive-deep"
                  : "text-ink-soft hover:bg-blush-soft"
              }`}
            >
              Home
            </Link>

            {/* Services accordion */}
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              className={`flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                isServices ? "text-olive-deep" : "text-ink-soft hover:bg-blush-soft"
              }`}
            >
              <span className={isServices ? "font-semibold" : ""}>Services</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {servicesOpen && (
              <div className="mb-1 ml-3 mt-0.5 space-y-0.5">
                <Link
                  href="/catering-services"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-olive-deep hover:bg-olive-mist/50"
                >
                  All experiences
                </Link>
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

            <Link
              href="/locations"
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                pathname === "/locations"
                  ? "bg-olive-mist/70 text-olive-deep"
                  : "text-ink-soft hover:bg-blush-soft"
              }`}
            >
              Areas We Serve
            </Link>

            <Link
              href="/faq"
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                pathname === "/faq"
                  ? "bg-olive-mist/70 text-olive-deep"
                  : "text-ink-soft hover:bg-blush-soft"
              }`}
            >
              FAQ
            </Link>

            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                pathname === "/about"
                  ? "bg-olive-mist/70 text-olive-deep"
                  : "text-ink-soft hover:bg-blush-soft"
              }`}
            >
              About Us
            </Link>

            <div className="ml-3 space-y-0.5">
              {aboutDropdown.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-olive-mist/50 hover:text-olive-deep"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                pathname === "/contact"
                  ? "bg-olive-mist/70 text-olive-deep"
                  : "text-ink-soft hover:bg-blush-soft"
              }`}
            >
              Contact Us
            </Link>

            <a
              href={`tel:${site.phoneHref}`}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-ink-soft"
            >
              <PhoneIcon className="h-4 w-4 shrink-0 text-olive" />
              {site.phoneDisplay}
            </a>

            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-olive px-5 py-3 text-center text-sm font-semibold text-cream transition-colors hover:bg-olive-deep"
            >
              Book your event
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
