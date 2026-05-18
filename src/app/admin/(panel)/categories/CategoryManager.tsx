"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

type Cat = { id: number; name: string; slug: string; isActive: boolean };

export function CategoryManager({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function add() {
    if (!name.trim()) return;
    setLoading(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const j = await res.json();
      setItems([...items, j.category]);
      setName("");
      router.refresh();
    }
    setLoading(false);
  }

  async function toggleActive(id: number, isActive: boolean) {
    await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setItems(items.map((c) => (c.id === id ? { ...c, isActive } : c)));
  }

  async function remove(id: number) {
    if (!confirm("Kategori silinsin mi? (ürünleri etkilemez)")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setItems(items.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Yeni kategori adı..."
          className="flex-1 h-11 rounded-lg border border-ink-100 px-3.5 text-sm"
        />
        <button
          onClick={add}
          disabled={loading}
          className="h-11 px-5 rounded-full bg-brand-500 text-white text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-brand-600 disabled:bg-ink-300"
        >
          <Plus className="size-4" /> Ekle
        </button>
      </div>

      <div className="bg-white border border-ink-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-50 text-ink-500 uppercase text-xs">
            <tr>
              <th className="text-left p-3">Ad</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Aktif</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-ink-100">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-ink-500 font-mono text-xs">
                  {c.slug}
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={c.isActive}
                    onChange={(e) => toggleActive(c.id, e.target.checked)}
                  />
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => remove(c.id)}
                    className="text-red-600 hover:bg-red-50 size-8 rounded grid place-items-center"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
