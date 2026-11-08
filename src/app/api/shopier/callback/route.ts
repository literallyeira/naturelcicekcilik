import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/db";
import { notifyNewOrder } from "@/lib/notify";
import { verifyShopierCallback, type ShopierCallback } from "@/lib/shopier";

async function read(req: Request): Promise<ShopierCallback | null> {
  try {
    const formData = await req.formData();
    return {
      platform_order_id: String(formData.get("platform_order_id") ?? ""),
      status: String(formData.get("status") ?? ""),
      installment: String(formData.get("installment") ?? ""),
      payment_id: String(formData.get("payment_id") ?? ""),
      random_nr: String(formData.get("random_nr") ?? ""),
      signature: String(formData.get("signature") ?? ""),
    };
  } catch {
    return null;
  }
}

/**
 * Shopier ödeme sonrası müşterinin tarayıcısını bu adrese POST eder
 * (Shopier paneli → Geri dönüş URL). İmzayı doğrular, siparişi "paid"
 * yapar, dükkana bildirim gönderir ve müşteriyi sonuç sayfasına yönlendirir.
 */
export async function POST(req: Request) {
  const data = await read(req);
  const go = (path: string) =>
    NextResponse.redirect(new URL(path, req.url), 303);

  if (!data || !verifyShopierCallback(data)) {
    return go("/odeme/basarisiz");
  }

  const oid = data.platform_order_id;
  const oidQuery = `oid=${encodeURIComponent(oid)}`;

  if (data.status.toLowerCase() !== "success") {
    return go(`/odeme/basarisiz?${oidQuery}`);
  }

  // Yalnızca bekleyen siparişi güncelle — sayfa yenilenirse tekrar bildirim gitmez.
  const { count } = await prisma.order.updateMany({
    where: { merchantOid: oid, paymentStatus: "pending" },
    data: { paymentStatus: "paid" },
  });

  if (count > 0) {
    after(async () => {
      const order = await prisma.order.findUnique({
        where: { merchantOid: oid },
        include: { product: { select: { name: true } } },
      });
      if (order) await notifyNewOrder(order, "card_paid");
    });
  }

  return go(`/odeme/basarili?${oidQuery}&paid=1`);
}
