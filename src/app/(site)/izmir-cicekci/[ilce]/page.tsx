import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock, MapPin, Phone, Truck } from "lucide-react";
import { prisma } from "@/lib/db";
import { DISTRICTS, findDistrict } from "@/lib/districts";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_NAME,
  SITE_URL,
  breadcrumbJsonLd,
  floristJsonLd,
  pageMetadata,
} from "@/lib/seo";
import { PHONE_HREF, PHONE_INTL_DISPLAY } from "@/lib/site";

type Params = Promise<{ ilce: string }>;

export const revalidate = 3600;

export function generateStaticParams() {
  return DISTRICTS.map((d) => ({ ilce: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { ilce } = await params;
  const district = findDistrict(ilce);
  if (!district) return { title: "Sayfa bulunamadı" };

  return pageMetadata({
    title: `${district.name} Çiçekçi — Aynı Gün Teslimat`,
    description: `${district.name} çiçekçi: ${district.areas.slice(0, 4).join(", ")} ve tüm ${district.name} mahallelerine ${district.eta} taze çiçek teslimatı. Gül buketi, aranjman, orkide ve saksı çiçeği siparişi.`,
    path: `/izmir-cicekci/${district.slug}`,
  });
}

export default async function DistrictPage({ params }: { params: Params }) {
  const { ilce } = await params;
  const district = findDistrict(ilce);
  if (!district) notFound();

  const products = await prisma.product
    .findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 8,
    })
    .catch(() => []);

  const others = DISTRICTS.filter((d) => d.slug !== district.slug);

  return (
    <>
      <JsonLd
        data={{
          ...floristJsonLd(),
          "@id": `${SITE_URL}/izmir-cicekci/${district.slug}#florist`,
          name: `${SITE_NAME} — ${district.name} Çiçekçi`,
          areaServed: {
            "@type": "AdministrativeArea",
            name: `${district.name}, İzmir`,
          },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "İzmir Çiçekçi", path: "/izmir-cicekci" },
          {
            name: `${district.name} Çiçekçi`,
            path: `/izmir-cicekci/${district.slug}`,
          },
        ])}
      />

      <div className="bg-gradient-to-b from-cream-50 to-white border-b border-ink-100">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <nav className="text-sm text-ink-500 mb-6">
            <Link href="/" className="hover:text-ink-900">
              Anasayfa
            </Link>
            <span className="mx-2">/</span>
            <Link href="/izmir-cicekci" className="hover:text-ink-900">
              İzmir Çiçekçi
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-900">{district.name}</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl text-ink-900 leading-tight">
            {district.name} Çiçekçi
          </h1>
          <p className="mt-4 text-ink-600 max-w-2xl leading-relaxed">
            {district.intro}
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-3xl">
            <Fact
              icon={<Clock className="size-4" />}
              label="Teslimat süresi"
              value={district.eta}
            />
            <Fact
              icon={<Truck className="size-4" />}
              label="Kargo"
              value="500₺ üzeri ücretsiz"
            />
            <Fact
              icon={<MapPin className="size-4" />}
              label="Kapsam"
              value={`Tüm ${district.name}`}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/kategori/buketler"
              className="inline-flex items-center h-12 px-7 rounded-full bg-ink-900 text-white text-[13px] font-semibold uppercase tracking-[0.1em] hover:bg-brand-600 transition-colors"
            >
              Buketleri Gör
            </Link>
            <Link
              href="/buket-yap"
              className="inline-flex items-center h-12 px-7 rounded-full border border-ink-200 bg-white text-[13px] font-semibold text-ink-900 hover:border-brand-400 hover:text-brand-700 transition-colors"
            >
              Kendi Buketini Yap
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-brand-200 bg-brand-50 text-[13px] font-semibold text-brand-700"
            >
              <Phone className="size-4" /> {PHONE_INTL_DISPLAY}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="font-display text-2xl md:text-3xl text-ink-900">
          {district.name}&apos;ye en çok gönderilen çiçekler
        </h2>
        <p className="text-sm text-ink-500 mt-2">
          Hepsi aynı gün teslimata uygun.
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price.toString(),
                image: p.image,
                isFeatured: p.isFeatured,
              }}
            />
          ))}
        </div>

        <section className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl text-ink-900">
            {district.name}&apos;de çiçek siparişi nasıl verilir?
          </h2>
          <div className="content mt-4 text-ink-600 leading-relaxed">
            <p>
              Beğendiğiniz buketi seçip &quot;Sipariş Ver&quot; adımından alıcı
              bilgilerini ve teslimat saatini giriyorsunuz. {district.name}{" "}
              içindeki adreslere siparişiniz {district.eta} teslim edilir. Ne
              göndereceğinize karar veremediyseniz{" "}
              <Link href="/buket-yap" className="text-brand-600 underline underline-offset-4">
                kendi buketinizi tasarlayabilir
              </Link>
              , çiçekleri tek tek seçip fiyatı anında görebilirsiniz.
            </p>
            <p>
              Teslimat yaptığımız {district.name} mahalleleri arasında{" "}
              {district.areas.join(", ")} ve çevresi bulunur. Adresiniz listede
              yoksa endişelenmeyin — {district.name}&apos;nin tamamına teslimat
              yapıyoruz, dilerseniz{" "}
              <a href={PHONE_HREF} className="text-brand-600 underline underline-offset-4">
                {PHONE_INTL_DISPLAY}
              </a>{" "}
              numarasından teyit alabilirsiniz.
            </p>
            <h3>Hangi durumlar için çiçek gönderiliyor?</h3>
            <p>
              Doğum günü, yıldönümü, sevgililer günü, anneler günü, geçmiş olsun,
              yeni iş / açılış tebriği ve taziye çiçekleri {district.name}{" "}
              genelinde en çok tercih edilenler. Düğün organizasyonları ve gelin
              arabası süslemeleri için önceden randevu almanızı öneririz.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-xl text-ink-900 mb-4">
            İzmir&apos;in diğer ilçelerine teslimat
          </h2>
          <div className="flex flex-wrap gap-2">
            {others.map((d) => (
              <Link
                key={d.slug}
                href={`/izmir-cicekci/${d.slug}`}
                className="rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-700 hover:border-brand-400 hover:text-brand-700 transition-colors"
              >
                {d.name} Çiçekçi
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-ink-500">
        <span className="text-brand-600">{icon}</span>
        {label}
      </p>
      <p className="mt-1.5 font-semibold text-ink-900">{value}</p>
    </div>
  );
}
