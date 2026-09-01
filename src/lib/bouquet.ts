export type FlowerKind =
  | "gul"
  | "papatya"
  | "gerbera"
  | "karanfil"
  | "lilyum"
  | "aycicegi"
  | "lisianthus"
  | "orkide"
  | "okaliptus"
  | "cipso"
  | "aspidistra";

export type Flower = {
  id: string;
  name: string;
  kind: FlowerKind;
  /** Ana taç yaprak rengi */
  color: string;
  /** Gölge / derinlik rengi */
  shade: string;
  /** Göbek rengi */
  center: string;
  price: number;
  group: "gul" | "mevsim" | "yesillik";
  note: string;
};

export const FLOWERS: Flower[] = [
  {
    id: "gul-kirmizi",
    name: "Kırmızı Gül",
    kind: "gul",
    color: "#c2183a",
    shade: "#8f0f28",
    center: "#6d0b1d",
    price: 95,
    group: "gul",
    note: "Aşkın klasik ifadesi",
  },
  {
    id: "gul-beyaz",
    name: "Beyaz Gül",
    kind: "gul",
    color: "#fdfcf8",
    shade: "#bcb097",
    center: "#d8d2c2",
    price: 95,
    group: "gul",
    note: "Saflık ve zarafet",
  },
  {
    id: "gul-pembe",
    name: "Pembe Gül",
    kind: "gul",
    color: "#f2a2bd",
    shade: "#d97a9c",
    center: "#c26183",
    price: 95,
    group: "gul",
    note: "Zarif ve romantik",
  },
  {
    id: "gul-lila",
    name: "Lila Gül",
    kind: "gul",
    color: "#c3a5e0",
    shade: "#a382c4",
    center: "#8d6bb0",
    price: 105,
    group: "gul",
    note: "Özel ve iddialı",
  },
  {
    id: "gul-somon",
    name: "Somon Gül",
    kind: "gul",
    color: "#f6b79a",
    shade: "#dd9174",
    center: "#c87a5d",
    price: 95,
    group: "gul",
    note: "Sıcak pastel ton",
  },
  {
    id: "papatya-beyaz",
    name: "Beyaz Papatya",
    kind: "papatya",
    color: "#ffffff",
    shade: "#bdb49c",
    center: "#f2c14b",
    price: 55,
    group: "mevsim",
    note: "Neşeli ve sade",
  },
  {
    id: "gerbera-kirmizi",
    name: "Kırmızı Gerbera",
    kind: "gerbera",
    color: "#e03b3b",
    shade: "#b62a2a",
    center: "#4a2318",
    price: 70,
    group: "mevsim",
    note: "Canlı ve dikkat çekici",
  },
  {
    id: "gerbera-pembe",
    name: "Pembe Gerbera",
    kind: "gerbera",
    color: "#ef7fa8",
    shade: "#d15f89",
    center: "#4a2318",
    price: 70,
    group: "mevsim",
    note: "Tatlı bir dokunuş",
  },
  {
    id: "karanfil-pembe",
    name: "Pembe Karanfil",
    kind: "karanfil",
    color: "#f0a0c0",
    shade: "#d17ea1",
    center: "#c06a8d",
    price: 50,
    group: "mevsim",
    note: "Uzun ömürlü",
  },
  {
    id: "karanfil-beyaz",
    name: "Beyaz Karanfil",
    kind: "karanfil",
    color: "#fbf9f3",
    shade: "#beb59b",
    center: "#d5cfbe",
    price: 50,
    group: "mevsim",
    note: "Zarif ve dayanıklı",
  },
  {
    id: "lilyum-beyaz",
    name: "Beyaz Lilyum",
    kind: "lilyum",
    color: "#fffdf7",
    shade: "#bfb69a",
    center: "#e0a33c",
    price: 130,
    group: "mevsim",
    note: "Yoğun ve hoş kokulu",
  },
  {
    id: "aycicegi",
    name: "Ayçiçeği",
    kind: "aycicegi",
    color: "#f5b921",
    shade: "#d99a10",
    center: "#5a3a1a",
    price: 85,
    group: "mevsim",
    note: "Güneş gibi enerjik",
  },
  {
    id: "lisianthus-lila",
    name: "Lila Lisianthus",
    kind: "lisianthus",
    color: "#cbb2e8",
    shade: "#ab8fcd",
    center: "#f0e6a8",
    price: 90,
    group: "mevsim",
    note: "İpeksi ve zarif",
  },
  {
    id: "orkide-beyaz",
    name: "Beyaz Orkide Dalı",
    kind: "orkide",
    color: "#fffdfa",
    shade: "#c2b89f",
    center: "#e0b64a",
    price: 160,
    group: "mevsim",
    note: "Lüks ve gösterişli",
  },
  {
    id: "okaliptus",
    name: "Okaliptus",
    kind: "okaliptus",
    color: "#9db89b",
    shade: "#7d9a7c",
    center: "#6d8a6c",
    price: 35,
    group: "yesillik",
    note: "Ferah yeşil doku",
  },
  {
    id: "cipso",
    name: "Cipso (Gypsophila)",
    kind: "cipso",
    color: "#ffffff",
    shade: "#c4bda9",
    center: "#f4f2ec",
    price: 40,
    group: "yesillik",
    note: "Bulut gibi dolgunluk",
  },
  {
    id: "aspidistra",
    name: "Aspidistra Yaprağı",
    kind: "aspidistra",
    color: "#4f7a4c",
    shade: "#3d6039",
    center: "#7ea87a",
    price: 25,
    group: "yesillik",
    note: "Şık yeşil çerçeve",
  },
];

