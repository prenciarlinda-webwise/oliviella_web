import "server-only";

// The website no longer takes card deposits (see src/app/api/checkout). This
// module only remains so the Stripe webhook can describe card holds created
// before that change.

const depositCents = (() => {
  const n = Number.parseInt(process.env.BOOKING_DEPOSIT_CENTS ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 30_000;
})();
const currency = (process.env.BOOKING_CURRENCY ?? "usd").toLowerCase();

/** The legacy flat deposit, e.g. "$300". */
export function formatDeposit(): string {
  const amount = depositCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
