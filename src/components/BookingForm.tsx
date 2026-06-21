"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getBookableExperiences, isPayableTier } from "@/lib/products";
import { site } from "@/lib/site";
import { ArrowRight, LeafSmall } from "./icons";

// ─── Charcuterie builder data ────────────────────────────────────────────────

const CHARC_STEPS = [
  {
    id: "cheeses",
    num: 1,
    title: "Select Up To 3 Cheeses",
    desc: "Choose from our collection of artisan and imported cheeses.",
    max: 3,
    options: [
      "Brie", "Camembert", "Manchego", "Aged Gouda",
      "Gruyère", "Goat Cheese", "Parmigiano Reggiano", "Fresh Mozzarella",
    ],
  },
  {
    id: "meats",
    num: 2,
    title: "Select Up To 2 Artisan Meats",
    desc: "Hand-selected premium charcuterie sourced for exceptional flavor and quality.",
    max: 2,
    options: [
      "Prosciutto di Parma", "Soppressata", "Milano Salami",
      "Genoa Salami", "Capocollo", "Chorizo",
    ],
  },
  {
    id: "fruits",
    num: 3,
    title: "Select Up To 2 Seasonal Fruits",
    desc: "Fresh seasonal fruits selected to complement your grazing experience.",
    max: 2,
    options: [
      "Strawberries", "Green Grapes", "Red Grapes", "Blueberries",
      "Blackberries", "Kiwi", "Pineapple", "Mango",
    ],
  },
  {
    id: "savory",
    num: 4,
    title: "Select Up To 2 Savory Pairings",
    desc: "Mediterranean-inspired accompaniments that add balance and depth.",
    max: 2,
    options: [
      "Castelvetrano Olives", "Kalamata Olives", "Marinated Artichokes", "Cornichons",
      "Roasted Red Peppers", "Sun-Dried Tomatoes", "Stuffed Cherry Peppers", "Pickled Vegetables",
    ],
  },
  {
    id: "nuts",
    num: 5,
    title: "Select Up To 2 Premium Nuts",
    desc: "A selection of premium nuts for the perfect finishing touch.",
    max: 2,
    options: [
      "Marcona Almonds", "Candied Pecans", "Pistachios",
      "Cashews", "Honey Roasted Almonds", "Mixed Nuts",
    ],
  },
  {
    id: "sweets",
    num: 6,
    title: "Select Up To 2 Sweet Pairings",
    desc: "Delicate sweet accents designed to complement every board.",
    max: 2,
    options: [
      "Honeycomb", "Local Honey", "Fig Jam",
      "Apricot Preserves", "Orange Marmalade", "Hot Honey",
    ],
  },
  {
    id: "breads",
    num: 7,
    title: "Select Up To 2 Artisan Breads & Crackers",
    desc: "Freshly baked and carefully selected for pairing.",
    max: 2,
    options: [
      "Artisan Baguette", "Rustic Sourdough", "Rosemary Focaccia",
      "Sea Salt Crackers", "Multigrain Crackers", "Crostini",
    ],
  },
] as const;

const CHARC_INCLUDED = [
  "Elegant Grazing Presentation",
  "Fresh Seasonal Garnishes",
  "Fresh Herbs & Greenery",
  "Signature Olivella Styling",
  "Premium Serving Utensils",
  "Setup & Styling Service",
];

const CHARC_ADDONS = [
  "Burrata",
  "Premium Imported Cheeses",
  "Extra Charcuterie Selection",
  "Honeycomb Display",
  "Personalized Menu Cards",
  "Custom Event Branding",
  "Fresh Floral Styling",
  "Signature Olivella Flower Bar",
];

// ─── Flower cart builder data ─────────────────────────────────────────────────

const EVENT_TYPES = [
  "Wedding", "Bridal Shower", "Baby Shower", "Birthday Celebration",
  "Corporate Event", "Brand Activation", "Engagement Party", "Grand Opening",
  "Holiday Event", "Private Gathering", "Other",
];

