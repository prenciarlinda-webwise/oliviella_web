// Pure, dependency-free validation for the booking checkout payload. No secrets
// here, so it can be reused anywhere. The server treats this as authoritative:
// it parses untrusted JSON into a known shape, trims and length-caps every
// string, and rejects anything malformed before money logic runs.

export type BookingInput = {
  experienceSlug: string;
  tierIndex: number;
  date: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export type ParseResult =
  | { ok: true; value: BookingInput }
  | { ok: false; errors: Record<string, string> };

// Length caps guard against abuse and oversized Stripe metadata (Stripe limits
// metadata values to 500 chars).
const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  notes: 1000,
  date: 10,
  slug: 80,
} as const;

// Pragmatic email shape check. Real deliverability is confirmed by Stripe's
// receipt and our follow-up, so we only reject obviously invalid addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseBookingInput(raw: unknown): ParseResult {
  const errors: Record<string, string> = {};

  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: { _: "Malformed request body." } };
  }
  const body = raw as Record<string, unknown>;

  const experienceSlug = asString(body.experienceSlug);
  if (!experienceSlug || experienceSlug.length > LIMITS.slug) {
    errors.experienceSlug = "Please choose an experience.";
  }

  // tierIndex may arrive as a number or numeric string; normalize strictly.
  const tierRaw = body.tierIndex;
  const tierIndex =
    typeof tierRaw === "number"
      ? tierRaw
      : typeof tierRaw === "string" && /^\d+$/.test(tierRaw.trim())
        ? Number(tierRaw.trim())
        : NaN;
  if (!Number.isInteger(tierIndex) || tierIndex < 0 || tierIndex > 50) {
    errors.tierIndex = "Please choose a guest count.";
  }

  const date = asString(body.date);
  if (!date || date.length > LIMITS.date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = "Please choose a valid date.";
  }

  const name = asString(body.name);
  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is too long.";

  const email = asString(body.email);
  if (!email) errors.email = "Please enter your email.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";

  const phone = asString(body.phone);
  if (phone.length > LIMITS.phone) errors.phone = "That phone number is too long.";

  const notes = asString(body.notes).slice(0, LIMITS.notes);

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: { experienceSlug, tierIndex, date, name, email, phone, notes },
  };
}
