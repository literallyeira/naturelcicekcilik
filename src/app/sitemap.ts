import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";
import { DISTRICTS } from "@/lib/districts";

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

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, freq: "daily" as const },
    { path: "/buket-yap", priority: 0.9, freq: "weekly" as const },
    { path: "/izmir-cicekci", priority: 0.8, freq: "weekly" as const },
    { path: "/hakkimizda", priority: 0.5, freq: "monthly" as const },
    { path: "/iletisim", priority: 0.6, freq: "monthly" as const },
    { path: "/sss", priority: 0.5, freq: "monthly" as const },
    { path: "/teslimat-bilgileri", priority: 0.5, freq: "monthly" as const },
    { path: "/mesafeli-satis-sozlesmesi", priority: 0.3, freq: "yearly" as const },
    { path: "/iptal-iade", priority: 0.3, freq: "yearly" as const },
    { path: "/siparis-takip", priority: 0.4, freq: "monthly" as const },
  ].map(({ path, priority, freq }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));

  return [
    ...staticRoutes,
    ...DISTRICTS.map((d) => ({
      url: `${SITE_URL}/izmir-cicekci/${d.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
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
