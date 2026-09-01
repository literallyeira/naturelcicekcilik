import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ADDRESS, PHONE_HREF, PHONE_INTL_DISPLAY } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Hakkımızda — Bayraklı'nın Çiçekçisi",
  description:
    "Naturel Çiçekçilik, Bayraklı'daki atölyesinden İzmir'in tüm ilçelerine her sabah tazelenen çiçeklerle hazırlanan buketler gönderen bir aile işletmesidir.",
  path: "/hakkimizda",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Hakkımızda", path: "/hakkimizda" },
        ])}
      />
      <div className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
          {ADDRESS.district}, {ADDRESS.city}
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-ink-900 mb-6 leading-tight">
          Çiçek bir hediye değil,
          <br />
          <span className="italic text-brand-600">bir cümledir</span>
        </h1>
        <div className="content text-ink-600 leading-relaxed space-y-4">
          <p>
            Naturel Çiçekçilik, İzmir&apos;de yıllardır taze ve özenle
            hazırlanmış çiçekleri sevdiklerinize ulaştıran bir aile
            işletmesidir. Bayraklı&apos;daki atölyemizde her buketi ve
            aranjmanı ustalarımızın elinden geçirerek hazırlıyoruz.
          </p>
          <h2>Misyonumuz</h2>
          <p>
            Sevdiklerinize duyduğunuz duyguları en doğal ve etkileyici şekilde
            ifade etmenize yardımcı olmak. Her çiçeğin bir hikâyesi olduğuna
            inanıyor, doğru çiçeği doğru anla buluşturmanın peşinden gidiyoruz.
          </p>
          <h2>Neden Naturel?</h2>
          <ul>
            <li>Aynı gün İzmir içi teslimat, seçtiğiniz saat aralığında</li>
            <li>Her sabah halden seçilen, doğrudan üreticiden gelen çiçek</li>
            <li>7/24 sipariş hattı</li>
            <li>Mevsimsel ve özel tasarım koleksiyonlar</li>
            <li>Düğün, açılış ve taziye organizasyonlarında profesyonel hizmet</li>
            <li>
              İzmir&apos;de tek: çiçeği tek tek seçip kendi buketinizi
              tasarlayabileceğiniz online atölye
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/buket-yap"
            className="inline-flex items-center h-12 px-7 rounded-full bg-ink-900 text-white text-[13px] font-semibold uppercase tracking-[0.1em] hover:bg-brand-600 transition-colors"
          >
            Kendi Buketini Yap
          </Link>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center h-12 px-7 rounded-full border border-ink-200 text-[13px] font-semibold text-ink-900 hover:border-brand-400 hover:text-brand-700 transition-colors"
          >
            {PHONE_INTL_DISPLAY}
          </a>
        </div>
      </div>
    </>
  );
}
