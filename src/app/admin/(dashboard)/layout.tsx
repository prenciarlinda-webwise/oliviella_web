import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Authoritative check — proxy.ts's cookie check is optimistic-only.
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream-deep/30">
      <AdminNav email={admin.email} role={admin.role} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
