import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

type DayStat = {
  label: string;
  views: number;
  visitors: number;
};

type TrafficDashboard = {
  totalPageViews: number;
  todayPageViews: number;
  todayVisitors: number;
  sevenDayVisitors: number;
  dailyStats: DayStat[];
  topProducts: {
    id: number;
    name: string;
    slug: string | null;
    image: string | null;
    views: number;
    sevenDayViews: number;
  }[];
};

const emptyTrafficDashboard: TrafficDashboard = {
  totalPageViews: 0,
  todayPageViews: 0,
  todayVisitors: 0,
  sevenDayVisitors: 0,
  dailyStats: [],
  topProducts: [],
};

const dayLabelFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
});

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

async function loadTrafficDashboard(): Promise<TrafficDashboard> {
  const todayStart = startOfDay(new Date());
  const sevenDaysStart = startOfDay(new Date());
  sevenDaysStart.setDate(sevenDaysStart.getDate() - 6);

  try {
    const [
      totalPageViews,
      todayPageViews,
      todayVisitors,
      sevenDayVisitors,
      sevenDayEvents,
      productViewTotals,
      productViewWeek,
    ] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: todayStart }, visitorId: { not: null } },
        distinct: ["visitorId"],
        select: { visitorId: true },
      }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: sevenDaysStart }, visitorId: { not: null } },
        distinct: ["visitorId"],
        select: { visitorId: true },
      }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: sevenDaysStart } },
        select: { createdAt: true, visitorId: true },
      }),
      prisma.pageView.groupBy({
        by: ["productId"],
        where: { productId: { not: null } },
        _count: { productId: true },
      }),
      prisma.pageView.groupBy({
        by: ["productId"],
        where: {
          productId: { not: null },
          createdAt: { gte: sevenDaysStart },
        },
        _count: { productId: true },
      }),
    ]);

    const topRows = productViewTotals
      .sort((a, b) => b._count.productId - a._count.productId)
      .slice(0, 8);
    const productIds = topRows
      .map((row) => row.productId)
      .filter((id): id is number => id !== null);
    const products = productIds.length
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true, slug: true, image: true },
        })
      : [];

    const weeklyViews = new Map(
      productViewWeek
        .filter((row) => row.productId !== null)
        .map((row) => [row.productId as number, row._count.productId]),
    );
    const productsById = new Map(products.map((product) => [product.id, product]));

    const dailyBuckets = new Map<
      string,
      { label: string; views: number; visitorIds: Set<string> }
    >();
    for (let index = 0; index < 7; index += 1) {
      const date = new Date(sevenDaysStart);
      date.setDate(sevenDaysStart.getDate() + index);
      dailyBuckets.set(dayKey(date), {
        label: dayLabelFormatter.format(date),
        views: 0,
        visitorIds: new Set<string>(),
      });
    }

    for (const event of sevenDayEvents) {
      const bucket = dailyBuckets.get(dayKey(event.createdAt));
      if (!bucket) continue;
      bucket.views += 1;
      if (event.visitorId) bucket.visitorIds.add(event.visitorId);
    }

    return {
      totalPageViews,
      todayPageViews,
      todayVisitors: todayVisitors.length,
      sevenDayVisitors: sevenDayVisitors.length,
      dailyStats: Array.from(dailyBuckets.values()).map((bucket) => ({
        label: bucket.label,
        views: bucket.views,
        visitors: bucket.visitorIds.size,
      })),
      topProducts: topRows
        .map((row) => {
          if (row.productId === null) return null;
          const product = productsById.get(row.productId);
          if (!product) return null;
          return {
            ...product,
            views: row._count.productId,
            sevenDayViews: weeklyViews.get(row.productId) ?? 0,
          };
        })
        .filter((product): product is TrafficDashboard["topProducts"][number] =>
          Boolean(product),
        ),
    };
  } catch (error) {
    console.error("Trafik istatistikleri okunamadi", error);
    return emptyTrafficDashboard;
  }
}

async function loadDashboard() {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [revenue, last24, total, recent, traffic] = await Promise.all([
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
    loadTrafficDashboard(),
  ]);
  return {
    revenue: revenue._sum.totalAmount ?? 0,
    last24,
    total,
    recent,
    traffic,
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

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat
          label="Bugün Tekil Ziyaretçi"
          value={String(data.traffic.todayVisitors)}
          tone="brand"
        />
        <Stat
          label="Son 7 Gün Tekil"
          value={String(data.traffic.sevenDayVisitors)}
          tone="ink"
        />
        <Stat
          label="Bugün Sayfa Görüntüleme"
          value={String(data.traffic.todayPageViews)}
          tone="amber"
        />
        <Stat
          label="Toplam Görüntüleme"
          value={String(data.traffic.totalPageViews)}
          tone="slate"
        />
      </div>

      <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-4">
        <section className="bg-white border border-ink-100 rounded-xl overflow-hidden">
          <header className="px-5 py-4 border-b border-ink-100">
            <h2 className="font-bold">En Çok Görüntülenen Ürünler</h2>
            <p className="text-xs text-ink-500 mt-1">
              Ürün detay sayfası görüntülemelerine göre
            </p>
          </header>
          <table className="w-full text-sm">
            <thead className="bg-cream-50 text-ink-500 uppercase text-xs">
              <tr>
                <th className="text-left p-3">Ürün</th>
                <th className="text-left p-3">Toplam</th>
                <th className="text-left p-3">Son 7 Gün</th>
              </tr>
            </thead>
            <tbody>
              {data.traffic.topProducts.map((product) => (
                <tr key={product.id} className="border-t border-ink-100">
                  <td className="p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative size-12 overflow-hidden rounded-lg bg-cream-50 border border-ink-100 shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      {product.slug ? (
                        <Link
                          href={`/urun/${product.slug}`}
                          className="font-semibold text-ink-900 hover:text-brand-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {product.name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-ink-900">
                          {product.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-bold">{product.views}</td>
                  <td className="p-3 text-ink-700">{product.sevenDayViews}</td>
                </tr>
              ))}
              {data.traffic.topProducts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-ink-500">
                    Henüz ürün görüntüleme verisi yok
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>

        <section className="bg-white border border-ink-100 rounded-xl p-5">
          <h2 className="font-bold">Son 7 Gün Trafik</h2>
          <div className="mt-4 space-y-3">
            {data.traffic.dailyStats.map((day) => (
              <div key={day.label}>
                <div className="flex items-center justify-between text-xs text-ink-500 mb-1">
                  <span>{day.label}</span>
                  <span>
                    {day.visitors} tekil / {day.views} görüntüleme
                  </span>
                </div>
                <div className="h-2 rounded-full bg-cream-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{
                      width: `${Math.min(
                        100,
                        day.views === 0
                          ? 0
                          : Math.max(
                              8,
                              (day.views /
                                Math.max(
                                  1,
                                  ...data.traffic.dailyStats.map((d) => d.views),
                                )) *
                                100,
                            ),
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {data.traffic.dailyStats.length === 0 ? (
              <p className="text-sm text-ink-500">Trafik verisi yok</p>
            ) : null}
          </div>
        </section>
      </div>

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
  tone: "brand" | "amber" | "ink" | "slate";
}) {
  const toneClass = {
    brand: "bg-brand-500 text-white",
    amber: "bg-amber-500 text-white",
    ink: "bg-ink-900 text-white",
    slate: "bg-ink-700 text-white",
  }[tone];
  return (
    <div className={`rounded-xl p-5 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wider opacity-80">{label}</p>
      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
  );
}
