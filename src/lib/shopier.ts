/**
 * Shopier API integration (https://destek.shopier.com/hc/en-us/articles/4404856070034)
 *
 * Required env vars (set in Vercel project settings):
 *   SHOPIER_API_KEY
 *   SHOPIER_API_SECRET
 *   SHOPIER_WEBSITE_INDEX
 *   NEXT_PUBLIC_SITE_URL
 *
 * Flow:
 *  1. Create order in DB with payment_status=pending (caller's responsibility).
 *  2. Call buildShopierPayload() with order + buyer info.
 *  3. Send back the HTML form to the browser; browser auto-submits to Shopier.
 *  4. Shopier redirects user back to our /api/shopier/callback after payment.
 *  5. verifyShopierCallback() validates the signature; on success mark order paid.
 */
import crypto from "node:crypto";

export type ShopierBuyer = {
  buyerName: string;
  buyerSurname: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerCity: string;
  buyerCountry?: string;
  buyerPostcode?: string;
};

export type ShopierPayload = {
  orderId: string; // merchantOid (platform_order_id)
  amount: number;
  currency?: "TRY" | "USD" | "EUR" | "GBP";
  buyer: ShopierBuyer;
};

export type ShopierFormData = Record<string, string>;

function getCredentials() {
  const apiKey = process.env.SHOPIER_API_KEY;
  const apiSecret = process.env.SHOPIER_API_SECRET;
  const websiteIndex = process.env.SHOPIER_WEBSITE_INDEX;
  if (!apiKey || !apiSecret || !websiteIndex) {
    return null;
  }
  return { apiKey, apiSecret, websiteIndex };
}

export function isShopierConfigured(): boolean {
  return getCredentials() !== null;
}

const CURRENCY_CODES: Record<string, number> = {
  TRY: 0,
  USD: 1,
  EUR: 2,
  GBP: 3,
};

export function buildShopierForm(payload: ShopierPayload): {
  url: string;
  fields: ShopierFormData;
} {
  const creds = getCredentials();
  if (!creds) throw new Error("Shopier credentials are not configured");

  const { apiKey, apiSecret, websiteIndex } = creds;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const random = Math.floor(Math.random() * 1_000_000).toString();
  const currency = CURRENCY_CODES[payload.currency ?? "TRY"];

  // Shopier signs: random + platform_order_id + total_order_value + currency
  const signString = `${random}${payload.orderId}${payload.amount.toFixed(2)}${currency}`;
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(signString)
    .digest("base64");

  const fields: ShopierFormData = {
    API_key: apiKey,
    website_index: websiteIndex,
    platform_order_id: payload.orderId,
    product_name: `Sipariş #${payload.orderId}`,
    product_type: "1", // 1 = product (not download)
    buyer_name: payload.buyer.buyerName,
    buyer_surname: payload.buyer.buyerSurname,
    buyer_email: payload.buyer.buyerEmail,
    buyer_account_age: "0",
    buyer_id_nr: "11111111111",
    buyer_phone: payload.buyer.buyerPhone,
    billing_address: payload.buyer.buyerAddress,
    billing_city: payload.buyer.buyerCity,
    billing_country: payload.buyer.buyerCountry ?? "Türkiye",
    billing_postcode: payload.buyer.buyerPostcode ?? "00000",
    shipping_address: payload.buyer.buyerAddress,
    shipping_city: payload.buyer.buyerCity,
    shipping_country: payload.buyer.buyerCountry ?? "Türkiye",
    shipping_postcode: payload.buyer.buyerPostcode ?? "00000",
    total_order_value: payload.amount.toFixed(2),
    currency: String(currency),
    platform: "0",
    is_in_frame: "0",
    current_language: "0",
    modul_version: "1.0.4",
    random_nr: random,
    signature,
    callback_url: `${siteUrl}/api/shopier/callback`,
    return_url: `${siteUrl}/odeme/basarili?oid=${payload.orderId}`,
  };

  return { url: "https://www.shopier.com/ShowProduct/api_pay4.php", fields };
}

export function buildAutoSubmitForm(url: string, fields: ShopierFormData) {
  const inputs = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<input type="hidden" name="${escapeHtml(k)}" value="${escapeHtml(v)}" />`,
    )
    .join("\n");
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>Ödemeye yönlendiriliyorsunuz...</title></head>
<body>
<p style="font-family:sans-serif;text-align:center;margin-top:80px">Ödeme sayfasına yönlendiriliyorsunuz...</p>
<form id="shopier" method="post" action="${escapeHtml(url)}">
${inputs}
</form>
<script>document.getElementById('shopier').submit();</script>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type ShopierCallback = {
  platform_order_id: string;
  status: string; // "success" | "failed"
  installment: string;
  payment_id: string;
  random_nr: string;
  signature: string;
};

export function verifyShopierCallback(data: ShopierCallback): boolean {
  const creds = getCredentials();
  if (!creds) return false;
  const sign = `${data.random_nr}${data.platform_order_id}`;
  const expected = crypto
    .createHmac("sha256", creds.apiSecret)
    .update(sign)
    .digest("base64");
  return expected === data.signature;
}
