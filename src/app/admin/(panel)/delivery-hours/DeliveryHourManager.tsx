"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

type Item = { id: number; timeSlot: string; isActive: boolean };

export function DeliveryHourManager({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [slot, setSlot] = useState("");

  async function add() {
    if (!slot.trim()) return;
    const res = await fetch("/api/admin/delivery-hours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timeSlot: slot }),
    });
    if (res.ok) {
      const j = await res.json();
      setItems([...items, j.item]);
      setSlot("");
      router.refresh();
    }
  }

  async function toggle(id: number, isActive: boolean) {
    await fetch(`/api/admin/delivery-hours/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setItems(items.map((i) => (i.id === id ? { ...i, isActive } : i)));
  }

  async function remove(id: number) {
    if (!confirm("Silinsin mi?")) return;
    await fetch(`/api/admin/delivery-hours/${id}`, { method: "DELETE" });
    setItems(items.filter((i) => i.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          placeholder="Örn: 09:00 - 12:00"
          className="flex-1 h-11 rounded-lg border border-ink-100 px-3.5 text-sm"
        />
        <button
          onClick={add}
          className="h-11 px-5 rounded-full bg-brand-500 text-white text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-brand-600"
        >
          <Plus className="size-4" /> Ekle
        </button>
      </div>
      <div className="bg-white border border-ink-100 rounded-xl divide-y divide-ink-100">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between p-3.5"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={i.isActive}
                onChange={(e) => toggle(i.id, e.target.checked)}
              />
              <span className="font-medium">{i.timeSlot}</span>
              {!i.isActive ? (
                <span className="text-xs text-ink-500">(pasif)</span>
              ) : null}
            </div>
            <button
              onClick={() => remove(i.id)}
              className="text-red-600 hover:bg-red-50 size-8 rounded grid place-items-center"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
