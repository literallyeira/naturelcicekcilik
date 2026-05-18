"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Slide = {
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  bg: string;
};

const SLIDES: Slide[] = [
  {
    badge: "Aynı Gün Teslimat",
    title: "İzmir'in en taze çiçekleri",
    subtitle: "Sevdiklerinize özel buketler, aynı gün kapınızda.",
    ctaText: "Hemen Keşfet",
    ctaHref: "/kategori/buketler",
    image: "/products/kelebek-buketi-1763418880.png",
    bg: "bg-cream-100",
  },
  {
    badge: "Düğün & Açılış",
    title: "Özel günlere zarafet",
    subtitle: "Gelin arabası süslemeleri ve tören çelenkleri.",
    ctaText: "Koleksiyonu Gör",
    ctaHref: "/kategori/dugun-ve-acilis-cicekleri",
    image:
      "/products/hayallerinizdeki-gelin-arabasi-suslemesi-1763419327.png",
    bg: "bg-brand-50",
  },
  {
    badge: "Yeni Sezon",
    title: "Saksı çiçekleri",
    subtitle: "Eviniz ve ofisiniz için canlılık dolu seçenekler.",
    ctaText: "Şimdi Al",
    ctaHref: "/kategori/saksi-cicekleri",
    image: "/products/antoryum-1764108656.webp",
    bg: "bg-cream-50",
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
    onSelect();
    const id = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => {
      clearInterval(id);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {SLIDES.map((s, i) => (
            <div className="embla__slide" key={i}>
              <div className={cn("w-full", s.bg)}>
                <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-8 items-center min-h-[480px] py-12">
                  <div className="order-2 md:order-1">
                    <p className="text-sm font-medium text-brand-600 mb-3 tracking-wide uppercase">
                      {s.badge}
                    </p>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-ink-900">
                      {s.title}
                    </h1>
                    <p className="mt-5 text-base md:text-lg text-ink-700 max-w-md">
                      {s.subtitle}
                    </p>
                    <Link
                      href={s.ctaHref}
                      className="inline-flex items-center gap-2 mt-8 h-12 px-7 rounded-full bg-brand-500 text-white font-semibold text-sm uppercase tracking-wide hover:bg-brand-600 transition-colors"
                    >
                      {s.ctaText}
                    </Link>
                  </div>
                  <div className="order-1 md:order-2 relative aspect-square max-w-md mx-auto w-full">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width:768px) 90vw, 450px"
                      className="object-contain drop-shadow-xl"
                      priority={i === 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Önceki"
        className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/70 hover:bg-white text-ink-700 grid place-items-center backdrop-blur transition-colors shadow"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Sonraki"
        className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/70 hover:bg-white text-ink-700 grid place-items-center backdrop-blur transition-colors shadow"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Slayt ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === selected
                ? "w-7 bg-ink-900"
                : "w-2 bg-ink-900/40 hover:bg-ink-900/70",
            )}
          />
        ))}
      </div>
    </section>
  );
}
