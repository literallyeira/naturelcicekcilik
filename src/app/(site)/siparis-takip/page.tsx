import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import { Search } from "lucide-react";

type SP = Promise<{ oid?: string }>;

export const metadata = {
  title: "Sipariş Takibi",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  hazırlanıyor: { label: "Hazırlanıyor", color: "bg-amber-100 text-amber-800" },
  yolda: { label: "Yolda", color: "bg-blue-100 text-blue-800" },
  "teslim edildi": {
    label: "Teslim Edildi",
    color: "bg-emerald-100 text-emerald-800",
  },
};

async function findOrder(oid: string) {
  return prisma.order.findUnique({
    where: { merchantOid: oid },
    include: { product: true },
  });
}

export default async function OrderTrackPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const { oid } = await searchParams;
  const order = oid ? await findOrder(oid) : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-3xl font-black tracking-tight text-ink-900 mb-2">
        Sipariş Takibi
      </h1>
      <p className="text-ink-500 mb-8">
        Sipariş numaranızla siparişinizin durumunu sorgulayın.
      </p>

      <form className="flex gap-2 mb-10" method="get">
        <input
          name="oid"
          defaultValue={oid ?? ""}
          placeholder="Örn: NTRL1763456789123"
          className="flex-1 h-12 rounded-full border border-ink-100 px-5 outline-none focus:border-brand-500 transition-colors"
        />
        <button className="h-12 px-6 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 inline-flex items-center gap-2">
          <Search className="size-4" /> Sorgula
        </button>
      </form>

      {oid && !order ? (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          Bu numara ile bir sipariş bulunamadı. Lütfen numarayı kontrol edin.
        </div>
      ) : null}

      {order ? (
        <article className="border border-ink-100 rounded-xl p-6 space-y-5">
          <header className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-500">
                Sipariş No
              </p>
              <p className="font-mono font-bold text-ink-900">
                {order.merchantOid}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                STATUS_LABELS[order.orderStatus]?.color ??
                "bg-ink-100 text-ink-700"
              }`}
            >
              {STATUS_LABELS[order.orderStatus]?.label ?? order.orderStatus}
            </span>
          </header>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Info label="Ürün" value={order.product?.name ?? "—"} />
            <Info
              label="Tutar"
              value={formatPrice(order.totalAmount ?? 0)}
            />
            <Info
              label="Teslimat Günü"
              value={formatDate(order.deliveryDay)}
            />
            <Info
              label="Teslimat Saati"
              value={order.deliveryHour ?? "—"}
            />
            <Info
              label="Alıcı"
              value={`${order.recipientName ?? ""} ${order.recipientSurname ?? ""}`}
            />
            <Info
              label="Şehir"
              value={`${order.district ?? ""} / ${order.recipientCity ?? ""}`}
            />
            <Info
              label="Ödeme"
              value={order.paymentStatus === "paid" ? "Ödendi" : "Bekliyor"}
            />
            <Info label="Sipariş Tarihi" value={formatDate(order.orderDate)} />
          </div>
        </article>
      ) : null}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-ink-500 mb-0.5">
        {label}
      </p>
      <p className="text-ink-900">{value}</p>
    </div>
  );
}
