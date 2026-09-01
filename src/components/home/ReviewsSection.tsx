"use client";

import { useRef, useState } from "react";

const REVIEWS = [
  {
    name: "Ayşe K.",
    rating: 5,
    date: "1 ay önce",
    text: "Çiçekler çok tazeydi, paketleme harikaydı. Kız kardeşimin doğum günü için sipariş verdim, zamanında ve eksiksiz teslim edildi. Kesinlikle tavsiye ederim!",
    initials: "AK",
  },
  {
    name: "Mehmet Y.",
    rating: 5,
    date: "2 ay önce",
    text: "Bayraklı'da bu kadar güzel bir çiçekçi bulmak zor. Anneme yolladım, çiçekler muhteşemdi ve çok hızlı geldi. Teşekkürler!",
    initials: "MY",
  },
  {
    name: "Selin D.",
    rating: 5,
    date: "3 ay önce",
    text: "Düğünümüz için gelin arabası süslemesi yaptırdık. Tam hayalimizde canlandırdığımız gibiydi. Profesyonel ve kaliteli hizmet.",
    initials: "SD",
  },
  {
    name: "Hasan T.",
    rating: 5,
    date: "3 ay önce",
    text: "Sevgililer Günü'nde siparişimi son dakika verdim, yine de saat gelmeden teslim ettiler. Güller çok tazeydi. Harika bir deneyimdi.",
    initials: "HT",
  },
  {
    name: "Fatma Ş.",
    rating: 5,
    date: "4 ay önce",
    text: "Fiyat performans olarak çok memnun kaldım. Ürünler fotoğraftaki gibi hatta daha güzel geldi. Bir dahaki sefere de buradan alacağım.",
    initials: "FŞ",
  },
  {
    name: "Bülent A.",
    rating: 4,
    date: "5 ay önce",
    text: "Hızlı teslimat, güzel çiçekler. İzmir içi sipariş için en iyi seçenek.",
    initials: "BA",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`size-4 ${i < count ? "text-amber-400" : "text-ink-200"}`}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  function onMouseDown(e: React.MouseEvent) {
    setIsDragging(true);
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  }
  function stopDrag() { setIsDragging(false); }

  return (
    <section className="py-16 bg-cream-50 border-y border-ink-100">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600 mb-3">
              Müşterilerimiz
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-ink-900">
              İzmir bize güveniyor
            </h2>
            <div className="flex items-center gap-2 mt-3">
              <Stars count={5} />
              <span className="text-sm text-ink-500 font-medium">
                Müşterilerimizin yorumlarından
              </span>
            </div>
          </div>
          <a
            href="https://www.google.com/search?q=Naturel+Çiçekçilik+Bayraklı+İzmir+yorumlar"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline"
          >
            Tüm yorumları gör
          </a>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none no-scrollbar"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="shrink-0 w-72 rounded-2xl border border-ink-100 bg-white p-5 space-y-3 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-brand-100 text-brand-700 font-bold text-sm grid place-items-center shrink-0">
                  {r.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm text-ink-900">{r.name}</p>
                  <p className="text-xs text-ink-400">{r.date}</p>
                </div>
                <svg viewBox="0 0 24 24" className="size-5 ml-auto shrink-0" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <Stars count={r.rating} />
              <p className="text-sm text-ink-600 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
