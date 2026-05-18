import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime, formatDate } from "@/lib/format";
import { OrderActions } from "./OrderActions";

type Params = Promise<{ id: string }>;

export const dynamic = "force-dynamic";

export default async function OrderDetail({ params }: { params: Params }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { product: true },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink-900">
            Sipariş #{order.id}
          </h1>
          <p className="text-ink-500 text-sm font-mono">{order.merchantOid}</p>
        </div>
        <OrderActions
          orderId={order.id}
          paymentStatus={order.paymentStatus}
          orderStatus={order.orderStatus}
        />
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Ürün">
          <Line label="Ad" value={order.product?.name ?? "—"} />
          <Line label="Tutar" value={formatPrice(order.totalAmount ?? 0)} />
          <Line
            label="Sipariş Tarihi"
            value={formatDateTime(order.orderDate ?? order.createdAt)}
          />
        </Card>
        <Card title="Teslimat">
          <Line label="Gün" value={formatDate(order.deliveryDay)} />
          <Line label="Saat" value={order.deliveryHour ?? "—"} />
          <Line
            label="Ödeme Durumu"
            value={order.paymentStatus === "paid" ? "Ödendi" : "Bekliyor"}
          />
          <Line label="Sipariş Durumu" value={order.orderStatus} />
        </Card>
        <Card title="Gönderici">
          <Line
            label="Ad Soyad"
            value={`${order.senderName ?? ""} ${order.senderSurname ?? ""}`}
          />
          <Line label="Telefon" value={order.senderPhone ?? "—"} />
          <Line label="E-posta" value={order.senderEmail ?? "—"} />
          <Line label="Adres" value={order.senderAddress ?? "—"} />
        </Card>
        <Card title="Alıcı">
          <Line
            label="Ad Soyad"
            value={`${order.recipientName ?? ""} ${order.recipientSurname ?? ""}`}
          />
          <Line label="Telefon" value={order.recipientPhone ?? "—"} />
          <Line label="Adres" value={order.recipientAddress ?? "—"} />
          <Line
            label="Şehir / İlçe"
            value={`${order.district ?? ""} / ${order.recipientCity ?? ""}`}
          />
        </Card>
        {order.note ? (
          <Card title="Kart Notu">
            <p className="text-ink-700 whitespace-pre-line">{order.note}</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-ink-100 rounded-xl p-5">
      <h2 className="font-bold mb-3 text-ink-900">{title}</h2>
      <div className="space-y-2 text-sm">{children}</div>
    </section>
  );
}

function Line({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-ink-500 w-32 shrink-0">{label}:</span>
      <span className="text-ink-900">{value}</span>
    </div>
  );
}
