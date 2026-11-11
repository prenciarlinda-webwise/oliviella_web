"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { site } from "@/lib/site";
import { ArrowRight } from "./icons";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// The free "check your date" form — identical on /book and /contact.
// Three short steps, no payment. Submits to Formspree (forwarded to
// site.email) as a cross-origin fetch, because the CSP sets
// `form-action 'self'` and allows `connect-src https://formspree.io`.
//
// Only the current step's fields are in the DOM, so `form.reportValidity()`
// validates exactly that step; the values live in React state.

export const EXPERIENCE_OPTIONS = [
  { value: "flower-cart-miami", label: "Flower Cart" },
  { value: "food-cart-miami", label: "Charcuterie Cart" },
  { value: "olivella-signature-experience", label: "Signature (both)" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

const GUEST_OPTIONS = ["Up to 30", "31–50", "51–100", "101–150", "151–200", "200+"];
const SETTING_OPTIONS = ["Indoor", "Outdoor", "Not sure yet"];
const EVENT_TYPE_OPTIONS = [
  { value: "Private", hint: "Wedding, shower, birthday" },
  { value: "Commercial", hint: "Corporate, brand, venue" },
];
const HEARD_OPTIONS = ["Instagram", "Google", "Friend or family", "Venue or planner", "Other"];

const STEPS = ["Your event", "Details", "You"] as const;

const inputCls =
  "w-full rounded-2xl border border-olive-mist bg-white/70 px-4 py-3 text-ink placeholder:text-ink-soft/60 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20 disabled:cursor-not-allowed disabled:bg-cream-deep/60 disabled:text-ink-soft/60";
const labelCls = "mb-1.5 block text-sm font-semibold text-olive-deep";
const tickCls = "mt-2 flex items-center gap-2 text-sm text-ink-soft";

type Values = {
  experience: string;
  date: string;
  dateNotSet: boolean;
  time: string;
  timeNotSet: boolean;
  guests: string;
  location: string;
  locationNotDecided: boolean;
  setting: string;
  eventType: string;
  allergies: string;
  message: string;
  name: string;
  email: string;
  phone: string;
  heardFrom: string;
  promoCode: string;
};

type Status = "idle" | "submitting" | "success" | "error";

function needsAllergies(experience: string) {
  return experience === "food-cart-miami" || experience === "olivella-signature-experience";
}

/** Pill-style radio group; `required` on the inputs lets native validation run. */
function Choice({
  name,
  legend,
  options,
  value,
  onChange,
  columns = "grid-cols-2 sm:grid-cols-4",
}: {
  name: string;
  legend: ReactNode;
  options: { value: string; label: string; hint?: string }[];
  value: string;
  onChange: (v: string) => void;
  columns?: string;
}) {
  return (
    <fieldset>
      <legend className={labelCls}>{legend}</legend>
      <div className={`grid gap-2 ${columns}`}>
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`relative flex cursor-pointer flex-col justify-center rounded-2xl border px-3 py-2.5 text-center text-sm transition-colors focus-within:ring-2 focus-within:ring-olive/30 ${
                checked
                  ? "border-olive bg-olive-mist/70 font-semibold text-olive-deep"
                  : "border-olive-mist bg-white/70 text-ink-soft hover:border-olive/50"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                required
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span>{opt.label}</span>
              {opt.hint && (
                <span className="mt-0.5 text-xs font-normal text-ink-soft">{opt.hint}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function InquiryForm({
  initialExperience,
  minDate,
  source,
}: {
  /** Preselects a cart when the visitor arrived via ?experience=. */
  initialExperience?: string;
  /** Earliest selectable date (YYYY-MM-DD). */
  minDate: string;
  /** Which page the form is on, for the inbox. */
  source: "book" | "contact";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCode, setShowCode] = useState(false);

  const [v, setV] = useState<Values>(() => ({
    experience: EXPERIENCE_OPTIONS.some((o) => o.value === initialExperience)
      ? initialExperience!
      : "",
    date: "",
    dateNotSet: false,
    time: "",
    timeNotSet: false,
    guests: "",
    location: "",
    locationNotDecided: false,
    setting: "",
    eventType: "",
    allergies: "",
    message: "",
    name: "",
    email: "",
    phone: "",
    heardFrom: "",
    promoCode: "",
  }));

  const set = <K extends keyof Values>(key: K, value: Values[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const showAllergies = needsAllergies(v.experience);
  const isLast = step === STEPS.length - 1;

  function goNext() {
    if (!formRef.current?.reportValidity()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLast) {
      goNext();
      return;
    }
    if (!event.currentTarget.reportValidity()) return;

    const experienceLabel =
      EXPERIENCE_OPTIONS.find((o) => o.value === v.experience)?.label ?? v.experience;

    const data = new FormData();
    data.append("_subject", `Date check: ${experienceLabel}, ${v.dateNotSet ? "date not set" : v.date} — ${site.name}`);
    data.append("_replyto", v.email);
    data.append("Experience", experienceLabel);
    data.append("Date", v.dateNotSet ? "Not set yet" : v.date);
    data.append("Start time", v.timeNotSet ? "Not set yet" : v.time);
    data.append("Guests", v.guests);
    data.append("Location", v.locationNotDecided ? "Not decided yet" : v.location);
    data.append("Setting", v.setting);
    data.append("Event type", v.eventType);
    if (showAllergies) data.append("Food allergies or dietary needs", v.allergies);
    data.append("Anything else", v.message || "—");
    data.append("Name", v.name);
    data.append("email", v.email);
    data.append("Phone or WhatsApp", v.phone);
    data.append("How did you hear about us", v.heardFrom || "—");
    data.append("Promo code", v.promoCode.trim().toUpperCase() || "—");
    data.append("Form", source === "book" ? "/book" : "/contact");
    const honeypot = event.currentTarget.elements.namedItem("_gotcha") as HTMLInputElement | null;
    data.append("_gotcha", honeypot?.value ?? "");

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "date_check_submitted",
          experience_name: experienceLabel,
          guest_tier: v.guests,
          event_date: v.dateNotSet ? "not set" : v.date,
          form_location: source,
        });
        setStatus("success");
        return;
      }

      const payload = (await res.json().catch(() => null)) as {
        errors?: { message: string }[];
      } | null;
      setErrorMsg(
        payload?.errors?.map((e) => e.message).join(", ") ||
          "Something went wrong sending the form. Please try again.",
      );
      setStatus("error");
    } catch {
      setErrorMsg("We could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-olive-mist bg-white/70 p-10 text-center">
        <h2 className="font-display text-3xl text-olive-deep">
          Thank you! We&apos;ll check your date and send your proposal within one business day.
        </h2>
        <p className="mt-4 text-ink-soft">
          Questions in the meantime?{" "}
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-olive-deep underline underline-offset-2"
          >
            Message us on WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="scroll-mt-28 rounded-3xl border border-olive-mist bg-white/60 p-6 sm:p-8"
    >
      {/* Progress */}
      <ol className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-2">
            <span className={`h-1 rounded-full ${i <= step ? "bg-olive" : "bg-olive-mist"}`} />
            <span className={i === step ? "text-olive-deep" : "text-ink-soft/70"}>
              {i + 1}. {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-6">
          <Choice
            name="experience"
            legend="Experience *"
            options={EXPERIENCE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={v.experience}
            onChange={(val) => set("experience", val)}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="iq-date">Date *</label>
              <input
                id="iq-date"
                type="date"
                min={minDate}
                required={!v.dateNotSet}
                disabled={v.dateNotSet}
                value={v.dateNotSet ? "" : v.date}
                onChange={(e) => set("date", e.target.value)}
                className={inputCls}
              />
              <label className={tickCls}>
                <input
                  type="checkbox"
                  checked={v.dateNotSet}
                  onChange={(e) => set("dateNotSet", e.target.checked)}
                  className="h-4 w-4 accent-olive"
                />
                Not set yet
              </label>
            </div>
            <div>
              <label className={labelCls} htmlFor="iq-time">Start time *</label>
              <input
                id="iq-time"
                type="time"
                required={!v.timeNotSet}
                disabled={v.timeNotSet}
                value={v.timeNotSet ? "" : v.time}
                onChange={(e) => set("time", e.target.value)}
                className={inputCls}
              />
              <label className={tickCls}>
                <input
                  type="checkbox"
                  checked={v.timeNotSet}
                  onChange={(e) => set("timeNotSet", e.target.checked)}
                  className="h-4 w-4 accent-olive"
                />
                Not set yet
              </label>
            </div>
          </div>

          <Choice
            name="guests"
            legend="Guests *"
            options={GUEST_OPTIONS.map((g) => ({ value: g, label: g }))}
            value={v.guests}
            onChange={(val) => set("guests", val)}
            columns="grid-cols-3 sm:grid-cols-6"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="iq-location">Location *</label>
              <input
                id="iq-location"
                placeholder="Venue or city"
                required={!v.locationNotDecided}
                disabled={v.locationNotDecided}
                value={v.locationNotDecided ? "" : v.location}
                onChange={(e) => set("location", e.target.value)}
                className={inputCls}
              />
              <label className={tickCls}>
                <input
                  type="checkbox"
                  checked={v.locationNotDecided}
                  onChange={(e) => set("locationNotDecided", e.target.checked)}
                  className="h-4 w-4 accent-olive"
                />
                Not decided yet
              </label>
            </div>
            <Choice
              name="setting"
              legend="Setting *"
              options={SETTING_OPTIONS.map((s) => ({ value: s, label: s }))}
              value={v.setting}
              onChange={(val) => set("setting", val)}
              columns="grid-cols-3"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <Choice
            name="eventType"
            legend="Event type *"
            options={EVENT_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.value, hint: o.hint }))}
            value={v.eventType}
            onChange={(val) => set("eventType", val)}
            columns="grid-cols-2"
          />

          {showAllergies && (
            <div>
              <label className={labelCls} htmlFor="iq-allergies">
                Food allergies or dietary needs *
              </label>
              <input
                id="iq-allergies"
                required
                placeholder={"e.g. nut allergy, 3 vegetarians, or “None”"}
                value={v.allergies}
                onChange={(e) => set("allergies", e.target.value)}
                className={inputCls}
              />
            </div>
          )}

          <div>
            <label className={labelCls} htmlFor="iq-message">Anything else?</label>
            <textarea
              id="iq-message"
              rows={4}
              placeholder="Theme, colors, add-ons you’d like"
              value={v.message}
              onChange={(e) => set("message", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="iq-name">Name *</label>
              <input
                id="iq-name"
                required
                autoComplete="name"
                value={v.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="iq-email">Email *</label>
              <input
                id="iq-email"
                type="email"
                required
                autoComplete="email"
                value={v.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="iq-phone">Phone or WhatsApp *</label>
              <input
                id="iq-phone"
                type="tel"
                required
                autoComplete="tel"
                value={v.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="iq-heard">How did you hear about us?</label>
              <select
                id="iq-heard"
                value={v.heardFrom}
                onChange={(e) => set("heardFrom", e.target.value)}
                className={inputCls}
              >
                <option value="">Choose one (optional)</option>
                {HEARD_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {showCode ? (
            <div className="max-w-xs">
              <label className={labelCls} htmlFor="iq-code">Promo code</label>
              <input
                id="iq-code"
                autoComplete="off"
                value={v.promoCode}
                onChange={(e) => set("promoCode", e.target.value)}
                className={`${inputCls} uppercase`}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCode(true)}
              className="text-sm font-medium text-olive-deep underline underline-offset-2"
            >
              Have a code?
            </button>
          )}
        </div>
      )}

      {/* Spam honeypot — real visitors never see it. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="rounded-full border border-rose/40 px-7 py-3.5 text-sm font-semibold text-olive-deep transition-colors hover:border-rose hover:bg-blush-soft/60"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-rose px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-berry transition-colors hover:bg-blush disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          <span>{isLast ? (submitting ? "Sending…" : "Send") : "Next"}</span>
          {!submitting && (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </button>
      </div>

      {status === "error" && (
        // Fallback so a lead is never lost if Formspree is down or over its limit.
        <div role="alert" className="mt-3 text-sm font-medium text-berry">
          <p>{errorMsg}</p>
          <p className="mt-1 font-normal text-ink-soft">
            You can also{" "}
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-olive-deep underline underline-offset-2"
            >
              message us on WhatsApp
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-olive-deep underline underline-offset-2"
            >
              {site.email}
            </a>
            .
          </p>
        </div>
      )}

      {isLast && (
        <p className="mt-4 text-xs text-ink-soft">
          By sending this form you agree to our{" "}
          <Link href="/terms-and-conditions" className="underline underline-offset-2">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline underline-offset-2">Privacy Policy</Link>.
        </p>
      )}
    </form>
  );
}