export type Wrap = {
  id: string;
  name: string;
  price: number;
  /** Ambalaj ana rengi */
  color: string;
  /** Ambalaj gölge rengi */
  shade: string;
  style: "kagit" | "vazo" | "kutu";
  note: string;
};

export const WRAPS: Wrap[] = [
  {
    id: "kraft",
    name: "Kraft Kağıt",
    price: 60,
    color: "#c8a683",
    shade: "#a9855f",
    style: "kagit",
    note: "Doğal, rustik duruş",
  },
  {
    id: "krem",
    name: "Krem Pudra Buket",
    price: 80,
    color: "#f0e3d6",
    shade: "#d9c6b3",
    style: "kagit",
    note: "En çok tercih edilen",
  },
  {
    id: "lila",
    name: "Lila Buket Kağıdı",
    price: 80,
    color: "#ded1ea",
    shade: "#c2b0d6",
    style: "kagit",
    note: "Pastel ve modern",
  },
  {
    id: "siyah",
    name: "Siyah Mat Buket",
    price: 95,
    color: "#3a3a3c",
    shade: "#232325",
    style: "kagit",
    note: "İddialı kontrast",
  },
  {
    id: "cam-vazo",
    name: "Cam Vazo",
    price: 220,
    color: "#cfe3ea",
    shade: "#a9c7d3",
    style: "vazo",
    note: "Hediye edildiği gibi durur",
  },
  {
    id: "kadife-kutu",
    name: "Kadife Kutu",
    price: 260,
    color: "#8d2b3f",
    shade: "#6c1f2e",
    style: "kutu",
    note: "Lüks sunum",
  },
];

export type Extra = { id: string; name: string; price: number; note: string };

export const EXTRAS: Extra[] = [
  { id: "kart", name: "El Yazısı Tebrik Kartı", price: 0, note: "Ücretsiz" },
  { id: "cikolata", name: "Kutu Çikolata", price: 180, note: "Buketin yanında" },
  { id: "ayicik", name: "Peluş Ayıcık", price: 240, note: "25 cm" },
  { id: "vazo-suyu", name: "Çiçek Bakım Solüsyonu", price: 45, note: "Daha uzun ömür" },
];

export const MIN_STEMS = 5;
export const MAX_STEMS = 40;

export type Selection = Record<string, number>;

export function stemCount(selection: Selection): number {
  return Object.values(selection).reduce((sum, n) => sum + n, 0);
}

/** Fiyat her zaman burada hesaplanır — istemciden gelen tutara asla güvenilmez. */
export function priceBouquet(
  selection: Selection,
  wrapId: string,
  extraIds: string[],
) {
  let flowersTotal = 0;
  for (const [id, qty] of Object.entries(selection)) {
    const flower = FLOWERS.find((f) => f.id === id);
    if (!flower || qty <= 0) continue;
    flowersTotal += flower.price * qty;
  }

  const wrap = WRAPS.find((w) => w.id === wrapId) ?? WRAPS[1];
  const extras = EXTRAS.filter((e) => extraIds.includes(e.id));
  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);

  return {
    flowersTotal,
    wrap,
    wrapTotal: wrap.price,
    extras,
    extrasTotal,
    total: flowersTotal + wrap.price + extrasTotal,
  };
}

/** Admin panelinde ve teslimat fişinde okunacak içerik dökümü. */
export function describeBouquet(
  selection: Selection,
  wrapId: string,
  extraIds: string[],
): string {
  const lines: string[] = [];
  for (const flower of FLOWERS) {
    const qty = selection[flower.id];
    if (qty && qty > 0) lines.push(`${qty} x ${flower.name}`);
  }
  const { wrap, extras, total } = priceBouquet(selection, wrapId, extraIds);
  lines.push(`Ambalaj: ${wrap.name}`);
  if (extras.length > 0) {
    lines.push(`Ekstralar: ${extras.map((e) => e.name).join(", ")}`);
  }
  lines.push(`Toplam: ${total} TL`);
  return lines.join("\n");
}

export const PRESETS: {
  id: string;
  name: string;
  description: string;
  selection: Selection;
  wrapId: string;
}[] = [
  {
    id: "romantik",
    name: "Romantik",
    description: "11 kırmızı gül, okaliptus dokusu",
    selection: { "gul-kirmizi": 11, okaliptus: 3 },
    wrapId: "krem",
  },
  {
    id: "pastel",
    name: "Pastel Bahar",
    description: "Pembe gül, papatya ve cipso",
    selection: { "gul-pembe": 6, "papatya-beyaz": 6, cipso: 3 },
    wrapId: "lila",
  },
  {
    id: "saf",
    name: "Saf Beyaz",
    description: "Beyaz gül, lilyum ve aspidistra",
    selection: { "gul-beyaz": 7, "lilyum-beyaz": 3, aspidistra: 3 },
    wrapId: "kraft",
  },
  {
    id: "nese",
    name: "Neşe Dolu",
    description: "Ayçiçeği, gerbera ve papatya",
    selection: { aycicegi: 4, "gerbera-kirmizi": 4, "papatya-beyaz": 5 },
    wrapId: "kraft",
  },
];
