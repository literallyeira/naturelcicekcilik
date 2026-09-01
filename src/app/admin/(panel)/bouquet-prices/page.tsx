import Link from "next/link";
import { getBouquetCatalog } from "@/lib/bouquetCatalog";
import { BouquetPriceForm } from "./BouquetPriceForm";

export const dynamic = "force-dynamic";

export default async function BouquetPricesPage() {
  const catalog = await getBouquetCatalog();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black text-ink-900">Buket Fiyatları</h1>
        <p className="text-ink-500 text-sm">
          &quot;Kendi Buketini Yap&quot; sayfasındaki tekli çiçek, ambalaj ve
          ekstra fiyatları.{" "}
          <Link
            href="/buket-yap"
            target="_blank"
            className="text-brand-600 hover:underline"
          >
            Sayfayı gör →
          </Link>
        </p>
      </header>

      <BouquetPriceForm catalog={catalog} />
    </div>
  );
}
