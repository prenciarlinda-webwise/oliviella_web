"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";

// Compact footer email capture. Same Formspree AJAX path as the contact form
// (cross-origin fetch — the CSP blocks a native `action=` post).
//
// TODO(launch): connect this to the owner's email tool (Mailchimp, Flodesk or
// Klaviyo) so it sends the automatic OLIVELLA5 welcome email. Until then the
// sign-up only reaches the shared inbox via Formspree. Remember to add the
// tool's domain to `connect-src` in src/proxy.ts.

type Status = "idle" | "submitting" | "success" | "error";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        form.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-medium text-blush">
        Welcome! Check your inbox for your 5% code.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          className="w-full rounded-full border border-cream/20 bg-cream/10 px-5 py-3 text-sm text-cream placeholder:text-cream/50 outline-none transition focus:border-blush focus:bg-cream/15"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-full bg-cream px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-olive-deep transition-colors hover:bg-blush-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "…" : "Get 5% off"}
        </button>
      </div>

      {/* Distinguish newsletter signups in the shared inbox + spam honeypot. */}
      <input type="hidden" name="_subject" value="Newsletter signup (OLIVELLA5) — Olivella" />
      <input type="hidden" name="source" value="footer-newsletter" />
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {status === "error" && (
        <p role="alert" className="mt-2 text-xs text-blush">
          That didn&apos;t go through. Please try again.
        </p>
      )}
    </form>
  );
}
