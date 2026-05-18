import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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

export async function POST(req: Request) {
  const data = await read(req);
  if (!data) return new NextResponse("bad request", { status: 400 });

  if (!verifyShopierCallback(data)) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  if (data.status === "success") {
    await prisma.order.update({
      where: { merchantOid: data.platform_order_id },
      data: { paymentStatus: "paid" },
    });
  }

  // Shopier expects a plain "success" text response when handled
  return new NextResponse("success", { status: 200 });
}
