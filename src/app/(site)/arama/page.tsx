import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import { pageMetadata } from "@/lib/seo";

type SP = Promise<{ q?: string }>;

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Ürün Arama",
  description: "Naturel Çiçekçilik ürünleri arasında arama yapın.",
  path: "/arama",
  noIndex: true,
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const products =
    query.length >= 2
      ? await prisma.product
          .findMany({
            where: {
              isActive: true,
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            },
            orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
            take: 48,
          })
          .catch(() => [])
      : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-display text-3xl md:text-4xl text-ink-900">
        {query ? `"${query}" için sonuçlar` : "Ürün Ara"}
      </h1>

      <form action="/arama" className="mt-6 max-w-xl">
        <div className="flex h-12 rounded-full border border-ink-200 bg-cream-50 overflow-hidden focus-within:border-brand-500 focus-within:bg-white transition-colors">
          <input
            name="q"
            defaultValue={query}
            placeholder="Gül buketi, orkide, aranjman..."
            aria-label="Ürün ara"
            className="flex-1 px-5 outline-none text-sm bg-transparent"
          />
          <button
            type="submit"
            className="px-6 text-ink-700 hover:text-brand-600"
            aria-label="Ara"
          >
            <Search className="size-5" />
          </button>
        </div>
      </form>

      {query.length >= 2 ? (
        <p className="mt-6 text-sm text-ink-500">
          {products.length} ürün bulundu
        </p>
      ) : null}

      {products.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price.toString(),
                image: p.image,
                isFeatured: p.isFeatured,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-ink-100 bg-cream-50 p-8 text-center">
          <p className="text-ink-700">
            {query.length >= 2
              ? "Aradığınız ürünü bulamadık."
              : "Aramak için en az 2 karakter yazın."}
          </p>
          <p className="mt-2 text-sm text-ink-500">
            Dilerseniz{" "}
            <Link href="/buket-yap" className="text-brand-600 underline underline-offset-4">
              kendi buketinizi tasarlayabilirsiniz
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