const PALETTES = [
  { id: "mediterranean-ivory", label: "Mediterranean Ivory", desc: "Elegant ivory, cream, champagne, and soft green foliage." },
  { id: "blush-romance", label: "Blush Romance", desc: "Soft blush pink, dusty rose, ivory, and neutral tones." },
  { id: "coastal-breeze", label: "Coastal Breeze", desc: "White, powder blue, soft blue, and fresh greenery." },
  { id: "sunset-bloom", label: "Sunset Bloom", desc: "Peach, apricot, coral, soft orange, and cream." },
  { id: "lavender-garden", label: "Lavender Garden", desc: "Lavender, lilac, soft purple, ivory, and greenery." },
  { id: "golden-hour", label: "Golden Hour", desc: "Butter yellow, ivory, cream, and natural greens." },
  { id: "olive-sage", label: "Olive & Sage", desc: "Dusty green, sage, eucalyptus, ivory, and neutral florals." },
  { id: "bright-joyful", label: "Bright & Joyful", desc: "Vibrant pinks, oranges, yellows, and seasonal blooms." },
  { id: "custom", label: "Custom Color Palette", desc: "Designed specifically around your event inspiration." },
] as const;

const FLORAL_STYLES = [
  "Classic & Elegant", "Mediterranean Garden", "Romantic & Soft",
  "Modern Minimalist", "Coastal Chic", "European Market Style",
  "Organic & Natural", "Luxury Statement Blooms", "Fully Custom Design",
];

const FLOWER_ENHANCEMENTS = [
  "Additional Service Time", "Custom Branded Cart", "Personalized Bouquet Stickers",
  "Corporate Branding", "Premium Floral Upgrades", "Custom Signage",
  "Specialty Event Styling", "Team & Sports-Themed Experiences",
  "Luxury Floral Installations", "Fully Customized Activations",
];

// ─── Step sequences ───────────────────────────────────────────────────────────

function getStepIds(slug: string): string[] {
  if (slug === "food-cart-miami") {
    return ["experience", ...CHARC_STEPS.map((_, i) => `charc-${i}`), "tier", "details"];
  }
  if (slug === "flower-cart-miami") {
    return ["experience", "flower-customize", "tier", "flower-details"];
  }
  return ["experience", "tier", "details"];
}

// ─── Shared classes ───────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-2xl border border-olive-mist bg-white/70 px-4 py-3 text-ink placeholder:text-ink-soft/50 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20";
const labelCls = "mb-1.5 block text-sm font-semibold text-olive-deep";
const backBtnCls =
  "rounded-full border border-olive/30 px-7 py-3.5 text-sm font-semibold text-olive-deep transition-all duration-300 hover:border-olive hover:bg-olive-mist/60";
