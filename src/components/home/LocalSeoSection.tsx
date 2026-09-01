import Link from "next/link";
import { DISTRICTS } from "@/lib/districts";

export function LocalSeoSection() {
  return (
    <section className="border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="font-display text-3xl text-ink-900">
          İzmir&apos;de çiçek siparişi
        </h2>
        <div className="content mt-5 text-ink-600 leading-relaxed">
          <p>
            Naturel Çiçekçilik, Bayraklı&apos;daki atölyesinden İzmir&apos;in
            tüm ilçelerine aynı gün çiçek teslimatı yapar. Her sabah halden
            seçtiğimiz taze çiçeklerle hazırlanan gül buketleri, mevsim
            aranjmanları, orkideler ve saksı çiçekleri; siparişinizi verdiğiniz
            gün, seçtiğiniz saat aralığında sevdiklerinize ulaşır.
          </p>
          <p>
            Doğum günü, yıldönümü, sevgililer günü ve anneler günü gibi özel
            günlerin yanında; açılış ve tören çelenkleri, gelin arabası
            süslemeleri ve taziye çiçekleri de hazırlıyoruz. Ne göndereceğinize
            karar veremediyseniz{" "}
            <Link href="/buket-yap" className="text-brand-600 underline underline-offset-4">
              kendi buketinizi tasarlayın
            </Link>
            : çiçekleri tek tek seçin, buketinizi ekranda görün, fiyatını anında
            hesaplayın.
          </p>

          <h3>Teslimat yaptığımız İzmir ilçeleri</h3>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {DISTRICTS.map((d) => (
            <Link
              key={d.slug}
              href={`/izmir-cicekci/${d.slug}`}
              className="rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-700 hover:border-brand-400 hover:text-brand-700 transition-colors"
            >
              {d.name} Çiçekçi
            </Link>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink-500 leading-relaxed">
          Listede olmayan bir adres için bizi arayın; İzmir genelinde teslimat
          seçeneklerimizi birlikte değerlendirelim.
        </p>
      </div>
    </section>
  );
}
