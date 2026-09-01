import { Truck, ShieldCheck, Headphones, Sparkles } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Aynı Gün Teslimat",
    description: "İzmir'in tüm ilçelerine, seçtiğiniz saat aralığında.",
  },
  {
    icon: Sparkles,
    title: "Her Sabah Taze",
    description: "Çiçeklerimiz her gün halden taze olarak seçilir.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli Ödeme",
    description: "256-bit SSL ile korunan Shopier altyapısı.",
  },
  {
    icon: Headphones,
    title: "7/24 Destek",
    description: "Sipariş ve danışma için her an ulaşabilirsiniz.",
  },
];

export function ServicesStrip() {
  return (
    <section className="border-y border-ink-100 bg-cream-50">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="size-11 grid place-items-center rounded-full bg-white text-brand-600 border border-brand-100 shrink-0">
              <Icon className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900 text-[15px]">{title}</h3>
              <p className="text-sm text-ink-500 mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
