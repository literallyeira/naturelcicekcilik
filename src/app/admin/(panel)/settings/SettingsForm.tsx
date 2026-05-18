"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SettingsForm({
  kdvIncluded,
  activeTheme,
}: {
  kdvIncluded: boolean;
  activeTheme: string;
}) {
  const router = useRouter();
  const [kdv, setKdv] = useState(kdvIncluded);
  const [theme, setTheme] = useState(activeTheme);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kdv_dahil: kdv ? "1" : "0",
        active_theme: theme,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="bg-white border border-ink-100 rounded-xl p-6 space-y-5">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={kdv}
          onChange={(e) => setKdv(e.target.checked)}
        />
        <div>
          <p className="font-medium text-ink-900">Fiyatlara KDV dahil</p>
          <p className="text-xs text-ink-500">
            Kapalıysa fiyatlara %20 KDV eklenerek gösterilir.
          </p>
        </div>
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-ink-700 mb-1.5">
          Aktif Tema
        </span>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="h-11 rounded-lg border border-ink-100 px-3.5 text-sm bg-white"
        >
          <option value="default">Varsayılan</option>
          <option value="valentine">Sevgililer Günü</option>
        </select>
      </label>

      <button
        onClick={save}
        disabled={saving}
        className="h-11 px-7 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 disabled:bg-ink-300"
      >
        {saving ? "Kaydediliyor..." : "Kaydet"}
      </button>
      {saved ? <p className="text-sm text-emerald-700">Kaydedildi ✓</p> : null}
    </div>
  );
}
