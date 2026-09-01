"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Flower2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Slide = {
  badge: string;
  title: string;
  accent: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  from: string;
  to: string;
};

const SLIDES: Slide[] = [
  {
    badge: "Aynı Gün İzmir Teslimat",
    title: "Bugün sipariş verin,",
    accent: "bugün kapıda olsun",
    subtitle:
      "Bayraklı'daki atölyemizde her sabah tazelenen çiçeklerle hazırlanan buketler, İzmir'in her ilçesine aynı gün teslim.",
    ctaText: "Buketleri Keşfet",
    ctaHref: "/kategori/buketler",
    image: "/products/kelebek-buketi-1763418880.png",
    from: "#f8f1e8",
    to: "#ffffff",
  },
  {
    badge: "Düğün & Açılış",
    title: "Özel günlerinize",
    accent: "zarafet katın",
    subtitle:
      "Gelin arabası süslemeleri, tören çelenkleri ve açılış aranjmanları — kurumsal özenle hazırlanır.",
    ctaText: "Koleksiyonu Gör",
    ctaHref: "/kategori/dugun-ve-acilis-cicekleri",
    image: "/products/hayallerinizdeki-gelin-arabasi-suslemesi-1763419327.png",
    from: "#f2f7f3",
    to: "#ffffff",
  },
  {
    badge: "Yeni Sezon",
    title: "Yaşayan yeşil,",
    accent: "uzun ömürlü hediye",
    subtitle:
      "Orkideler, sukulentler ve saksı çiçekleri ile ev ve ofisinize kalıcı bir canlılık.",
    ctaText: "Saksı Çiçeklerini Gör",
    ctaHref: "/kategori/saksi-cicekleri",
    image: "/products/antoryum-1764108656.webp",
    from: "#fdfaf6",
    to: "#ffffff",
  },
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    const id = setInterval(() => emblaApi.scrollNext(), 7000);
    return () => {
      clearInterval(id);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative group/hero">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {SLIDES.map((s, i) => (
            <div className="embla__slide" key={i}>
              <div
                className="w-full"
                style={{
                  background: `linear-gradient(160deg, ${s.from} 0%, ${s.to} 62%)`,
                }}
              >
                <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-10 items-center min-h-[520px] py-14">
                  <div className="order-2 md:order-1">
                    <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">
                      {s.badge}
                    </p>
                    <h1 className="mt-5 font-display text-[2.6rem] leading-[1.06] md:text-[3.75rem] text-ink-900">
                      {s.title}
                      <br />
                      <span className="italic text-brand-600">{s.accent}</span>
                    </h1>
                    <p className="mt-6 text-[15px] md:text-base text-ink-600 max-w-md leading-relaxed">
                      {s.subtitle}
                    </p>
                    <div className="mt-9 flex flex-wrap items-center gap-3">
                      <Link
                        href={s.ctaHref}
                        className="inline-flex items-center h-12 px-8 rounded-full bg-ink-900 text-white font-semibold text-[13px] uppercase tracking-[0.1em] hover:bg-brand-600 shadow-soft hover:shadow-lift transition-all"
                      >
                        {s.ctaText}
                      </Link>
                      <Link
                        href="/buket-yap"
                        className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-ink-200 bg-white/80 text-ink-900 font-semibold text-[13px] hover:border-brand-400 hover:text-brand-700 transition-colors"
                      >
                        <Flower2 className="size-4" />
                        Kendi Buketini Yap
                      </Link>
                    </div>
                    <p className="mt-6 text-xs text-ink-500 tracking-wide">
                      7/24 sipariş · Güvenli ödeme · İzmir&apos;in tüm ilçelerine
                      teslimat
                    </p>
                  </div>

                  <div className="order-1 md:order-2 relative aspect-square max-w-[420px] mx-auto w-full p-[5%]">
                    <div className="absolute inset-0 rounded-full border border-gold-300/60" />
                    <div className="relative size-full rounded-full overflow-hidden bg-white shadow-lift">
                      <Image
                        src={s.image}
                        alt={`${s.title} ${s.accent} — İzmir çiçek siparişi`}
                        fill
                        sizes="(max-width:768px) 84vw, 400px"
                        className="object-cover"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Önceki slayt"
        className="absolute left-4 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/80 hover:bg-white text-ink-700 grid place-items-center backdrop-blur shadow-soft opacity-0 group-hover/hero:opacity-100 focus-visible:opacity-100 transition-opacity"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Sonraki slayt"
        className="absolute right-4 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/80 hover:bg-white text-ink-700 grid place-items-center backdrop-blur shadow-soft opacity-0 group-hover/hero:opacity-100 focus-visible:opacity-100 transition-opacity"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Slayt ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === selected
                ? "w-8 bg-brand-600"
                : "w-2 bg-ink-900/25 hover:bg-ink-900/50",
            )}
          />
        ))}
      </div>
    </section>
  );
}
