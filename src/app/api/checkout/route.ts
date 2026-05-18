import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  buildAutoSubmitForm,
  buildShopierForm,
  isShopierConfigured,
} from "@/lib/shopier";

const checkoutSchema = z.object({
  productId: z.number().int().positive(),
  senderName: z.string().min(1),
  senderSurname: z.string().min(1),
  senderPhone: z.string().min(7),
  senderEmail: z.string().email(),
  senderAddress: z.string().optional(),
  recipientName: z.string().min(1),
  recipientSurname: z.string().min(1),
  recipientPhone: z.string().min(7),
  recipientAddress: z.string().min(1),
  recipientCity: z.string().min(1),
  district: z.string().min(1),
  deliveryDay: z.string().min(1),
  deliveryHour: z.string().min(1),
  note: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form verisi eksik", details: parsed.error.format() },
      { status: 400 },
    );
  }
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
      recipientCity: data.recipientCity,
      district: data.district,
      deliveryDay: new Date(data.deliveryDay),
      deliveryHour: data.deliveryHour,
      note: data.note ?? null,
      isAnonymous: data.isAnonymous ?? false,
      orderDate: new Date(),
    },
  });

  if (!isShopierConfigured()) {
    return NextResponse.json({
      orderId: merchantOid,
      bankTransfer: true,
      totalAmount,
    });
  }

  const { url, fields } = buildShopierForm({
    orderId: merchantOid,
    amount: Number(product.price),
    currency: "TRY",
    buyer: {
      buyerName: data.senderName,
      buyerSurname: data.senderSurname,
      buyerEmail: data.senderEmail,
      buyerPhone: data.senderPhone,
      buyerAddress: data.senderAddress ?? data.recipientAddress,
      buyerCity: data.recipientCity,
    },
  });

  const html = buildAutoSubmitForm(url, fields);

  return NextResponse.json({ orderId: merchantOid, paymentForm: html });
}
