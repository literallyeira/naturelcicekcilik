import { prisma } from "@/lib/db";
import { CategoryManager } from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });
  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-black text-ink-900">Kategoriler</h1>
        <p className="text-ink-500 text-sm">{categories.length} kategori</p>
      </header>
      <CategoryManager
        initial={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          isActive: c.isActive,
        }))}
      />
    </div>
  );
}
