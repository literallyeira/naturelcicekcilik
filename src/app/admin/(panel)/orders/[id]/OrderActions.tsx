"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";

const STATUS_OPTIONS = ["hazırlanıyor", "yolda", "teslim edildi"];

export function OrderActions({
  orderId,
  paymentStatus,
  orderStatus,
}: {
  orderId: number;
  paymentStatus: string;
  orderStatus: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ps, setPs] = useState(paymentStatus);
  const [os, setOs] = useState(orderStatus);

  async function update(patch: Record<string, string>) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) startTransition(() => router.refresh());
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="h-10 rounded-lg border border-ink-100 px-3 text-sm bg-white font-semibold text-ink-700 hover:bg-cream-50 inline-flex items-center gap-2"
      >
        <Printer className="size-4" />
        Teslimat Fişi Yazdır
      </button>
      <select
        value={ps}
        onChange={(e) => {
          setPs(e.target.value);
          update({ paymentStatus: e.target.value });
        }}
        disabled={pending}
        className="h-10 rounded-lg border border-ink-100 px-3 text-sm bg-white"
      >
        <option value="pending">Ödeme: Bekliyor</option>
        <option value="paid">Ödeme: Ödendi</option>
      </select>
      <select
        value={os}
        onChange={(e) => {
          setOs(e.target.value);
          update({ orderStatus: e.target.value });
        }}
        disabled={pending}
        className="h-10 rounded-lg border border-ink-100 px-3 text-sm bg-white"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            Durum: {s}
          </option>
        ))}
      </select>
    </div>
  );
}
