import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product
      .findMany({
        where: { isActive: true },
        select: { slug: true, createdAt: true },
      })
      .catch(() => [] as { slug: string | null; createdAt: Date }[]),
    prisma.category
      .findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => [] as { slug: string; updatedAt: Date }[]),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/hakkimizda",
    "/iletisim",
    "/sss",
    "/teslimat-bilgileri",
    "/mesafeli-satis-sozlesmesi",
    "/iptal-iade",
    "/siparis-takip",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.5,
  }));

  return [
    ...staticRoutes,
    ...categories.map((c) => ({
      url: `${SITE_URL}/kategori/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products
      .filter((p): p is { slug: string; createdAt: Date } => Boolean(p.slug))
      .map((p) => ({
        url: `${SITE_URL}/urun/${p.slug}`,
        lastModified: p.createdAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
  ];
}
