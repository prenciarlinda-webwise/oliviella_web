import type { ReactNode } from "react";
import { formatTierPrice, type Experience } from "@/lib/products";

const accentText = {
  olive: "text-olive",
  rose: "text-berry",
} as const;

/** Starting-price table for one experience, with the "included" line(s) underneath. */
export default function PriceTable({
  experience,
  children,
}: {
  experience: Experience;
  /** Lines shown under the table (included / savings / tax). */
  children?: ReactNode;
}) {
  return (
    <div className="mt-7 rounded-2xl bg-white/70 p-6 ring-1 ring-olive-mist">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.12em] ${accentText[experience.accent]}`}
      >
        Starting prices
      </p>
      <dl className="mt-4 divide-y divide-olive-mist/70">
        {experience.pricing.tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex items-baseline justify-between gap-4 py-2.5"
          >
            <dt className="text-ink-soft">{tier.label}</dt>
            <dd className="text-right font-display text-xl text-olive-deep">
              {formatTierPrice(tier)}
            </dd>
          </div>
        ))}
      </dl>
      {children && (
        <div className="mt-4 space-y-2 text-sm leading-relaxed text-ink-soft">
          {children}
        </div>
      )}
    </div>
  );
}
