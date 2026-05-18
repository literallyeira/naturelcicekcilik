import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "../ProductForm";

type Params = Promise<{ id: string }>;

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: Number(id) },
      include: { categories: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-black text-ink-900">Ürünü Düzenle</h1>
      </header>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price.toString(),
          image: product.image,
          description: product.description,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          categoryIds: product.categories.map((pc) => pc.categoryId),
        }}
      />
    </div>
  );
}
