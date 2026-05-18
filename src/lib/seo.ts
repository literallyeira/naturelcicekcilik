import type { Metadata } from "next";

export const SITE_NAME = "Naturel Çiçekçilik";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://izmirnaturelcicek.com";
export const SITE_DESCRIPTION =
  "Bayraklı İzmir çiçekçi — taze buketler, aranjmanlar, saksı çiçekleri, gelin arabası süslemesi ve düğün çiçekleri. Aynı gün İzmir teslimat, güvenli ödeme.";

const KEYWORDS = [
  "çiçekçi",
  "İzmir çiçekçi",
  "Bayraklı çiçekçi",
  "İzmir çiçek siparişi",
  "Bayraklı çiçek",
  "çiçek siparişi İzmir",
  "İzmir buket",
  "gül buketi İzmir",
  "online çiçek İzmir",
  "aynı gün çiçek teslimat İzmir",
  "düğün çiçeği İzmir",
  "gelin arabası süsleme İzmir",
  "saksı çiçek İzmir",
  "aranjman İzmir",
  "doğum günü çiçeği İzmir",
  "sevgililer günü çiçek İzmir",
];

export function defaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — Bayraklı İzmir Çiçek Siparişi`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: KEYWORDS,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: SITE_NAME,
      url: SITE_URL,
      title: `${SITE_NAME} — Bayraklı İzmir Çiçek Siparişi`,
      description: SITE_DESCRIPTION,
      images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — Bayraklı İzmir Çiçek Siparişi`,
      description: SITE_DESCRIPTION,
    },
    alternates: { canonical: SITE_URL },
    icons: { icon: "/favicon.png" },
  };
}
