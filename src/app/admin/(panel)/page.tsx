import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

async function loadDashboard() {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [revenue, last24, total, recent] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: "paid" },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: dayAgo } } }),
    prisma.order.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { product: { select: { name: true } } },
    }),
  ]);
  return {
    revenue: revenue._sum.totalAmount ?? 0,
    last24,
    total,
    recent,
  };
}

export default async function Dashboard() {
  const data = await loadDashboard();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-black text-ink-900">Genel Bakış</h1>
        <p className="text-ink-500 text-sm">İşletmenin anlık özeti</p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat
          label="Toplam Ciro"
          value={formatPrice(data.revenue)}
          tone="brand"
        />
        <Stat
          label="Son 24 Saat Sipariş"
          value={String(data.last24)}
          tone="amber"
        />
        <Stat
          label="Toplam Sipariş"
          value={String(data.total)}
          tone="ink"
        />
      </div>

      <section className="bg-white border border-ink-100 rounded-xl overflow-hidden">
        <header className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
          <h2 className="font-bold">Son Siparişler</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-brand-600 font-semibold hover:underline"
          >
            Tümünü Gör →
          </Link>
        </header>
        <table className="w-full text-sm">
          <thead className="bg-cream-50 text-ink-500 uppercase text-xs">
            <tr>
              <th className="text-left p-3">Sipariş No</th>
              <th className="text-left p-3">Ürün</th>
              <th className="text-left p-3">Alıcı</th>
              <th className="text-left p-3">Tutar</th>
              <th className="text-left p-3">Ödeme</th>
              <th className="text-left p-3">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.map((o) => (
              <tr key={o.id} className="border-t border-ink-100">
                <td className="p-3 font-mono text-xs">{o.merchantOid}</td>
                <td className="p-3">{o.product?.name ?? "—"}</td>
                <td className="p-3">
                  {o.recipientName} {o.recipientSurname}
                </td>
                <td className="p-3 font-semibold">
                  {formatPrice(o.totalAmount ?? 0)}
                </td>
                <td className="p-3">
                  <span
                    className={
                      o.paymentStatus === "paid"
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }
                  >
                    {o.paymentStatus === "paid" ? "Ödendi" : "Bekliyor"}
                  </span>
                </td>
                <td className="p-3 text-ink-500">
                  {formatDateTime(o.createdAt)}
                </td>
              </tr>
            ))}
            {data.recent.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-ink-500">
                  Henüz sipariş yok
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "brand" | "amber" | "ink";
}) {
  const toneClass = {
    brand: "bg-brand-500 text-white",
    amber: "bg-amber-500 text-white",
    ink: "bg-ink-900 text-white",
  }[tone];
  return (
    <div className={`rounded-xl p-5 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wider opacity-80">{label}</p>
      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
  );
}
