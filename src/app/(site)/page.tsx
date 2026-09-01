import type { Metadata } from "next";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ServicesStrip } from "@/components/home/ServicesStrip";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { CustomBouquetBanner } from "@/components/home/CustomBouquetBanner";
import { LocalSeoSection } from "@/components/home/LocalSeoSection";
import { prisma } from "@/lib/db";
import { HOME_TITLE, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

type CategoryWithImage = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  products: { product: { image: string | null } }[];
};

async function loadHomepageData() {
  const [featured, newest, categories] = await Promise.all([
    prisma.product
      .findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      })
      .catch(() => [] as Awaited<ReturnType<typeof prisma.product.findMany>>),
    prisma.product
      .findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      })
      .catch(() => [] as Awaited<ReturnType<typeof prisma.product.findMany>>),
    prisma.category
      .findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
        include: {
          products: {
            take: 1,
            include: { product: { select: { image: true } } },
          },
        },
      })
      .catch(() => [] as CategoryWithImage[]),
  ]);

  return {
    featured: featured.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price.toString(),
      image: p.image,
      isFeatured: p.isFeatured,
    })),
    newest: newest.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price.toString(),
      image: p.image,
      isFeatured: p.isFeatured,
    })),
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      sampleImage: c.image ?? c.products[0]?.product.image ?? null,
    })),
  };
}

export default async function HomePage() {
  const { featured, newest, categories } = await loadHomepageData();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Çok satan çiçekler",
          itemListElement: featured.slice(0, 8).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            url: `${SITE_URL}/urun/${p.slug ?? p.id}`,
          })),
        }}
      />
      <HeroSlider />
      <ServicesStrip />
      <CategoryStrip categories={categories} />
      <FeaturedSection
        eyebrow="Öne Çıkanlar"
        title="Çok Satanlar"
        subtitle="İzmir'de en çok tercih edilen buket ve aranjmanlarımız"
        products={featured}
        viewAllHref="/kategori/buketler"
      />
      <CustomBouquetBanner />
      <FeaturedSection
        eyebrow="Koleksiyon"
        title="Yeni Gelenler"
        subtitle="Atölyemize bu hafta eklenen tasarımlar"
        products={newest}
      />
      <ReviewsSection />
      <LocalSeoSection />
    </>
  );
}
