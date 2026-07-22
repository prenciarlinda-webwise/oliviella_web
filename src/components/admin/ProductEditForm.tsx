"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Experience, PriceTier } from "@/lib/products";

const inputCls =
  "w-full rounded-2xl border border-olive-mist bg-white/70 px-4 py-3 text-ink placeholder:text-ink-soft/50 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20";
const labelCls = "mb-1.5 block text-sm font-semibold text-olive-deep";

function newTierId(slug: string, tiers: PriceTier[]): string {
  let n = tiers.length;
  let id = `${slug}-tier-${n}`;
  const existing = new Set(tiers.map((t) => t.id));
  while (existing.has(id)) {
    n += 1;
    id = `${slug}-tier-${n}`;
  }
  return id;
}

export default function ProductEditForm({ experience }: { experience: Experience }) {
  const router = useRouter();

  const [name, setName] = useState(experience.name);
  const [subtitle, setSubtitle] = useState(experience.subtitle);
  const [description, setDescription] = useState(experience.description);
  const [includesText, setIncludesText] = useState(experience.includes.join("\n"));
  const [tiers, setTiers] = useState<PriceTier[]>(experience.pricing.tiers);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState(experience.image);

  function updateTier(id: string, patch: Partial<PriceTier>) {
    setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function removeTier(id: string) {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  }

  function addTier() {
    setTiers((prev) => [
      ...prev,
      { id: newTierId(experience.slug, prev), label: "", priceCents: 0 },
    ]);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    const includes = includesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/admin/products/${experience.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          subtitle,
          description,
          includes,
          tiers: tiers.map((t) => ({
            id: t.id,
            label: t.label,
            priceCents: t.priceCents,
          })),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setSaveError(data?.error ?? "Failed to save.");
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
      router.refresh();
    } catch {
      setSaveError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function handleImageUpload() {
    if (!imageFile) return;
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch(`/api/admin/products/${experience.slug}/image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setUploadError(data?.error ?? "Failed to upload image.");
        setUploading(false);
        return;
      }
      setImagePreview(data.image);
      setImageFile(null);
      setUploading(false);
      router.refresh();
    } catch {
      setUploadError("Network error. Please try again.");
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Image */}
      <section className="rounded-2xl border border-olive-mist bg-white/70 p-6">
        <h2 className="text-lg font-semibold text-olive-deep">Image</h2>
        <div className="relative mt-4 aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl">
          <Image src={imagePreview} alt={experience.alt} fill sizes="400px" className="object-cover" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-sm text-ink-soft"
          />
          <button
            type="button"
            disabled={!imageFile || uploading}
            onClick={handleImageUpload}
            className="rounded-full bg-rose px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-berry transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload new image"}
          </button>
        </div>
        {uploadError && <p className="mt-2 text-sm text-rose">{uploadError}</p>}
      </section>

      {/* Text fields */}
      <section className="rounded-2xl border border-olive-mist bg-white/70 p-6">
        <h2 className="text-lg font-semibold text-olive-deep">Details</h2>

        <div className="mt-4">
          <label className={labelCls} htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </div>
        <div className="mt-4">
          <label className={labelCls} htmlFor="subtitle">Subtitle</label>
          <input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputCls} />
        </div>
        <div className="mt-4">
          <label className={labelCls} htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="mt-4">
          <label className={labelCls} htmlFor="includes">Includes (one per line)</label>
          <textarea
            id="includes"
            rows={6}
            value={includesText}
            onChange={(e) => setIncludesText(e.target.value)}
            className={inputCls}
          />
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="rounded-2xl border border-olive-mist bg-white/70 p-6">
        <h2 className="text-lg font-semibold text-olive-deep">Pricing tiers</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Customers see this as &quot;Starting at $X&quot;, generated automatically from
          the number below. Leave it at $0 for a non-payable tier (e.g. &quot;Custom
          proposal&quot;) — it&apos;ll route customers to a quote request instead of checkout.
        </p>

        <div className="mt-4 space-y-4">
          {tiers.map((tier) => (
            <div key={tier.id} className="grid gap-3 rounded-xl bg-olive-mist/20 p-4 sm:grid-cols-[2fr_1fr_auto]">
              <div>
                <label className="mb-1 block text-xs font-semibold text-olive-deep">Label</label>
                <input
                  value={tier.label}
                  onChange={(e) => updateTier(tier.id, { label: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-olive-deep">Starting price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={(tier.priceCents ?? 0) / 100}
                  onChange={(e) =>
                    updateTier(tier.id, {
                      priceCents: Math.max(0, Math.round(Number(e.target.value) * 100)) || null,
                    })
                  }
                  className={inputCls}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeTier(tier.id)}
                  className="rounded-full border border-rose/40 px-4 py-3 text-sm font-medium text-rose transition hover:border-rose hover:bg-rose/10"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addTier}
          className="mt-4 rounded-full border border-olive-mist px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-olive-deep transition hover:border-olive"
        >
          Add tier
        </button>
      </section>

      {saveError && <p className="text-sm text-rose">{saveError}</p>}
      {saved && <p className="text-sm text-olive">Saved.</p>}

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="rounded-full bg-rose px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-berry transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
