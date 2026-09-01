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
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
          Koleksiyonlar
        </p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl text-ink-900">
          Her özel an için doğru çiçek
        </h2>
        <p className="text-sm text-ink-500 mt-3 max-w-lg mx-auto">
          Doğum günü, yıldönümü, açılış, taziye ya da sadece &quot;seni
          düşündüm&quot; demek için.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/kategori/${c.slug}`}
            className="group block text-center"
          >
            <div className="relative aspect-square rounded-full overflow-hidden bg-cream-100 mb-3.5 mx-auto max-w-[140px] ring-1 ring-ink-100 group-hover:ring-brand-300 transition-all">
              {c.sampleImage ? (
                <Image
                  src={c.sampleImage}
                  alt={`${c.name} — İzmir çiçek siparişi`}
                  fill
                  sizes="140px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="size-full bg-cream-200" />
              )}
            </div>
            <span className="text-[13px] font-medium text-ink-800 group-hover:text-brand-600 transition-colors">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
