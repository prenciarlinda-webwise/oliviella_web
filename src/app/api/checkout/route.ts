import { NextResponse } from "next/server";

// Online card deposits were retired in November 2026: booking is now a free
// date check (see src/components/InquiryForm.tsx), and the 30% retainer is
// billed after the client signs the proposal. This endpoint stays as an
// explicit 410 so nothing can create a card hold through the website.
export const dynamic = "force-dynamic";

export function POST() {
  return NextResponse.json(
    { error: "Online payment is not available. Please check your date at /book." },
    { status: 410 },
  );
}
