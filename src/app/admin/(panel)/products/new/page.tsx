import { prisma } from "@/lib/db";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });
  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-black text-ink-900">Yeni Ürün</h1>
      </header>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
