import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DISTRICTS } from "@/lib/districts";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "İzmir Çiçekçi — Tüm İlçelere Teslimat",
  description:
    "Bayraklı, Karşıyaka, Bornova, Konak, Çiğli, Buca ve tüm İzmir ilçelerine aynı gün taze çiçek teslimatı. İlçenizi seçin, teslimat sürelerini görün.",
  path: "/izmir-cicekci",
});

export default function DistrictIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "İzmir Çiçekçi", path: "/izmir-cicekci" },
        ])}
      />
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="font-display text-4xl md:text-5xl text-ink-900">
          İzmir Çiçekçi
        </h1>
        <p className="mt-4 text-ink-600 max-w-2xl leading-relaxed">
          Bayraklı&apos;daki atölyemizden İzmir&apos;in tüm ilçelerine taze çiçek
          gönderiyoruz. İlçenizi seçin; teslimat sürelerini, kapsadığımız
          mahalleleri ve en çok tercih edilen buketleri görün.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {DISTRICTS.map((d) => (
            <Link
              key={d.slug}
              href={`/izmir-cicekci/${d.slug}`}
              className="group rounded-2xl border border-ink-100 p-5 hover:border-brand-300 hover:shadow-soft transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl text-ink-900">
                  {d.name} Çiçekçi
                </h2>
                <ArrowRight className="size-4 text-ink-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">
                {d.intro}
              </p>
              <p className="mt-3 text-xs text-brand-700 font-semibold">
                Teslimat: {d.eta}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
