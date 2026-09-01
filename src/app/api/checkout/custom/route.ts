import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  EXTRAS,
  FLOWERS,
  MAX_STEMS,
  MIN_STEMS,
  WRAPS,
  describeBouquet,
  priceBouquet,
  stemCount,
} from "@/lib/bouquet";
import { getBouquetCatalog } from "@/lib/bouquetCatalog";
import {
  buildAutoSubmitForm,
  buildShopierForm,
  isShopierConfigured,
} from "@/lib/shopier";

const FLOWER_IDS = FLOWERS.map((f) => f.id);
const WRAP_IDS = WRAPS.map((w) => w.id);
const EXTRA_IDS = EXTRAS.map((e) => e.id);

const customSchema = z.object({
  selection: z.record(
    z.enum(FLOWER_IDS as [string, ...string[]]),
    z.number().int().min(1).max(MAX_STEMS),
  ),
  wrapId: z.enum(WRAP_IDS as [string, ...string[]]),
  extras: z.array(z.enum(EXTRA_IDS as [string, ...string[]])).default([]),
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

  const parsed = customSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Form verisi eksik" }, { status: 400 });
  }
  const data = parsed.data;
  const selection = data.selection as Record<string, number>;

  const stems = stemCount(selection);
  if (stems < MIN_STEMS || stems > MAX_STEMS) {
    return NextResponse.json(
      { error: `Buketiniz ${MIN_STEMS}–${MAX_STEMS} dal arasında olmalı` },
      { status: 400 },
    );
  }

  // Tutar her zaman sunucuda, admin panelindeki güncel fiyatlarla hesaplanır.
  const catalog = await getBouquetCatalog();
  const pricing = priceBouquet(selection, data.wrapId, data.extras, catalog);
  const composition = describeBouquet(
    selection,
    data.wrapId,
    data.extras,
    catalog,
  );

  const merchantOid = `NTRLB${Date.now()}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

  const note = [
    "── ÖZEL BUKET İÇERİĞİ ──",
    composition,
    data.note ? `\n── KART NOTU ──\n${data.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await prisma.order.create({
    data: {
      productId: null,
      merchantOid,
      totalAmount: pricing.total,
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
      note,
      isAnonymous: data.isAnonymous ?? false,
      orderDate: new Date(),
    },
  });

  if (!isShopierConfigured()) {
    return NextResponse.json({
      orderId: merchantOid,
      bankTransfer: true,
      totalAmount: pricing.total,
    });
  }

  const { url, fields } = buildShopierForm({
    orderId: merchantOid,
    amount: pricing.total,
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

  return NextResponse.json({
    orderId: merchantOid,
    paymentForm: buildAutoSubmitForm(url, fields),
  });
}
