import { NextResponse, after } from "next/server";
import { z } from "zod";
import { DELIVERY_DISTRICTS } from "@/lib/districts";
import { notifyNewOrder, type NotifiableOrder } from "@/lib/notify";
import {
  buildAutoSubmitForm,
  buildShopierForm,
  isShopierConfigured,
} from "@/lib/shopier";

export const DISTRICT_ERROR =
  "Şu an yalnızca Karşıyaka, Bayraklı ve Bornova'ya teslimat yapıyoruz.";

/** Ürün ve özel buket siparişlerinin ortak form alanları. */
export const orderFieldsSchema = z.object({
  senderName: z.string().min(1),
  senderSurname: z.string().min(1),
  senderPhone: z.string().min(7),
  senderEmail: z.string().email(),
  senderAddress: z.string().optional(),
  recipientName: z.string().min(1),
  recipientSurname: z.string().min(1),
  recipientPhone: z.string().min(7),
  recipientAddress: z.string().min(1),
  district: z.enum(DELIVERY_DISTRICTS, { error: DISTRICT_ERROR }),
  deliveryDay: z.string().min(1),
  deliveryHour: z.string().min(1),
  note: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  paymentMethod: z.enum(["card", "havale"]).default("card"),
});

export type OrderFields = z.infer<typeof orderFieldsSchema>;

/** Teslimat yalnızca İzmir içi — il alanı istemciden alınmaz. */
export const RECIPIENT_CITY = "İzmir";

export function validationError(error: z.ZodError) {
  const districtIssue = error.issues.some((i) => i.path[0] === "district");
  return NextResponse.json(
    { error: districtIssue ? DISTRICT_ERROR : "Form verisi eksik" },
    { status: 400 },
  );
}

/**
 * Sipariş kaydedildikten sonra ödeme yanıtını üretir:
 *  - kart seçildiyse ve Shopier ayarlıysa → Shopier ödeme formu
 *  - aksi halde → havale bilgileri + dükkana bildirim
 */
export function paymentResponse(
  order: NotifiableOrder & { merchantOid: string; totalAmount: number },
  data: OrderFields,
  /** Karttan çekilecek tutar (kuruşlu olabilir); verilmezse totalAmount. */
  chargeAmount: number = order.totalAmount,
) {
  const useCard = data.paymentMethod === "card" && isShopierConfigured();

  if (!useCard) {
    after(() => notifyNewOrder(order, "havale"));
    return NextResponse.json({
      orderId: order.merchantOid,
      bankTransfer: true,
      totalAmount: order.totalAmount,
    });
  }

  const { url, fields } = buildShopierForm({
    orderId: order.merchantOid,
    amount: chargeAmount,
    currency: "TRY",
    buyer: {
      buyerName: data.senderName,
      buyerSurname: data.senderSurname,
      buyerEmail: data.senderEmail,
      buyerPhone: data.senderPhone,
      buyerAddress: data.senderAddress || data.recipientAddress,
      buyerCity: RECIPIENT_CITY,
    },
  });

  return NextResponse.json({
    orderId: order.merchantOid,
    paymentForm: buildAutoSubmitForm(url, fields),
  });
}
