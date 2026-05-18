import { prisma } from "@/lib/db";

export async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.setting.findUnique({
    where: { settingKey: key },
  });
  return row?.settingValue ?? null;
}

export async function getKdvIncluded(): Promise<boolean> {
  const v = await getSetting("kdv_dahil");
  return v === "1";
}

export const KDV_RATE = 0.2;

/**
 * Display price = price (KDV included in stored amount unless setting says otherwise).
 * If kdv_dahil = 0, we add KDV on top of stored price for display.
 */
export function applyKdv(price: number, kdvIncluded: boolean): number {
  return kdvIncluded ? price : Math.round(price * (1 + KDV_RATE) * 100) / 100;
}
