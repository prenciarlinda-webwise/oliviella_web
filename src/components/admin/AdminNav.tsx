"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AdminRole } from "@/lib/auth/admins-store";

const links = [
  { href: "/admin", label: "Bookings" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/team", label: "Team", role: "system" as const },
];

export default function AdminNav({
  email,
  role,
}: {
  email: string;
  role: AdminRole;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-olive-mist bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <nav className="flex flex-wrap items-center gap-2">
          {links
            .filter((link) => !link.role || link.role === role)
            .map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-olive-mist/60 text-olive-deep"
                      : "text-ink-soft hover:bg-olive-mist/30"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-ink-soft">
            {email} <span className="text-ink-soft/60">({role})</span>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-olive-mist px-4 py-2 font-medium text-olive-deep transition hover:border-olive"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
