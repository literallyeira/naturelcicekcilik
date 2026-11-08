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
  RECIPIENT_CITY,
  orderFieldsSchema,
  paymentResponse,
  validationError,
} from "@/lib/checkout";

const FLOWER_IDS = FLOWERS.map((f) => f.id);
const WRAP_IDS = WRAPS.map((w) => w.id);
const EXTRA_IDS = EXTRAS.map((e) => e.id);

const customSchema = orderFieldsSchema.extend({
  selection: z.record(
    z.enum(FLOWER_IDS as [string, ...string[]]),
    z.number().int().min(1).max(MAX_STEMS),
  ),
  wrapId: z.enum(WRAP_IDS as [string, ...string[]]),
  extras: z.array(z.enum(EXTRA_IDS as [string, ...string[]])).default([]),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = customSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
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

  const order = await prisma.order.create({
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
      recipientCity: RECIPIENT_CITY,
      district: data.district,
      deliveryDay: new Date(data.deliveryDay),
      deliveryHour: data.deliveryHour,
      note,
      isAnonymous: data.isAnonymous ?? false,
      orderDate: new Date(),
    },
  });

  return paymentResponse(
    { ...order, merchantOid, totalAmount: pricing.total, product: null },
    data,
  );
}
