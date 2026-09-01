import { notFound } from "next/navigation";
import Image from "next/image";
import type { Order, Product } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime, formatDate } from "@/lib/format";
import { OrderActions } from "./OrderActions";

type Params = Promise<{ id: string }>;
type OrderWithProduct = Order & { product: Product | null };

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
      <header className="no-print flex items-center justify-between flex-wrap gap-3">
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

      <PrintableDeliverySlip order={order} />

      <div className="no-print grid md:grid-cols-2 gap-4">
        <Card title="Ürün">
          {order.product?.image ? (
            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg border border-ink-100 bg-cream-50">
              <Image
                src={order.product.image}
                alt={order.product.name}
                fill
                sizes="(max-width:768px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          ) : null}
          <Line
            label="Ad"
            value={
              order.product?.name ?? "Özel Buket (müşteri tasarımı — nota bakın)"
            }
          />
          <Line label="Tutar" value={formatPrice(order.totalAmount ?? 0)} />
          <Line
            label="Sipariş Tarihi"
            value={formatDateTime(order.orderDate ?? order.createdAt)}
          />
        </Card>
        <Card title="Teslimat">
          <Line label="Gün" value={formatDate(order.deliveryDay)} />
          <Line label="Saat" value={order.deliveryHour ?? "-"} />
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
          <Line label="Telefon" value={order.senderPhone ?? "-"} />
          <Line label="E-posta" value={order.senderEmail ?? "-"} />
          <Line label="Adres" value={order.senderAddress ?? "-"} />
        </Card>
        <Card title="Alıcı">
          <Line
            label="Ad Soyad"
            value={`${order.recipientName ?? ""} ${order.recipientSurname ?? ""}`}
          />
          <Line label="Telefon" value={order.recipientPhone ?? "-"} />
          <Line label="Adres" value={order.recipientAddress ?? "-"} />
          <Line
            label="Şehir / İlçe"
            value={`${order.district ?? ""} / ${order.recipientCity ?? ""}`}
          />
        </Card>
        {order.note ? (
          <Card title={order.product ? "Kart Notu" : "Buket İçeriği & Not"}>
            <p className="text-ink-700 whitespace-pre-line">{order.note}</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function PrintableDeliverySlip({ order }: { order: OrderWithProduct }) {
  const recipient = `${order.recipientName ?? ""} ${
    order.recipientSurname ?? ""
  }`.trim();
  const sender = `${order.senderName ?? ""} ${order.senderSurname ?? ""}`.trim();

  return (
    <section className="printable-slip bg-white text-ink-900">
      <div className="border-b border-ink-300 pb-4 mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-ink-500">Naturel Çiçekçilik</p>
          <h2 className="text-3xl font-black mt-1">Teslimat Fişi</h2>
          <p className="font-mono text-sm text-ink-500 mt-1">
            {order.merchantOid ?? `Sipariş #${order.id}`}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-bold">Sipariş #{order.id}</p>
          <p>{formatDateTime(order.orderDate ?? order.createdAt)}</p>
          <p className="mt-2">
            {order.paymentStatus === "paid" ? "Ödendi" : "Ödeme Bekliyor"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[160px_1fr] gap-5">
        <div className="relative h-40 overflow-hidden rounded-lg border border-ink-200 bg-cream-50">
          {order.product?.image ? (
            <Image
              src={order.product.image}
              alt={order.product.name}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-ink-500">
              Ürün fotoğrafı yok
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase text-ink-500">Ürün</p>
          <h3 className="text-xl font-black">
            {order.product?.name ?? "Özel Buket (müşteri tasarımı)"}
          </h3>
          <p className="mt-2 text-sm">
            Tutar: <strong>{formatPrice(order.totalAmount ?? 0)}</strong>
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-5">
        <SlipBox title="Teslimat">
          <SlipLine label="Alıcı" value={recipient || "-"} />
          <SlipLine label="Telefon" value={order.recipientPhone ?? "-"} />
          <SlipLine label="Adres" value={order.recipientAddress ?? "-"} />
          <SlipLine
            label="İlçe / Şehir"
            value={`${order.district ?? "-"} / ${order.recipientCity ?? "-"}`}
          />
          <SlipLine label="Gün" value={formatDate(order.deliveryDay)} />
          <SlipLine label="Saat" value={order.deliveryHour ?? "-"} />
        </SlipBox>

        <SlipBox title="Gönderici">
          <SlipLine label="Ad Soyad" value={sender || "-"} />
          <SlipLine label="Telefon" value={order.senderPhone ?? "-"} />
          <SlipLine label="E-posta" value={order.senderEmail ?? "-"} />
          <SlipLine
            label="Anonim"
            value={order.isAnonymous ? "Evet" : "Hayır"}
          />
          <SlipLine label="Durum" value={order.orderStatus} />
        </SlipBox>
      </div>

      {order.note ? (
        <div className="mt-5 border border-ink-200 rounded-lg p-4">
          <p className="text-xs uppercase text-ink-500 mb-2">
            {order.product ? "Kart Notu" : "Buket İçeriği & Kart Notu"}
          </p>
          <p className="whitespace-pre-line text-lg leading-relaxed">
            {order.note}
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-2 gap-5 text-sm">
        <div className="border-t border-ink-300 pt-3">Hazırlayan</div>
        <div className="border-t border-ink-300 pt-3">Kurye / Teslim Alan</div>
      </div>
    </section>
  );
}

function SlipBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-ink-200 rounded-lg p-4">
      <h3 className="font-black mb-3">{title}</h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function SlipLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-2">
      <span className="text-ink-500">{label}:</span>
      <span className="font-semibold">{value}</span>
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
