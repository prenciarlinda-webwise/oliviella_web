"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminRole } from "@/lib/auth/admins-store";

type Row = { id: string; email: string; role: AdminRole; createdAt: string };

export default function TeamTable({
  admins,
  currentAdminId,
}: {
  admins: Row[];
  currentAdminId: string;
}) {
  return (
    <div className="space-y-3">
      {admins.map((admin) => (
        <TeamRow key={admin.id} admin={admin} isSelf={admin.id === currentAdminId} />
      ))}
    </div>
  );
}

function TeamRow({ admin, isSelf }: { admin: Row; isSelf: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function changeRole(role: AdminRole) {
    if (role === admin.role) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Failed to update role.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Remove ${admin.email}? They will be signed out immediately.`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Failed to remove.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-olive-mist bg-white/70 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-olive-deep">
            {admin.email} {isSelf && <span className="text-sm font-normal text-ink-soft">(you)</span>}
          </p>
          <p className="text-sm text-ink-soft">
            Created {new Date(admin.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={admin.role}
            disabled={busy || isSelf}
            onChange={(e) => changeRole(e.target.value as AdminRole)}
            className="rounded-full border border-olive-mist bg-white px-4 py-2 text-sm text-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="system">system</option>
            <option value="shop">shop</option>
          </select>
          <button
            type="button"
            disabled={busy || isSelf}
            onClick={remove}
            className="rounded-full border border-rose/40 px-4 py-2 text-sm font-medium text-rose transition hover:border-rose hover:bg-rose/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Remove
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-rose">{error}</p>}
      {isSelf && (
        <p className="mt-2 text-xs text-ink-soft">
          You can&apos;t change your own role or remove yourself.
        </p>
      )}
    </div>
  );
}
