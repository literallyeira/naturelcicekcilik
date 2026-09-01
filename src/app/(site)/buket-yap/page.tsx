import type { Metadata } from "next";
import Link from "next/link";
import { Flower2, HandHeart, Truck, Wallet } from "lucide-react";
import { prisma } from "@/lib/db";
import { BouquetBuilder } from "@/components/bouquet/BouquetBuilder";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";
import { MIN_STEMS } from "@/lib/bouquet";
import { getBouquetCatalog } from "@/lib/bouquetCatalog";

// Admin panelden fiyat değişince sayfa en geç 5 dakikada tazelenir.
export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Kendi Buketini Yap — Online Buket Tasarla",
  description:
    "İzmir'de kendi buketini kendin tasarla. Gül, papatya, gerbera, lilyum seç; ambalajını belirle, buketini anında görüntüle ve fiyatını canlı hesapla. Aynı gün İzmir teslimat.",
  path: "/buket-yap",
});

const STEPS = [
  {
    icon: Flower2,
    title: "Çiçekleri seç",
    text: "Gül, papatya, gerbera, lilyum, ayçiçeği ve yeşilliklerden dilediğin kadar ekle.",
  },
  {
    icon: Wallet,
    title: "Fiyatı anında gör",
    text: "Her dal ekledikçe toplam tutar canlı güncellenir. Sürpriz fiyat yok.",
  },
  {
    icon: HandHeart,
    title: "Ustalarımız hazırlasın",
    text: "Buketini çiçekçilerimiz elde, tazesinden ve senin tarifine göre hazırlar.",
  },
  {
    icon: Truck,
    title: "Aynı gün teslim",
    text: "İzmir içi teslimat aynı gün, seçtiğin saat aralığında kapıda.",
  },
];

export default async function CustomBouquetPage() {
  const [deliveryHours, catalog] = await Promise.all([
    prisma.deliveryHour
      .findMany({ where: { isActive: true }, orderBy: { id: "asc" } })
      .catch(() => []),
    getBouquetCatalog(),
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Kendi Buketini Yap — Kişiye Özel Çiçek Buketi Tasarımı",
          serviceType: "Kişiselleştirilmiş çiçek buketi hazırlama",
          provider: { "@type": "Florist", name: SITE_NAME, url: SITE_URL },
          areaServed: { "@type": "City", name: "İzmir" },
          url: `${SITE_URL}/buket-yap`,
          description:
            "Çiçeklerini tek tek seçerek kendi buketini tasarla, buketini ekranda gör, fiyatını anında hesapla ve aynı gün İzmir'e gönder.",
          offers: {
            "@type": "Offer",
            priceCurrency: "TRY",
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Anasayfa",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Kendi Buketini Yap",
              item: `${SITE_URL}/buket-yap`,
            },
          ],
        }}
      />

      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-cream-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">
            <Flower2 className="size-3.5" /> İzmir&apos;de bir ilk
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-5xl text-ink-900 leading-[1.1]">
            Kendi buketini kendin yap
          </h1>
          <p className="mt-4 text-ink-700 max-w-2xl mx-auto leading-relaxed">
            Çiçeği tek tek seç, ambalajını belirle, buketin ekranda oluşurken
            fiyatını anında gör. Beğendiğin buketi aynı gün İzmir&apos;de
            sevdiklerine gönderelim.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <BouquetBuilder
          catalog={catalog}
          deliveryHours={deliveryHours.map((h) => ({
            id: h.id,
            timeSlot: h.timeSlot,
          }))}
        />
      </div>

      <section className="border-t border-ink-100 bg-cream-50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="font-display text-2xl md:text-3xl text-ink-900 text-center">
            Nasıl çalışıyor?
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="size-11 grid place-items-center rounded-full bg-white text-brand-600 border border-brand-100">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-display text-3xl text-ink-200">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-ink-900">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="font-display text-2xl text-ink-900 mb-6">
          Kendi buketini yaparken merak edilenler
        </h2>
        <div className="space-y-3">
          <Faq
            q="Seçtiğim buket birebir aynı mı geliyor?"
            a="Ekrandaki önizleme buketinizin kompozisyonunu ve renk dengesini gösterir. Çiçekçilerimiz seçtiğiniz çiçek türlerini ve adetlerini birebir kullanarak buketi elde hazırlar; doğal ürün olduğu için her dalın duruşu kendine özgüdür."
          />
          <Faq
            q="En az kaç dal seçmeliyim?"
            a={`Buketin dolgun durması için en az ${MIN_STEMS} dal seçmeniz gerekir. Daha büyük aranjmanlar için bizi arayabilirsiniz.`}
          />
          <Faq
            q="Fiyat neye göre hesaplanıyor?"
            a="Seçtiğiniz her dalın fiyatı, ambalaj ücreti ve eklediğiniz ekstralar toplanarak anında hesaplanır. Ödeme adımında ek bir ücret çıkmaz."
          />
          <Faq
            q="Aynı gün teslim edilir mi?"
            a="İzmir içi siparişlerde evet. Sipariş adımında uygun teslimat saat aralığını seçmeniz yeterli."
          />
        </div>
        <p className="mt-8 text-sm text-ink-600">
          Hazır buketlere göz atmak isterseniz{" "}
          <Link href="/kategori/buketler" className="text-brand-600 underline underline-offset-4">
            buket koleksiyonumuzu
          </Link>{" "}
          inceleyebilirsiniz.
        </p>
      </section>
    </>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-ink-100 rounded-2xl px-5 py-4 bg-white hover:border-ink-300 transition-colors">
      <summary className="cursor-pointer font-semibold text-ink-900 list-none flex justify-between items-center gap-4">
        {q}
        <span className="text-brand-600 text-xl group-open:rotate-45 transition-transform">
          +
        </span>
      </summary>
      <p className="mt-3 text-ink-600 leading-relaxed">{a}</p>
    </details>
  );
}
