import Link from "next/link";
import { Search, Phone, User, Heart, ClipboardList, Menu } from "lucide-react";
import { prisma } from "@/lib/db";
import { CategoryDrawer } from "./CategoryDrawer";

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

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Top utility bar */}
      <div className="hidden md:block border-b border-ink-100 text-[12px] text-ink-500">
        <div className="mx-auto max-w-7xl px-6 flex h-9 items-center justify-between">
          <span>
            Ücretsiz Teslimat: 500₺ üzeri siparişlerde İzmir içi kargo
            ücretsiz.
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/siparis-takip"
              className="hover:text-ink-900 transition-colors"
            >
              Sipariş Takip
            </Link>
            <span className="text-ink-300">|</span>
            <a
              href="tel:+905555555555"
              className="flex items-center gap-1.5 hover:text-ink-900"
            >
              <Phone className="size-3.5" /> +90 555 555 55 55
            </a>
          </div>
        </div>
      </div>

      {/* Main header — logo + search + actions */}
      <div className="border-b border-ink-100">
        <div className="mx-auto max-w-7xl px-6 flex h-20 items-center gap-6">
          <Link href="/" className="shrink-0 flex flex-col leading-none">
            <span
              className="text-[22px] font-medium tracking-wide text-ink-900"
              style={{ fontFamily: "var(--font-logo)", fontStyle: "italic" }}
            >
              Naturel
            </span>
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-500"
              style={{ fontFamily: "var(--font-logo)" }}
            >
              Çiçekçilik
            </span>
          </Link>

          <form
            action="/arama"
            className="hidden md:flex flex-1 max-w-2xl mx-auto h-12 rounded-full border border-ink-100 overflow-hidden bg-white focus-within:border-brand-500 transition-colors"
          >
            <div className="flex items-center pl-5 pr-3 text-sm text-ink-500 border-r border-ink-100">
              Tüm Kategoriler
            </div>
            <input
              name="q"
              placeholder="Ürün ara..."
              className="flex-1 px-4 outline-none text-sm bg-transparent"
            />
            <button
              type="submit"
              className="px-5 text-ink-700 hover:text-brand-600 transition-colors"
              aria-label="Ara"
            >
              <Search className="size-5" />
            </button>
          </form>

          <div className="flex items-center gap-1 ml-auto">
            <Link
              href="/admin"
              aria-label="Hesap"
              className="size-10 grid place-items-center rounded-full hover:bg-ink-100 text-ink-700"
            >
              <User className="size-5" />
            </Link>
            <Link
              href="/iletisim"
              aria-label="Favoriler"
              className="hidden sm:grid size-10 place-items-center rounded-full hover:bg-ink-100 text-ink-700"
            >
              <Heart className="size-5" />
            </Link>
            <Link
              href="/siparis-takip"
              aria-label="Siparişlerim"
              className="size-10 grid place-items-center rounded-full hover:bg-ink-100 text-ink-700"
            >
              <ClipboardList className="size-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Nav row */}
      <div className="border-b border-ink-100">
        <div className="mx-auto max-w-7xl px-6 flex h-12 items-center gap-6">
          <CategoryDrawer categories={categories}>
            <button className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-900 hover:text-brand-600 transition-colors">
              <Menu className="size-4" />
              Kategoriler
            </button>
          </CategoryDrawer>

          <div className="hidden lg:block w-px h-5 bg-ink-100" />

          <nav className="hidden md:flex items-center gap-5 text-[12px] font-semibold uppercase tracking-wide text-ink-700 overflow-x-auto">
            <Link
              href="/"
              className="shrink-0 border-b-2 border-transparent hover:border-ink-900 pb-1 text-ink-900"
            >
              Anasayfa
            </Link>
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                href={`/kategori/${c.slug}`}
                className="shrink-0 border-b-2 border-transparent hover:border-ink-900 pb-1"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/hakkimizda"
              className="shrink-0 border-b-2 border-transparent hover:border-ink-900 pb-1"
            >
              Hakkımızda
            </Link>
            <Link
              href="/iletisim"
              className="shrink-0 border-b-2 border-transparent hover:border-ink-900 pb-1"
            >
              İletişim
            </Link>
          </nav>

          <div className="ml-auto hidden lg:flex items-center gap-2 text-[13px]">
            <span className="text-ink-500">7/24 Sipariş:</span>
            <a
              href="tel:+905555555555"
              className="font-semibold text-brand-600"
            >
              (+90) 555 555 55 55
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
