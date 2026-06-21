"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { ArrowRight } from "./icons";

// Submits via fetch to Formspree (see `site.formspreeEndpoint`) rather than a
// native `action=` post, because the site's CSP sets `form-action 'self'` and
// `connect-src 'self' https://formspree.io` — so it has to go out as a
// cross-origin fetch, not a form navigation.

const eventTypes = ["Charcuterie", "Flower cart", "Both", "Not sure yet"];

const inputClasses =
  "w-full rounded-2xl border border-olive-mist bg-white/70 px-4 py-3 text-ink placeholder:text-ink-soft/50 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20";

const labelClasses = "mb-1.5 block text-sm font-semibold text-olive-deep";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        form.reset();
        setStatus("success");
        return;
      }

      // Formspree returns { errors: [{ message }] } on validation/config errors.
      const payload = (await res.json().catch(() => null)) as {
        errors?: { message: string }[];
      } | null;
      const message =
        payload?.errors?.map((e) => e.message).join(", ") ||
        "Something went wrong sending your message. Please try again.";
      setErrorMsg(message);
      setStatus("error");
    } catch {
      setErrorMsg(
        "We could not reach the server. Check your connection and try again.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-olive-mist bg-white/70 p-10 text-center">
        <h3 className="font-display text-3xl text-olive-deep">
          Your note is on its way
        </h3>
        <p className="mt-3 text-ink-soft">
          Thank you &mdash; we have your message and will reply within one
          business day. Prefer email? Reach us anytime at{" "}
          <a
            className="font-semibold text-olive underline"
            href={`mailto:${site.email}`}
          >
            {site.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-olive transition-colors hover:text-olive-deep"
        >
          Send another message
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-olive-mist bg-white/60 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" required placeholder="Olivia Reyes" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required placeholder="you@email.com" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="phone">
            Phone (optional)
          </label>
          <input id="phone" name="phone" placeholder="(305) 555 0142" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="date">
            Event date
          </label>
          <input id="date" name="date" type="date" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="type">
            What are you dreaming of
          </label>
          <select id="type" name="type" defaultValue="Both" className={inputClasses}>
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses} htmlFor="guests">
            Guest count
          </label>
          <input id="guests" name="guests" placeholder="Around 30" className={inputClasses} />
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClasses} htmlFor="message">
          Tell us about your celebration
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="The occasion, your colors, where it is happening and anything else you love."
          className={inputClasses}
        />
      </div>

      {/* Nicer email subject in Formspree, and a honeypot that real visitors
          never see — bots that fill it get filtered out as spam. */}
      <input type="hidden" name="_subject" value={`New event inquiry — ${site.name}`} />
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <button
        type="submit"
        disabled={submitting}
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-olive px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-olive-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <span>{submitting ? "Sending…" : "Send your message"}</span>
        {!submitting && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </button>

      {status === "error" && (
        <p role="alert" className="mt-3 text-sm font-medium text-rose">
          {errorMsg}
        </p>
      )}

      <p className="mt-3 text-xs text-ink-soft">
        Your message goes straight to our inbox and we reply within one business
        day.
      </p>
    </form>
  );
}
