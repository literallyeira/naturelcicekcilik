import Link from "next/link";
import { ProductCard, type ProductCardData } from "@/components/product/ProductCard";

export function FeaturedSection({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  products: ProductCardData[];
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-ink-900">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm text-ink-500 mt-1">{subtitle}</p>
          ) : null}
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="hidden sm:inline-block text-sm font-semibold text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline"
          >
            Tümünü Gör →
          </Link>
        ) : null}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
