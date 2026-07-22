"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const inputCls =
  "w-full rounded-2xl border border-olive-mist bg-white/70 px-4 py-3 text-ink placeholder:text-ink-soft/50 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20";
const labelCls = "mb-1.5 block text-sm font-semibold text-olive-deep";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.replace(next);
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-3xl border border-olive-mist bg-white/70 p-8"
    >
      <h1 className="font-display text-3xl text-olive-deep">Admin sign in</h1>

      <div className="mt-6">
        <label className={labelCls} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="mt-4">
        <label className={labelCls} htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-full bg-rose px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-berry transition-all duration-300 hover:bg-blush disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
