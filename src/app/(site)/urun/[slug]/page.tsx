import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Truck, ShieldCheck, Clock, Flower2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { CheckoutLauncher } from "@/components/product/CheckoutLauncher";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_NAME,
  SITE_URL,
  breadcrumbJsonLd,
  pageMetadata,
} from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const revalidate = 300;

async function loadProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { categories: { include: { category: true } } },
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

  const category = p.categories[0]?.category.name;
  const description =
    p.description?.replace(/\s+/g, " ").trim().slice(0, 155) ??
    `${p.name} — İzmir'e aynı gün teslimat. ${category ? `${category} kategorisinde ` : ""}taze çiçek siparişi, güvenli ödeme.`;

  return pageMetadata({
    title: p.name,
    description,
    path: `/urun/${p.slug}`,
    image: p.image,
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const category = product.categories[0]?.category;

  const [activeHours, related] = await Promise.all([
    prisma.deliveryHour
      .findMany({ where: { isActive: true }, orderBy: { id: "asc" } })
      .catch(() => []),
    category
      ? prisma.product
          .findMany({
            where: {
              isActive: true,
              id: { not: product.id },
              categories: { some: { categoryId: category.id } },
            },
            orderBy: { isFeatured: "desc" },
            take: 4,
          })
          .catch(() => [])
      : Promise.resolve([]),
  ]);

  const price = Number(product.price);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: product.image ? [`${SITE_URL}${product.image}`] : undefined,
          description:
            product.description?.replace(/\s+/g, " ").trim() ??
            `${product.name} — İzmir'e aynı gün çiçek teslimatı.`,
          sku: `NTRL-${product.id}`,
          category: category?.name,
          brand: { "@type": "Brand", name: SITE_NAME },
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/urun/${product.slug}`,
            priceCurrency: "TRY",
            price: price.toFixed(2),
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "Organization", name: SITE_NAME },
            areaServed: { "@type": "City", name: "İzmir" },
          },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Anasayfa", path: "/" },
            ...(category
              ? [{ name: category.name, path: `/kategori/${category.slug}` }]
              : []),
            { name: product.name, path: `/urun/${product.slug}` },
          ],
        )}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="text-sm text-ink-500 mb-8">
          <Link href="/" className="hover:text-ink-900">
            Anasayfa
          </Link>
          <span className="mx-2">/</span>
          {category ? (
            <>
              <Link
                href={`/kategori/${category.slug}`}
                className="hover:text-ink-900"
              >
                {category.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          ) : null}
          <span className="text-ink-900">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative aspect-square bg-cream-50 rounded-3xl overflow-hidden border border-ink-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={`${product.name} — İzmir çiçek siparişi`}
                fill
                sizes="(max-width:768px) 100vw, 600px"
                className="object-cover"
                priority
              />
            ) : null}
          </div>

          <div className="md:py-4">
            <div className="flex flex-wrap gap-3 mb-4">
              {product.categories.map(({ category: c }) => (
                <Link
                  key={c.id}
                  href={`/kategori/${c.slug}`}
                  className="text-[11px] uppercase tracking-[0.14em] text-brand-600 hover:text-brand-700 font-semibold"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <h1 className="font-display text-3xl md:text-[2.6rem] leading-[1.12] text-ink-900">
              {product.name}
            </h1>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl text-ink-900">
                {formatPrice(price)}
              </span>
              <span className="text-sm text-ink-500">KDV dahil</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <Perk icon={<Truck className="size-5" />} label="Aynı gün teslimat" />
              <Perk icon={<ShieldCheck className="size-5" />} label="Güvenli ödeme" />
              <Perk icon={<Clock className="size-5" />} label="7/24 destek" />
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

            <Link
              href="/buket-yap"
              className="mt-3 w-full h-12 rounded-full border border-ink-200 text-ink-900 font-semibold text-sm flex items-center justify-center gap-2 hover:border-brand-400 hover:text-brand-700 transition-colors"
            >
              <Flower2 className="size-4" />
              Bunun yerine kendi buketimi yapayım
            </Link>

            {product.description ? (
              <div className="mt-10 pt-8 border-t border-ink-100">
                <h2 className="font-display text-xl text-ink-900 mb-3">
                  Ürün Açıklaması
                </h2>
                <div className="content text-ink-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20">
            <h2 className="font-display text-2xl md:text-3xl text-ink-900 mb-8">
              Bunları da beğenebilirsiniz
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
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
          </section>
        ) : null}
      </div>
    </>
  );
}

function Perk({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-cream-50 p-3.5">
      <span className="grid place-items-center text-brand-600 mb-1.5">
        {icon}
      </span>
      <p className="text-[11px] text-ink-700 leading-tight">{label}</p>
    </div>
  );
}
