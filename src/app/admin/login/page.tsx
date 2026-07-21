import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/require-admin";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Only allow redirecting back into /admin — never an external URL. */
function safeNext(raw: string | undefined): string {
  if (raw && raw.startsWith("/admin") && !raw.startsWith("//")) return raw;
  return "/admin";
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const target = safeNext(next);

  const admin = await getCurrentAdmin();
  if (admin) redirect(target);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-deep/50 px-6 py-16">
      <LoginForm next={target} />
    </div>
  );
}
