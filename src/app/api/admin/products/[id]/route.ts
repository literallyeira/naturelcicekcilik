import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().nullable().optional(),
  price: z.string().optional(),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }
  const d = parsed.data;
  const productId = Number(id);

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: {
        name: d.name,
        slug: d.slug ?? undefined,
        price: d.price,
        image: d.image ?? undefined,
        description: d.description ?? undefined,
        isActive: d.isActive,
        isFeatured: d.isFeatured,
      },
    });
    if (d.categoryIds) {
      await tx.productCategory.deleteMany({ where: { productId } });
      if (d.categoryIds.length) {
        await tx.productCategory.createMany({
          data: d.categoryIds.map((categoryId) => ({
            productId,
            categoryId,
          })),
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
