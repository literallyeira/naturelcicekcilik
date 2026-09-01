"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_CATALOG,
  type BouquetCatalog,
  type PriceOverrides,
} from "@/lib/bouquet";

type Group = "flowers" | "wraps" | "extras";

const SECTIONS: { key: Group; title: string; hint: string }[] = [
  {
    key: "flowers",
    title: "Çiçekler (dal fiyatı)",
    hint: "Müşteri her dal eklediğinde bu tutar toplama eklenir.",
  },
  {
    key: "wraps",
    title: "Ambalajlar",
    hint: "Buket başına bir kez eklenir.",
  },
  {
    key: "extras",
    title: "Ekstralar",
    hint: "Seçilirse buket fiyatına eklenir. 0 yazarsanız ücretsiz görünür.",
  },
];

type Draft = Record<Group, Record<string, string>>;

function toDraft(catalog: BouquetCatalog): Draft {
  return {
    flowers: Object.fromEntries(
      catalog.flowers.map((f) => [f.id, String(f.price)]),
    ),
    wraps: Object.fromEntries(catalog.wraps.map((w) => [w.id, String(w.price)])),
    extras: Object.fromEntries(
      catalog.extras.map((e) => [e.id, String(e.price)]),
    ),
  };
}

export function BouquetPriceForm({ catalog }: { catalog: BouquetCatalog }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(() => toDraft(catalog));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(
    () => ({
      flowers: catalog.flowers.map((f) => ({ id: f.id, name: f.name })),
      wraps: catalog.wraps.map((w) => ({ id: w.id, name: w.name })),
      extras: catalog.extras.map((e) => ({ id: e.id, name: e.name })),
    }),
    [catalog],
  );

  function update(group: Group, id: string, value: string) {
    setDraft((prev) => ({
      ...prev,
      [group]: { ...prev[group], [id]: value },
    }));
    setSaved(false);
  }

  function multiplyAll(factor: number) {
    setDraft((prev) => {
      const next = { ...prev };
      for (const group of ["flowers", "wraps", "extras"] as Group[]) {
        next[group] = Object.fromEntries(
          Object.entries(prev[group]).map(([id, value]) => {
            const n = Number(value);
            if (!Number.isFinite(n)) return [id, value];
            return [id, String(Math.round((n * factor) / 5) * 5)];
          }),
        );
      }
      return next;
    });
    setSaved(false);
  }

  function resetToDefaults() {
    setDraft(toDraft(DEFAULT_CATALOG));
    setSaved(false);
  }

  async function save() {
    const overrides: PriceOverrides = {};
    for (const group of ["flowers", "wraps", "extras"] as Group[]) {
      const clean: Record<string, number> = {};
      for (const [id, value] of Object.entries(draft[group])) {
        const n = Number(value);
        if (!Number.isFinite(n) || n < 0) {
          setError(`Geçersiz fiyat: ${id} → "${value}"`);
          return;
        }
        clean[id] = n;
      }
      overrides[group] = clean;
    }

    setError(null);
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bouquet_prices: JSON.stringify(overrides) }),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Kaydedilemedi. Tekrar deneyin.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-ink-100 rounded-xl p-5 flex flex-wrap items-center gap-3">
        <span className="text-sm text-ink-700 font-medium">Toplu işlem:</span>
        <button
          onClick={() => multiplyAll(1.1)}
          className="h-9 px-4 rounded-full border border-ink-200 text-sm hover:border-brand-400 hover:text-brand-700 transition-colors"
        >
          Tümünü %10 artır
        </button>
        <button
          onClick={() => multiplyAll(1.25)}
          className="h-9 px-4 rounded-full border border-ink-200 text-sm hover:border-brand-400 hover:text-brand-700 transition-colors"
        >
          Tümünü %25 artır
        </button>
        <button
          onClick={() => multiplyAll(0.9)}
          className="h-9 px-4 rounded-full border border-ink-200 text-sm hover:border-brand-400 hover:text-brand-700 transition-colors"
        >
          Tümünü %10 azalt
        </button>
        <button
          onClick={resetToDefaults}
          className="h-9 px-4 rounded-full border border-ink-200 text-sm text-ink-500 hover:text-ink-900 transition-colors ml-auto"
        >
          Varsayılanlara dön
        </button>
      </div>

      {SECTIONS.map((section) => (
        <section
          key={section.key}
          className="bg-white border border-ink-100 rounded-xl p-5"
        >
          <h2 className="font-bold text-ink-900">{section.title}</h2>
          <p className="text-xs text-ink-500 mt-0.5 mb-4">{section.hint}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {items[section.key].map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-ink-100 px-3 py-2"
              >
                <span className="flex-1 text-sm text-ink-900">{item.name}</span>
                <input
                  type="number"
                  min={0}
                  step={5}
                  inputMode="numeric"
                  value={draft[section.key][item.id] ?? ""}
                  onChange={(e) =>
                    update(section.key, item.id, e.target.value)
                  }
                  className="w-28 h-9 rounded-lg border border-ink-100 px-3 text-sm text-right tabular-nums focus:border-brand-500 outline-none"
                />
                <span className="text-sm text-ink-500">₺</span>
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-4 sticky bottom-4">
        <button
          onClick={save}
          disabled={saving}
          className="h-11 px-7 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 disabled:bg-ink-300 shadow-soft"
        >
          {saving ? "Kaydediliyor..." : "Fiyatları Kaydet"}
        </button>
        {saved ? (
          <p className="text-sm text-emerald-700 font-medium">
            Kaydedildi ✓ Siteye en geç 5 dakikada yansır.
          </p>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
