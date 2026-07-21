import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { readAdmins } from "@/lib/auth/admins-store";
import TeamTable from "@/components/admin/TeamTable";

export const metadata: Metadata = {
  title: "Team",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const me = await requireAdmin({ role: "system" });
  const admins = await readAdmins();

  const rows = admins
    .map((a) => ({ id: a.id, email: a.email, role: a.role, createdAt: a.createdAt }))
    .sort((a, b) => a.email.localeCompare(b.email));

  return (
    <div>
      <h1 className="font-display text-3xl text-olive-deep">Team</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Only <code className="rounded bg-olive-mist/40 px-1.5 py-0.5">system</code> admins
        can see this page. New accounts and password resets are created via
        the <code className="rounded bg-olive-mist/40 px-1.5 py-0.5">create-admin</code>{" "}
        script, run over SSH on the server — not from this page, so a
        password is never sent through a web form.
      </p>

      <div className="mt-8">
        <TeamTable admins={rows} currentAdminId={me.id} />
      </div>
    </div>
  );
}
