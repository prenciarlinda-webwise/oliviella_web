import { type NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PaymentIntent ids are always "pi_..." — reject anything else before it
// reaches Stripe.
const PI_ID_RE = /^pi_[A-Za-z0-9]+$/;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // proxy.ts's matcher excludes /api/*, so this is the only auth check on
  // this route — see require-admin.ts.
  const auth = await requireAdminApi(req);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!PI_ID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid booking id." }, { status: 400 });
  }

  try {
    await getStripe().paymentIntents.capture(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/capture] Failed to capture", id, err);
    return NextResponse.json(
      { error: "Failed to capture the deposit." },
      { status: 502 },
    );
  }
}
