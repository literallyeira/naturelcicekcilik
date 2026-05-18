import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";

export type ProductCardData = {
  id: number;
  name: string;
  slug: string | null;
  price: string | number;
  image: string | null;
  isFeatured?: boolean;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const href = product.slug
    ? `/urun/${product.slug}`
    : `/urun/${product.id}`;
  return (
    <Link
      href={href}
      className="group block bg-white border border-ink-100 rounded-lg overflow-hidden hover:border-brand-300 hover:shadow-md transition-all"
    >
      <div className="relative aspect-square bg-cream-50 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 280px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="size-full grid place-items-center text-ink-300 text-xs">
            Görsel yok
          </div>
        )}
        {product.isFeatured ? (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wide bg-brand-500 text-white px-2.5 py-1 rounded-full font-semibold">
            Öne çıkan
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-ink-900 line-clamp-2 min-h-[2.5em] group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-brand-600">
            {formatPrice(product.price)}
          </span>
          <span className="text-[11px] text-ink-500">KDV dahil</span>
        </div>
      </div>
    </Link>
  );
}
