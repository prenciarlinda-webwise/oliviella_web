import "server-only";

import Stripe from "stripe";

// Lazily-created Stripe singleton. The secret key is read from the environment
// and only ever lives on the server. We construct on first use (not at module
// load) so that builds and unrelated routes don't crash when keys are absent in
// a given environment.

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your environment to enable checkout.",
    );
  }

  client = new Stripe(secretKey, {
    appInfo: { name: "Olivella Booking" },
    typescript: true,
  });
  return client;
}

/** Whether checkout is configured in this environment. */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
