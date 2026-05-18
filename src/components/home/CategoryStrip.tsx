import Link from "next/link";
import Image from "next/image";

type Cat = {
  id: number;
  name: string;
  slug: string;
  sampleImage: string | null;
};

export function CategoryStrip({ categories }: { categories: Cat[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-ink-900">
          Kategorilerimiz
        </h2>
        <p className="text-sm text-ink-500 mt-2">
          Her özel an için doğru çiçeği bulun
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/kategori/${c.slug}`}
            className="group block text-center"
          >
            <div className="relative aspect-square rounded-full overflow-hidden bg-cream-100 mb-3 mx-auto max-w-[140px] group-hover:scale-105 transition-transform">
              {c.sampleImage ? (
                <Image
                  src={c.sampleImage}
                  alt={c.name}
                  fill
                  sizes="140px"
                  className="object-cover"
                />
              ) : (
                <div className="size-full bg-cream-200" />
              )}
            </div>
            <span className="text-sm font-medium text-ink-900 group-hover:text-brand-600">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
