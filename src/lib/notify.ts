/**
 * Yeni sipariş bildirimi — dükkan sahibinin telefonuna anında mesaj atar.
 *
 * İki kanal desteklenir; hangisinin env değişkenleri doluysa o çalışır
 * (ikisi de doluysa ikisine de gider, ikisi de boşsa sessizce atlanır):
 *
 *   Telegram (ücretsiz, önerilen)
 *     TELEGRAM_BOT_TOKEN   — @BotFather'dan alınan bot token
 *     TELEGRAM_CHAT_ID     — mesajın gideceği sohbet id'si
 *
 *   WhatsApp — CallMeBot (ücretsiz, kişisel kullanım)
 *     CALLMEBOT_PHONE      — WhatsApp numaran, ülke koduyla (+905...)
 *     CALLMEBOT_APIKEY     — CallMeBot'un WhatsApp'tan gönderdiği apikey
 *
 * Havale siparişlerinde sipariş oluşturulunca, kartlı siparişlerde ise
 * yalnızca ödeme başarılı olunca bildirim gider (yarım kalan kart
 * denemeleri bildirim üretmez).
 */
import { formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/seo";

export type NotifyKind = "havale" | "card_paid";

export type NotifiableOrder = {
  id: number;
  merchantOid: string | null;
  totalAmount: number | null;
  senderName: string | null;
  senderSurname: string | null;
  senderPhone: string | null;
  district: string | null;
  deliveryDay: Date | null;
  deliveryHour: string | null;
  product?: { name: string } | null;
};

export function buildOrderMessage(order: NotifiableOrder, kind: NotifyKind) {
  const day = order.deliveryDay
    ? order.deliveryDay.toLocaleDateString("tr-TR", {
        timeZone: "UTC",
        day: "numeric",
        month: "long",
        weekday: "long",
      })
    : "—";
  return [
    `🌸 YENİ SİPARİŞ — ${order.merchantOid ?? `#${order.id}`}`,
    kind === "card_paid"
      ? "💳 Kartla ödendi ✅"
      : "🏦 Havale bekleniyor (dekont gelince onayla)",
    "",
    `Ürün: ${order.product?.name ?? "Özel buket (buket tasarlayıcı)"}`,
    `Tutar: ${order.totalAmount != null ? formatPrice(order.totalAmount) : "—"}`,
    `Teslimat: ${day} · ${order.deliveryHour ?? "—"}`,
    `İlçe: ${order.district ?? "—"}`,
    `Gönderen: ${[order.senderName, order.senderSurname].filter(Boolean).join(" ")} · ${order.senderPhone ?? "—"}`,
    "",
    `Detay: ${SITE_URL}/admin/orders/${order.id}`,
  ].join("\n");
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
}

async function sendWhatsApp(text: string) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return;
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apikey);
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`CallMeBot ${res.status}: ${await res.text()}`);
}

/** Hata fırlatmaz — bildirim gitmese bile sipariş akışı bozulmamalı. */
export async function notifyNewOrder(order: NotifiableOrder, kind: NotifyKind) {
  const text = buildOrderMessage(order, kind);
  const results = await Promise.allSettled([sendTelegram(text), sendWhatsApp(text)]);
  for (const r of results) {
    if (r.status === "rejected") {
      console.error("[notify] sipariş bildirimi gönderilemedi:", r.reason);
    }
  }
}
