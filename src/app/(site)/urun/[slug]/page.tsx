import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Truck, ShieldCheck, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { CheckoutLauncher } from "@/components/product/CheckoutLauncher";

type Params = Promise<{ slug: string }>;

export const revalidate = 300;

async function loadProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });
  if (!product || !product.isActive) return null;
  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await loadProduct(slug);
  if (!p) return { title: "Ürün bulunamadı" };
  return {
    title: p.name,
    description: p.description?.slice(0, 160) ?? p.name,
    openGraph: {
      images: p.image ? [{ url: p.image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const activeHours = await prisma.deliveryHour.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  const breadcrumbCategory = product.categories[0]?.category;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <nav className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-ink-900">
          Anasayfa
        </Link>
        <span className="mx-2">/</span>
        {breadcrumbCategory ? (
          <>
            <Link
              href={`/kategori/${breadcrumbCategory.slug}`}
              className="hover:text-ink-900"
            >
              {breadcrumbCategory.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        ) : null}
        <span className="text-ink-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-square bg-cream-50 rounded-xl overflow-hidden border border-ink-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width:768px) 100vw, 600px"
              className="object-cover"
              priority
            />
          ) : null}
        </div>

        <div>
          <div className="flex gap-2 mb-3">
            {product.categories.map(({ category }) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="text-xs uppercase tracking-wider text-brand-600 hover:text-brand-700 font-semibold"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-ink-900">
            {product.name}
          </h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-brand-600">
              {formatPrice(product.price.toString())}
            </span>
            <span className="text-sm text-ink-500">KDV dahil</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="border border-ink-100 rounded-lg p-3">
              <Truck className="size-5 mx-auto text-brand-600 mb-1" />
              <p className="text-xs text-ink-700">Aynı gün teslimat</p>
            </div>
            <div className="border border-ink-100 rounded-lg p-3">
              <ShieldCheck className="size-5 mx-auto text-brand-600 mb-1" />
              <p className="text-xs text-ink-700">Güvenli ödeme</p>
            </div>
            <div className="border border-ink-100 rounded-lg p-3">
              <Clock className="size-5 mx-auto text-brand-600 mb-1" />
              <p className="text-xs text-ink-700">7/24 destek</p>
            </div>
          </div>

          <CheckoutLauncher
            product={{
              id: product.id,
              name: product.name,
              price: product.price.toString(),
              image: product.image,
            }}
            deliveryHours={activeHours.map((h) => ({
              id: h.id,
              timeSlot: h.timeSlot,
            }))}
          />
        </div>
      </div>

      {product.description ? (
        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-bold text-ink-900 mb-4">
            Ürün Açıklaması
          </h2>
          <div className="content text-ink-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </section>
      ) : null}
    </div>
  );
}
