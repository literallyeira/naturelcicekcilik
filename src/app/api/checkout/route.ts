import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  RECIPIENT_CITY,
  orderFieldsSchema,
  paymentResponse,
  validationError,
} from "@/lib/checkout";

const checkoutSchema = orderFieldsSchema.extend({
  productId: z.number().int().positive(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const data = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });
  if (!product || !product.isActive) {
    return NextResponse.json(
      { error: "Ürün bulunamadı" },
      { status: 404 },
    );
  }

  const merchantOid = `NTRL${Date.now()}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;
  const totalAmount = Math.round(Number(product.price));

  const order = await prisma.order.create({
    data: {
      productId: product.id,
      merchantOid,
      totalAmount,
      senderName: data.senderName,
      senderSurname: data.senderSurname,
      senderPhone: data.senderPhone,
      senderEmail: data.senderEmail,
      senderAddress: data.senderAddress ?? null,
      recipientName: data.recipientName,
      recipientSurname: data.recipientSurname,
      recipientPhone: data.recipientPhone,
      recipientAddress: data.recipientAddress,
      recipientCity: RECIPIENT_CITY,
      district: data.district,
      deliveryDay: new Date(data.deliveryDay),
      deliveryHour: data.deliveryHour,
      note: data.note ?? null,
      isAnonymous: data.isAnonymous ?? false,
      orderDate: new Date(),
    },
  });

  return paymentResponse(
    { ...order, merchantOid, totalAmount, product: { name: product.name } },
    data,
    Number(product.price),
  );
}
