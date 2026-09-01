import Link from "next/link";
import { Search, Phone, Flower2, ClipboardList, Menu, User } from "lucide-react";
import { prisma } from "@/lib/db";
import { CategoryDrawer } from "./CategoryDrawer";
import { PHONE_HREF, PHONE_INTL_DISPLAY } from "@/lib/site";

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    });
  } catch {
    return [];
  }
}

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className={`font-display text-[26px] italic ${dark ? "text-white" : "text-ink-900"}`}
      >
        Naturel
      </span>
      <span
        className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${
          dark ? "text-brand-300" : "text-brand-600"
        }`}
      >
        Çiçekçilik
      </span>
    </span>
  );
}

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ink-100">
      {/* Üst şerit */}
      <div className="hidden md:block bg-ink-900 text-[12px] text-ink-200">
        <div className="mx-auto max-w-7xl px-6 flex h-9 items-center justify-between">
          <span className="tracking-wide">
            İzmir içi <strong className="text-white font-semibold">aynı gün teslimat</strong>
            {" · "}500₺ üzeri kargo ücretsiz
          </span>
          <div className="flex items-center gap-4">
            <Link href="/siparis-takip" className="hover:text-white transition-colors">
              Sipariş Takip
            </Link>
            <span className="text-ink-600">|</span>
            <a
              href={PHONE_HREF}
              className="flex items-center gap-1.5 text-white font-semibold"
            >
              <Phone className="size-3.5" /> {PHONE_INTL_DISPLAY}
            </a>
          </div>
        </div>
      </div>

      {/* Ana satır */}
      <div className="mx-auto max-w-7xl px-6 flex h-[72px] items-center gap-6">
        <Link href="/" className="shrink-0" aria-label="Naturel Çiçekçilik anasayfa">
          <Wordmark />
        </Link>

        <form
          action="/arama"
          className="hidden md:flex flex-1 max-w-xl mx-auto h-11 rounded-full border border-ink-200 overflow-hidden bg-cream-50 focus-within:border-brand-500 focus-within:bg-white transition-colors"
        >
          <input
            name="q"
            placeholder="Gül buketi, orkide, aranjman ara..."
            aria-label="Ürün ara"
            className="flex-1 px-5 outline-none text-sm bg-transparent"
          />
          <button
            type="submit"
            className="px-5 text-ink-600 hover:text-brand-600 transition-colors"
            aria-label="Ara"
          >
            <Search className="size-[18px]" />
          </button>
        </form>

        <div className="flex items-center gap-1 ml-auto">
          <Link
            href="/buket-yap"
            className="hidden sm:inline-flex items-center gap-2 h-10 pl-3.5 pr-4 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-[13px] font-semibold hover:bg-brand-100 transition-colors"
          >
            <Flower2 className="size-4" />
            Kendi Buketini Yap
          </Link>
          <Link
            href="/siparis-takip"
            aria-label="Sipariş takibi"
            className="size-10 grid place-items-center rounded-full hover:bg-cream-100 text-ink-700 transition-colors"
          >
            <ClipboardList className="size-5" />
          </Link>
          <Link
            href="/admin"
            aria-label="Yönetim"
            className="hidden sm:grid size-10 place-items-center rounded-full hover:bg-cream-100 text-ink-700 transition-colors"
          >
            <User className="size-5" />
          </Link>
        </div>
      </div>

      {/* Mobil arama */}
      <form action="/arama" className="md:hidden px-6 pb-3">
        <div className="flex h-10 rounded-full border border-ink-200 bg-cream-50 overflow-hidden">
          <input
            name="q"
            placeholder="Çiçek ara..."
            aria-label="Ürün ara"
            className="flex-1 px-4 outline-none text-sm bg-transparent"
          />
          <button type="submit" className="px-4 text-ink-600" aria-label="Ara">
            <Search className="size-4" />
          </button>
        </div>
      </form>

      {/* Kategori satırı */}
      <div className="border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-6 flex h-11 items-center gap-6">
          <CategoryDrawer categories={categories}>
            <button className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-900 hover:text-brand-600 transition-colors">
              <Menu className="size-4" />
              Kategoriler
            </button>
          </CategoryDrawer>

          <div className="hidden lg:block w-px h-4 bg-ink-200" />

          <nav className="hidden md:flex items-center gap-5 text-[12px] font-medium uppercase tracking-[0.08em] text-ink-600 overflow-x-auto no-scrollbar">
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/kategori/${c.slug}`}
                className="shrink-0 hover:text-brand-600 transition-colors"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/hakkimizda"
              className="shrink-0 hover:text-brand-600 transition-colors"
            >
              Hakkımızda
            </Link>
            <Link
              href="/iletisim"
              className="shrink-0 hover:text-brand-600 transition-colors"
            >
              İletişim
            </Link>
          </nav>

          <a
            href={PHONE_HREF}
            className="ml-auto hidden lg:flex items-center gap-2 text-[13px]"
          >
            <span className="text-ink-500">7/24 Sipariş:</span>
            <span className="font-semibold text-brand-600">
              {PHONE_INTL_DISPLAY}
            </span>
          </a>
          <Link
            href="/buket-yap"
            className="sm:hidden ml-auto text-[12px] font-semibold text-brand-600"
          >
            Kendi Buketini Yap →
          </Link>
        </div>
      </div>
    </header>
  );
}
