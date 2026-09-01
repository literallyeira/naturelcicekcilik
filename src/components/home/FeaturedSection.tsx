import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ProductCard,
  type ProductCardData,
} from "@/components/product/ProductCard";

export function FeaturedSection({
  eyebrow,
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: ProductCardData[];
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-end justify-between mb-10 gap-6">
        <div>
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600 mb-3">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-3xl md:text-4xl text-ink-900">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm text-ink-500 mt-2">{subtitle}</p>
          ) : null}
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-ink-900 border-b border-ink-300 pb-1 hover:text-brand-600 hover:border-brand-400 transition-colors shrink-0"
          >
            Tümünü Gör <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>
      {viewAllHref ? (
        <div className="sm:hidden mt-8 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-ink-200 text-sm font-semibold text-ink-900"
          >
            Tümünü Gör <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
