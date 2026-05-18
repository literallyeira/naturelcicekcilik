import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { categories: { include: { category: true } } },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Ürünler</h1>
          <p className="text-ink-500 text-sm">{products.length} ürün</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600"
        >
          <Plus className="size-4" /> Yeni Ürün
        </Link>
      </header>

      <div className="bg-white border border-ink-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-50 text-ink-500 uppercase text-xs">
            <tr>
              <th className="text-left p-3">Görsel</th>
              <th className="text-left p-3">Ad</th>
              <th className="text-left p-3">Kategoriler</th>
              <th className="text-left p-3">Fiyat</th>
              <th className="text-left p-3">Aktif</th>
              <th className="text-left p-3">Öne Çıkan</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-ink-100">
                <td className="p-3">
                  {p.image ? (
                    <div className="relative size-12 rounded-lg overflow-hidden bg-cream-50">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="size-12 rounded-lg bg-ink-100" />
                  )}
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-ink-500 text-xs">
                  {p.categories.map((pc) => pc.category.name).join(", ") ||
                    "—"}
                </td>
                <td className="p-3 font-semibold">
                  {formatPrice(p.price.toString())}
                </td>
                <td className="p-3">
                  {p.isActive ? (
                    <span className="text-emerald-700">Aktif</span>
                  ) : (
                    <span className="text-ink-500">Pasif</span>
                  )}
                </td>
                <td className="p-3">{p.isFeatured ? "★" : ""}</td>
                <td className="p-3">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-brand-600 hover:underline text-xs font-semibold"
                  >
                    Düzenle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
