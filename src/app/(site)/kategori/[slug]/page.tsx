import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { prisma } from "@/lib/db";

type Params = Promise<{ slug: string }>;

export const revalidate = 300;

async function loadCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
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
  return {
    title: data.category.name,
    description:
      data.category.description ??
      `${data.category.name} kategorisindeki tüm çiçek ürünlerimiz.`,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await loadCategory(slug);
  if (!data) notFound();

  const { category, products } = data;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <nav className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-ink-900">
          Anasayfa
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{category.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-ink-900">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-2 text-ink-500 max-w-2xl">{category.description}</p>
        ) : null}
        <p className="mt-2 text-sm text-ink-500">
          {products.length} ürün listeleniyor
        </p>
      </header>

      {products.length === 0 ? (
        <div className="py-20 text-center text-ink-500">
          Bu kategoride şu an ürün yok.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
      )}
    </div>
  );
}