const nextBtnCls =
  "inline-flex items-center justify-center gap-2 rounded-full bg-olive px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-olive-deep";

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  minDate: string;
  maxDate: string;
  initialSlug?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingForm({ minDate, maxDate, initialSlug }: Props) {
  const allExperiences = getBookableExperiences();

  const defaultSlug =
    initialSlug && allExperiences.some((e) => e.slug === initialSlug)
      ? initialSlug
      : (allExperiences[0]?.slug ?? "");

  // Navigation
  const [slug, setSlug] = useState(defaultSlug);
  const [stepIdx, setStepIdx] = useState(0);

  // Charcuterie customization
  const [charcSelections, setCharcSelections] = useState<Record<string, string[]>>({});

  // Flower cart customization
  const [eventType, setEventType] = useState("");
  const [palette, setPalette] = useState("");
  const [floralStyle, setFloralStyle] = useState("");
  const [flowerEnhancements, setFlowerEnhancements] = useState<string[]>([]);
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [indoorOutdoor, setIndoorOutdoor] = useState("");
  const [setupTime, setSetupTime] = useState("");
  const [inspirationLink, setInspirationLink] = useState("");

  // Common booking fields
  const [tierIndex, setTierIndex] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const stepIds = getStepIds(slug);
  const currentStep = stepIds[stepIdx] ?? "details";
  const selected = allExperiences.find((e) => e.slug === slug);
  const tiers = selected?.pricing.tiers ?? [];
  const isFlower = slug === "flower-cart-miami";
  const isCharc = slug === "food-cart-miami";

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function selectExperience(nextSlug: string) {
    setSlug(nextSlug);
    setStepIdx(0);
    setTierIndex(null);
    setCharcSelections({});
    setEventType(""); setPalette(""); setFloralStyle(""); setFlowerEnhancements([]);
    setVenueName(""); setVenueAddress(""); setIndoorOutdoor(""); setSetupTime(""); setInspirationLink("");
    setDate(""); setCustomerName(""); setEmail(""); setPhone(""); setNotes("");
    setError(null); setFieldErrors({});
  }

  function goNext() {
    setError(null);
    setFieldErrors({});
    setStepIdx((i) => Math.min(i + 1, stepIds.length - 1));
  }

  function goBack() {
    setError(null);
    setFieldErrors({});
    setStepIdx((i) => Math.max(i - 1, 0));
  }

  function advanceTier() {
    if (tierIndex === null) {
      setFieldErrors({ tierIndex: "Please choose an option to continue." });
      return;
    }
    goNext();
  }

  function toggleCharcOption(stepId: string, option: string, max: number) {
    setCharcSelections((prev) => {
      const cur = prev[stepId] ?? [];
      if (cur.includes(option)) return { ...prev, [stepId]: cur.filter((o) => o !== option) };
      if (cur.length >= max) return prev;
      return { ...prev, [stepId]: [...cur, option] };
    });
  }

  function toggleEnhancement(item: string) {
    setFlowerEnhancements((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item],
    );
  }

  function buildNotes(): string {
    const parts: string[] = [];
    if (isCharc) {
      CHARC_STEPS.forEach((s) => {
        const items = charcSelections[s.id] ?? [];
        if (items.length) parts.push(`${s.id.charAt(0).toUpperCase() + s.id.slice(1)}: ${items.join(", ")}`);
      });
    }
    if (isFlower) {
      if (eventType) parts.push(`Event: ${eventType}`);
      const palLabel = PALETTES.find((p) => p.id === palette)?.label;
      if (palLabel) parts.push(`Palette: ${palLabel}`);
      if (floralStyle) parts.push(`Style: ${floralStyle}`);
      if (flowerEnhancements.length) parts.push(`Enhancements: ${flowerEnhancements.join(", ")}`);
      if (venueName) parts.push(`Venue: ${venueName}`);
      if (venueAddress) parts.push(`Address: ${venueAddress}`);
      if (indoorOutdoor) parts.push(`Setting: ${indoorOutdoor}`);
      if (setupTime) parts.push(`Setup: ${setupTime}`);
      if (inspirationLink) parts.push(`Inspiration: ${inspirationLink}`);
    }
    const extra = notes.trim();
    const sel = parts.join("\n");
    return (extra ? (sel ? `${sel}\n\n${extra}` : extra) : sel).slice(0, 490);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const errs: Record<string, string> = {};
    if (tierIndex === null) errs.tierIndex = "Please choose a guest count.";
    if (!customerName.trim()) errs.name = "Please enter your name.";
    if (!email.trim()) errs.email = "Please enter your email.";
    if (!date) errs.date = "Please choose an event date.";
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }

    const experienceName = selected?.name ?? slug;
    const tierLabel = tierIndex !== null ? (tiers[tierIndex]?.label ?? "") : "";
    const customizations = buildNotes();

    setSubmitting(true);
    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Booking Request — ${experienceName} · ${date}`,
          _replyto: email,
          name: customerName,
          email,
          phone: phone || "Not provided",
          experience: experienceName,
          guest_count: tierLabel,
          event_date: date,
          customizations: customizations || "No customizations selected",
        }),
      });
      if (!res.ok) {
        setError("Something went wrong. Please try again or email us directly.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  // ─── No experiences guard ─────────────────────────────────────────────────

  if (allExperiences.length === 0) {
    return (
      <p className="text-ink-soft">
        Online booking is not available right now. Please{" "}
        <Link className="font-semibold text-olive underline" href="/contact">
          contact us
        </Link>
        .
      </p>
    );
  }

  // ─── Success screen ───────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="rounded-3xl border border-olive-mist bg-white/60 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive-mist">
          <LeafSmall className="h-8 w-8 text-olive" />
        </div>
        <h2 className="mt-6 font-display text-3xl text-olive-deep">
          Request received!
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
          Thank you, <span className="font-semibold text-olive-deep">{customerName}</span>. We have received your booking request and will send you a custom proposal within one business day.
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          A copy has been sent to <span className="font-medium text-ink">{email}</span>.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-olive px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-olive-deep"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const progressPct = stepIds.length > 1 ? (stepIdx / (stepIds.length - 1)) * 100 : 0;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="rounded-3xl border border-olive-mist bg-white/60 p-6 sm:p-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-ink-soft">
          <span className="font-medium text-olive-deep">{selected?.name ?? "Your Experience"}</span>
          <span>Step {stepIdx + 1} of {stepIds.length}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-olive-mist/50">
          <div
            className="h-full rounded-full bg-olive transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ── Step: choose experience ── */}
        {currentStep === "experience" && (
          <fieldset>
            <legend className="mb-5 block text-xl font-semibold text-olive-deep">
              Choose Your Experience
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {allExperiences.map((exp) => {
                const active = exp.slug === slug;
                return (
                  <button
                    type="button"
                    key={exp.slug}
                    onClick={() => selectExperience(exp.slug)}
                    aria-pressed={active}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-olive bg-olive-mist/50 ring-2 ring-olive/20"
                        : "border-olive-mist bg-white/70 hover:border-olive"
                    }`}
                  >
                    <span className="block font-display text-lg text-olive-deep">{exp.name}</span>
                    <span className="mt-1 block text-xs text-ink-soft">{exp.subtitle}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button type="button" onClick={goNext} className={nextBtnCls}>
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </fieldset>
        )}

        {/* ── Steps: charcuterie builder (charc-0 … charc-6) ── */}
        {currentStep.startsWith("charc-") && (() => {
          const csIdx = Number(currentStep.split("-")[1]);
          const cs = CHARC_STEPS[csIdx];
          const sel = charcSelections[cs.id] ?? [];
          const atMax = sel.length >= cs.max;
          const isLast = csIdx === CHARC_STEPS.length - 1;

          return (
            <div>
              <div className="mb-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
                  Build Your Olivella Experience · Step {cs.num} of {CHARC_STEPS.length}
                </span>
              </div>
              <h2 className="mt-2 text-2xl text-olive-deep">{cs.title}</h2>
              <p className="mt-1.5 text-sm text-ink-soft">{cs.desc}</p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {cs.options.map((option) => {
                  const isSelected = sel.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleCharcOption(cs.id, option, cs.max)}
                      disabled={!isSelected && atMax}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-olive bg-olive text-cream shadow-sm"
                          : !isSelected && atMax
                          ? "cursor-not-allowed border-olive-mist/40 text-ink-soft/40"
                          : "border-olive-mist text-ink-soft hover:border-olive hover:bg-olive-mist/40"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {sel.length > 0 ? (
                <p className="mt-4 text-sm font-medium text-olive">
                  Selected: {sel.join(" · ")}
                </p>
              ) : (
                <p className="mt-4 text-xs italic text-ink-soft/60">
                  Select up to {cs.max}. You may continue without selecting.
                </p>
              )}

              {/* On the last charc step, show included + add-ons */}
              {isLast && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-olive-mist/30 p-5 ring-1 ring-olive-mist">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-olive-deep">
                      Included with every experience
                    </p>
                    <ul className="space-y-2">
                      {CHARC_INCLUDED.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-ink-soft">
                          <LeafSmall className="h-4 w-4 shrink-0 text-olive" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-blush-soft/30 p-5 ring-1 ring-blush/20">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-rose">
                      Add-on upgrades available
                    </p>
                    <ul className="space-y-2">
                      {CHARC_ADDONS.map((item) => (
                        <li key={item} className="text-sm text-ink-soft">
                          <span className="mr-1.5 text-rose">✧</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <button type="button" onClick={goBack} className={backBtnCls}>Back</button>
                <button type="button" onClick={goNext} className={nextBtnCls}>
                  {isLast ? "Choose Guest Count" : "Next"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })()}

        {/* ── Step: flower cart customization ── */}
        {currentStep === "flower-customize" && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
              Customize Your Riviera Bloom Cart
            </span>
            <h2 className="mt-2 text-2xl text-olive-deep">Tell us about your event</h2>

            {/* Event type */}
            <div className="mt-7">
              <p className={labelCls}>Event Type</p>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEventType(type)}
                    aria-pressed={eventType === type}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      eventType === type
                        ? "border-rose bg-rose/10 text-rose ring-1 ring-rose/30"
                        : "border-olive-mist text-ink-soft hover:border-olive"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Color palette */}
            <div className="mt-7">
              <p className={labelCls}>Floral Color Palette</p>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(p.id)}
                    aria-pressed={palette === p.id}
                    className={`rounded-2xl border p-3.5 text-left transition ${
                      palette === p.id
                        ? "border-rose bg-blush-soft/50 ring-2 ring-rose/20"
                        : "border-olive-mist bg-white/60 hover:border-olive"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-olive-deep">{p.label}</span>
                    <span className="mt-0.5 block text-xs text-ink-soft">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Floral style */}
            <div className="mt-7">
              <p className={labelCls}>Floral Style</p>
              <div className="flex flex-wrap gap-2">
                {FLORAL_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFloralStyle(style)}
                    aria-pressed={floralStyle === style}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      floralStyle === style
                        ? "border-rose bg-rose/10 text-rose ring-1 ring-rose/30"
                        : "border-olive-mist text-ink-soft hover:border-olive"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional enhancements */}
            <div className="mt-7">
              <p className={labelCls}>Optional Enhancements</p>
              <p className="mb-3 text-xs text-ink-soft">
                Select any that interest you — pricing will be included in your personalized proposal.
              </p>
              <div className="flex flex-wrap gap-2">
                {FLOWER_ENHANCEMENTS.map((item) => {
                  const active = flowerEnhancements.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleEnhancement(item)}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        active
                          ? "border-rose bg-rose/10 text-rose ring-1 ring-rose/30"
                          : "border-olive-mist text-ink-soft hover:border-olive"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={goBack} className={backBtnCls}>Back</button>
              <button type="button" onClick={goNext} className={nextBtnCls}>
                Choose Guest Count <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step: tier / guest count / board count ── */}
        {currentStep === "tier" && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              Almost there
            </span>
            <h2 className="mt-2 text-2xl text-olive-deep">
              How many guests?
            </h2>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {tiers.map((tier, i) => {
                const payable = isPayableTier(tier);
                const active = i === tierIndex;

                if (!payable) {
                  return (
                    <Link
                      key={tier.label}
                      href={`/contact?experience=${slug}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-olive-mist bg-white/40 px-4 py-3 transition hover:border-olive"
                    >
                      <span className="text-ink-soft">{tier.label}</span>
                      <span className="text-sm font-semibold text-olive">Request a quote →</span>
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    key={tier.label}
                    onClick={() => {
                      setTierIndex(i);
                      setFieldErrors((p) => ({ ...p, tierIndex: "" }));
                    }}
                    aria-pressed={active}
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-olive bg-olive-mist/50 ring-2 ring-olive/20"
                        : "border-olive-mist bg-white/70 hover:border-olive"
                    }`}
                  >
                    <span className="text-ink-soft">{tier.label}</span>
                    <span className="text-sm text-olive-soft">{tier.price}</span>
                  </button>
                );
              })}
            </div>

            {fieldErrors.tierIndex && (
              <p className="mt-2 text-sm text-rose">{fieldErrors.tierIndex}</p>
            )}

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={goBack} className={backBtnCls}>Back</button>
              <button type="button" onClick={advanceTier} className={nextBtnCls}>
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step: standard details (charcuterie + boards) ── */}
        {currentStep === "details" && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">
              Final step
            </span>
            <h2 className="mt-2 text-2xl text-olive-deep">Your event details</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="date">Event date</label>
                <input
                  id="date" type="date" required
                  min={minDate} max={maxDate}
                  value={date} onChange={(e) => setDate(e.target.value)}
                  className={inputCls}
                />
                {fieldErrors.date && <p className="mt-1 text-sm text-rose">{fieldErrors.date}</p>}
              </div>
              <div>
                <label className={labelCls} htmlFor="name">Your name</label>
                <input
                  id="name" required
                  value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  className={inputCls}
                />
                {fieldErrors.name && <p className="mt-1 text-sm text-rose">{fieldErrors.name}</p>}
              </div>
              <div>
                <label className={labelCls} htmlFor="email">Email</label>
                <input
                  id="email" type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                />
                {fieldErrors.email && <p className="mt-1 text-sm text-rose">{fieldErrors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="phone">Phone (optional)</label>
                <input
                  id="phone"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="notes">Anything we should know? (optional)</label>
                <textarea
                  id="notes" rows={3}
                  placeholder="Colors, venue, the occasion…"
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <SubmitArea
              error={error}
              submitting={submitting}
              onBack={goBack}
            />
          </div>
        )}

        {/* ── Step: flower cart extended details ── */}
        {currentStep === "flower-details" && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose">
              Final step
            </span>
            <h2 className="mt-2 text-2xl text-olive-deep">Event details</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="f-date">Event date</label>
                <input
                  id="f-date" type="date" required
                  min={minDate} max={maxDate}
                  value={date} onChange={(e) => setDate(e.target.value)}
                  className={inputCls}
                />
                {fieldErrors.date && <p className="mt-1 text-sm text-rose">{fieldErrors.date}</p>}
              </div>
              <div>
                <label className={labelCls} htmlFor="venueName">Venue name</label>
                <input
                  id="venueName"
                  value={venueName} onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. The Biltmore Hotel"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="venueAddress">Venue address</label>
                <input
                  id="venueAddress"
                  value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="City, State"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="indoorOutdoor">Indoor or outdoor</label>
                <select
                  id="indoorOutdoor"
                  value={indoorOutdoor} onChange={(e) => setIndoorOutdoor(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select…</option>
                  <option>Indoor</option>
                  <option>Outdoor</option>
                  <option>Both</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="setupTime">Preferred setup time</label>
                <input
                  id="setupTime"
                  value={setupTime} onChange={(e) => setSetupTime(e.target.value)}
                  placeholder="e.g. 2:00 PM"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="f-name">Contact name</label>
                <input
                  id="f-name" required
                  value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  className={inputCls}
                />
                {fieldErrors.name && <p className="mt-1 text-sm text-rose">{fieldErrors.name}</p>}
              </div>
              <div>
                <label className={labelCls} htmlFor="f-email">Email</label>
                <input
                  id="f-email" type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                />
                {fieldErrors.email && <p className="mt-1 text-sm text-rose">{fieldErrors.email}</p>}
              </div>
              <div>
                <label className={labelCls} htmlFor="f-phone">Phone (optional)</label>
                <input
                  id="f-phone"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="inspirationLink">
                  Inspiration board link (optional)
                </label>
                <input
                  id="inspirationLink"
                  value={inspirationLink} onChange={(e) => setInspirationLink(e.target.value)}
                  placeholder="Pinterest, Instagram, etc."
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="f-notes">Additional notes (optional)</label>
                <textarea
                  id="f-notes" rows={3}
                  placeholder="Any other details about your event…"
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <SubmitArea
              error={error}
              submitting={submitting}
              onBack={goBack}
            />
          </div>
        )}

      </form>
    </div>
  );
}

// ─── Submit area sub-component ────────────────────────────────────────────────

function SubmitArea({
  error,
  submitting,
  onBack,
}: {
  error: string | null;
  submitting: boolean;
  onBack: () => void;
}) {
  return (
    <>
      <div className="mt-7 rounded-2xl bg-olive-mist/40 p-5 text-sm text-ink-soft">
        We will review your request and send a custom proposal within one business day. No payment is required at this step.
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onBack} className={backBtnCls}>
          Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-olive px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-olive-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending request…" : "Send booking request"}
          {!submitting && (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </button>
      </div>
    </>
  );
}
