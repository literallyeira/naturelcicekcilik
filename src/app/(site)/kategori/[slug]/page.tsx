import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { prisma } from "@/lib/db";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const revalidate = 300;

async function loadCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { products: { include: { product: true } } },
  });
  if (!category || !category.isActive) return null;
  const products = category.products
    .filter((pc) => pc.product.isActive)
    .map((pc) => pc.product)
    .sort(
      (a, b) =>
        Number(b.isFeatured) - Number(a.isFeatured) ||
        b.createdAt.getTime() - a.createdAt.getTime(),
    );
  return { category, products };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadCategory(slug);
  if (!data) return { title: "Kategori bulunamadı" };

  const description =
    data.category.description?.replace(/\s+/g, " ").trim().slice(0, 155) ??
    `${data.category.name} — İzmir'e aynı gün teslimat. ${data.products.length} farklı seçenek, taze çiçekler, güvenli ödeme. Bayraklı, Karşıyaka, Bornova ve tüm İzmir.`;

  return pageMetadata({
    title: `${data.category.name} — İzmir Çiçek Siparişi`,
    description,
    path: `/kategori/${slug}`,
    image: data.products[0]?.image,
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await loadCategory(slug);
  if (!data) notFound();

  const { category, products } = data;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: category.name, path: `/kategori/${slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.name,
          url: `${SITE_URL}/kategori/${slug}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: products.length,
            itemListElement: products.slice(0, 24).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: `${SITE_URL}/urun/${p.slug ?? p.id}`,
            })),
          },
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="text-sm text-ink-500 mb-6">
          <Link href="/" className="hover:text-ink-900">
            Anasayfa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-900">{category.name}</span>
        </nav>

        <header className="mb-10 max-w-2xl">
          <h1 className="font-display text-4xl md:text-5xl text-ink-900 leading-tight">
            {category.name}
          </h1>
          {category.description ? (
            <p className="mt-4 text-ink-600 leading-relaxed">
              {category.description}
            </p>
          ) : (
            <p className="mt-4 text-ink-600 leading-relaxed">
              {category.name} kategorisindeki tüm ürünlerimiz her sabah taze
              seçilen çiçeklerle hazırlanır ve İzmir içinde aynı gün teslim
              edilir.
            </p>
          )}
          <p className="mt-3 text-sm text-ink-500">
            {products.length} ürün listeleniyor
          </p>
        </header>

        {products.length === 0 ? (
          <div className="py-20 text-center text-ink-500">
            Bu kategoride şu an ürün yok.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                priority={i < 4}
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
        )}

        <section className="mt-16 rounded-3xl border border-ink-100 bg-cream-50 p-8 text-center">
          <h2 className="font-display text-2xl text-ink-900">
            Aradığınızı bulamadınız mı?
          </h2>
          <p className="mt-3 text-ink-600 max-w-lg mx-auto">
            Çiçekleri tek tek seçerek kendi buketinizi tasarlayın, fiyatını
            anında görün.
          </p>
          <Link
            href="/buket-yap"
            className="mt-6 inline-flex items-center h-12 px-8 rounded-full bg-ink-900 text-white text-[13px] font-semibold uppercase tracking-[0.1em] hover:bg-brand-600 transition-colors"
          >
            Kendi Buketini Yap
          </Link>
        </section>
      </div>
    </>
  );
}
