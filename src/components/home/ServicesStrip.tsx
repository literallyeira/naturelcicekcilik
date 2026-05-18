import { Truck, ShieldCheck, Headphones } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Aynı Gün Teslimat",
    description: "İzmir genelinde özenle taze çiçek teslimatı.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli Ödeme",
    description: "Shopier altyapısıyla 256-bit SSL güvenli ödeme.",
  },
  {
    icon: Headphones,
    title: "7/24 Destek",
    description: "Sipariş ve danışma için her zaman ulaşabilirsiniz.",
  },
];

export function ServicesStrip() {
  return (
    <section className="border-y border-ink-100">
      <div className="mx-auto max-w-7xl px-6 py-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-center gap-4">
            <div className="size-12 grid place-items-center rounded-full bg-brand-50 text-brand-600 shrink-0">
              <Icon className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900">{title}</h3>
              <p className="text-sm text-ink-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
