export const PHONE_DISPLAY = "0555 535 62 86";
export const PHONE_INTL_DISPLAY = "+90 555 535 62 86";
export const PHONE_HREF = "tel:+905555356286";
export const PHONE_E164 = "+905555356286";
export const WHATSAPP_NUMBER = "905555356286";

export const EMAIL = "info@izmirnaturelcicek.com";
export const EMAIL_HREF = `mailto:${EMAIL}`;

export const ADDRESS = {
  street: "Adalet Mah.",
  district: "Bayraklı",
  city: "İzmir",
  postalCode: "35530",
  country: "TR",
  full: "Adalet Mah., Bayraklı / İzmir",
};

export const GEO = { lat: 38.4604, lng: 27.1752 };

/** Havale / EFT ile ödeme bilgileri — sipariş sonrası müşteriye gösterilir. */
export const BANK = {
  holder: "Muratcan Kıyanç",
  bankName: "Garanti BBVA",
  iban: "TR59 0006 2001 1000 0006 6282 80",
};

export const SERVICE_AREAS = ["Karşıyaka", "Bayraklı", "Bornova"];

export const SOCIAL = {
  instagram: "https://www.instagram.com/naturelcicekcilik",
  facebook: "https://www.facebook.com/naturelcicekcilik",
};

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
