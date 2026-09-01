import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black text-ink-900">Siparişler</h1>
        <p className="text-ink-500 text-sm">{orders.length} kayıt</p>
      </header>

      <div className="bg-white border border-ink-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-50 text-ink-500 uppercase text-xs">
            <tr>
              <th className="text-left p-3">Sipariş No</th>
              <th className="text-left p-3">Ürün</th>
              <th className="text-left p-3">Alıcı</th>
              <th className="text-left p-3">Şehir</th>
              <th className="text-left p-3">Tutar</th>
              <th className="text-left p-3">Ödeme</th>
              <th className="text-left p-3">Durum</th>
              <th className="text-left p-3">Tarih</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-ink-100">
                <td className="p-3 font-mono text-xs">{o.merchantOid}</td>
                <td className="p-3">
                  {o.product?.name ?? (
                    <span className="text-brand-700 font-semibold">
                      Özel Buket
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {o.recipientName} {o.recipientSurname}
                </td>
                <td className="p-3">
                  {o.district}/{o.recipientCity}
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
                <td className="p-3">{o.orderStatus}</td>
                <td className="p-3 text-ink-500">
                  {formatDateTime(o.createdAt)}
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-brand-600 hover:underline text-xs font-semibold"
                  >
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-10 text-center text-ink-500">
                  Sipariş yok
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
