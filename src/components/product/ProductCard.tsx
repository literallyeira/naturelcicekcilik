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

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData;
  priority?: boolean;
}) {
  const href = product.slug ? `/urun/${product.slug}` : `/urun/${product.id}`;
  return (
    <Link
      href={href}
      className="group block rounded-2xl overflow-hidden bg-white border border-ink-100 hover:border-brand-200 hover:shadow-lift transition-all duration-300"
    >
      <div className="relative aspect-square bg-cream-50 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.name} — İzmir çiçek siparişi`}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 300px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
            priority={priority}
          />
        ) : (
          <div className="size-full grid place-items-center text-ink-300 text-xs">
            Görsel yok
          </div>
        )}

        {product.isFeatured ? (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.12em] bg-white/95 backdrop-blur text-ink-900 px-3 py-1.5 rounded-full font-semibold shadow-soft">
            Çok satan
          </span>
        ) : null}

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="block text-center h-10 leading-10 rounded-full bg-ink-900/90 backdrop-blur text-white text-xs font-semibold uppercase tracking-[0.1em]">
            İncele
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm text-ink-800 line-clamp-2 min-h-[2.6em] leading-snug group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <span className="font-display text-xl text-ink-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-ink-400">
            KDV dahil
          </span>
        </div>
      </div>
    </Link>
  );
}
