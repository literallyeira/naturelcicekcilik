import { HeroSlider } from "@/components/home/HeroSlider";
import { ServicesStrip } from "@/components/home/ServicesStrip";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { prisma } from "@/lib/db";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 300;

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    description:
      "Bayraklı İzmir'de taze çiçek siparişi. Buketler, aranjmanlar, saksı çiçekleri, düğün ve gelin arabası süslemeleri. Aynı gün İzmir teslimat.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bayraklı",
      addressLocality: "İzmir",
      addressRegion: "İzmir",
      postalCode: "35535",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.4604,
      longitude: 27.1752,
    },
    telephone: "+90-555-555-55-55",
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: "₺₺",
    currenciesAccepted: "TRY",
    paymentAccepted: "Cash, Credit Card",
    areaServed: [
      { "@type": "City", name: "İzmir" },
      { "@type": "AdministrativeArea", name: "Bayraklı" },
      { "@type": "AdministrativeArea", name: "Karşıyaka" },
      { "@type": "AdministrativeArea", name: "Bornova" },
      { "@type": "AdministrativeArea", name: "Konak" },
    ],
    hasMap: "https://maps.google.com/?q=Bayraklı+İzmir+çiçekçi",
    sameAs: [SITE_URL],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSlider />
      <ServicesStrip />
      <CategoryStrip categories={categories} />
      <FeaturedSection
        title="Çok Satanlar"
        subtitle="En çok tercih edilen çiçeklerimiz"
        products={featured}
        viewAllHref="/kategori/buketler"
      />
      <FeaturedSection
        title="Yeni Gelenler"
        subtitle="Koleksiyonumuza yeni eklenenler"
        products={newest}
      />
      <ReviewsSection />
    </>
  );
}
