import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().nullable().optional(),
  price: z.string(),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }
  const d = parsed.data;
  const slug = d.slug || `${slugify(d.name)}-${Date.now()}`;

  const product = await prisma.product.create({
    data: {
      name: d.name,
      slug,
      price: d.price,
      image: d.image ?? null,
      description: d.description ?? null,
      isActive: d.isActive ?? true,
      isFeatured: d.isFeatured ?? false,
      categories: d.categoryIds?.length
        ? {
            create: d.categoryIds.map((categoryId) => ({ categoryId })),
          }
        : undefined,
    },
  });
  return NextResponse.json({ ok: true, product });
}
