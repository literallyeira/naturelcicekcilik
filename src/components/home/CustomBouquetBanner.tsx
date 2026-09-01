import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";
import { BouquetPreview } from "@/components/bouquet/BouquetArt";
import { PRESETS } from "@/lib/bouquet";

const SHOWCASE = PRESETS[1];

export function CustomBouquetBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-cream-100 via-cream-50 to-brand-50">
        <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 border border-brand-200">
              <Flower2 className="size-3.5" /> İzmir&apos;de bir ilk
            </span>
            <h2 className="mt-5 font-display text-3xl md:text-[2.6rem] leading-[1.1] text-ink-900">
              Kendi buketini yap,
              <br />
              <span className="italic text-brand-600">fiyatını anında gör</span>
            </h2>
            <p className="mt-5 text-ink-600 leading-relaxed max-w-md">
              Gülünü, papatyanı, gerberanı tek tek seç; ambalajını belirle.
              Buketin ekranda oluşsun, tutarı canlı hesaplansın. Beğendiğin
              buketi aynı gün İzmir&apos;e gönderelim.
            </p>
            <Link
              href="/buket-yap"
              className="mt-8 inline-flex items-center gap-2 h-13 px-8 rounded-full bg-ink-900 text-white font-semibold text-[13px] uppercase tracking-[0.1em] hover:bg-brand-600 shadow-soft hover:shadow-lift transition-all"
            >
              Buketimi Tasarla <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <BouquetPreview
              selection={SHOWCASE.selection}
              wrapId={SHOWCASE.wrapId}
              className="w-full h-auto drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
