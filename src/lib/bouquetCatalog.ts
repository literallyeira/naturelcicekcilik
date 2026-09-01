import {
  BOUQUET_PRICES_KEY,
  DEFAULT_CATALOG,
  catalogWithOverrides,
  parsePriceOverrides,
  type BouquetCatalog,
} from "@/lib/bouquet";
import { getSetting } from "@/lib/settings";

/**
 * Buket fiyatlarını ayar tablosundan okur. Ayar yoksa veya veritabanına
 * ulaşılamazsa koddaki varsayılan fiyatlarla devam eder — sayfa hiçbir
 * durumda fiyatsız kalmaz.
 */
export async function getBouquetCatalog(): Promise<BouquetCatalog> {
  try {
    const raw = await getSetting(BOUQUET_PRICES_KEY);
    return catalogWithOverrides(parsePriceOverrides(raw));
  } catch {
    return DEFAULT_CATALOG;
  }
}
