import type { Metadata } from "next";
import {
  ADDRESS,
  EMAIL,
  GEO,
  PHONE_E164,
  SERVICE_AREAS,
  SOCIAL,
} from "@/lib/site";

export const SITE_NAME = "Naturel Çiçekçilik";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://izmirnaturelcicek.com";
export const SITE_DESCRIPTION =
  "İzmir çiçekçi — aynı gün teslimat. Bayraklı, Karşıyaka, Bornova ve tüm İzmir'e taze gül buketi, aranjman, saksı çiçeği ve orkide gönderin. Kendi buketinizi tasarlayın, fiyatı anında görün.";

export const OG_IMAGE = "/banner.jpg";

const KEYWORDS = [
  "İzmir çiçekçi",
  "İzmir çiçek siparişi",
  "aynı gün çiçek İzmir",
  "Bayraklı çiçekçi",
  "Karşıyaka çiçekçi",
  "Bornova çiçekçi",
  "online çiçek siparişi İzmir",
  "gül buketi İzmir",
  "kendi buketini yap",
  "kişiye özel buket İzmir",
  "doğum günü çiçeği İzmir",
  "sevgiliye çiçek İzmir",
  "orkide siparişi İzmir",
  "saksı çiçeği İzmir",
  "gelin arabası süsleme İzmir",
  "düğün çiçeği İzmir",
  "cenaze çelengi İzmir",
  "açılış çelengi İzmir",
];

export const HOME_TITLE = `İzmir Çiçekçi — Aynı Gün Çiçek Siparişi | ${SITE_NAME}`;

export function defaultMetadata(): Metadata {
  const title = HOME_TITLE;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Çiçekçilik",
    formatDetection: { telephone: true, address: true, email: true },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: SITE_NAME,
      url: SITE_URL,
      title,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — İzmir çiçek siparişi`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: { canonical: "/" },
    icons: { icon: "/favicon.png", apple: "/favicon.png" },
    other: {
      "geo.region": "TR-35",
      "geo.placename": "İzmir",
      "geo.position": `${GEO.lat};${GEO.lng}`,
    },
  };
}

/** Sayfa başına canonical + OG bilgisi üretir. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: SITE_NAME,
      url: `${SITE_URL}${path}`,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [{ url: image ?? OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image ?? OG_IMAGE],
    },
  };
}

/** Google'ın yerel işletme panelini besleyen ana şema. */
export function floristJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Florist",
    "@id": `${SITE_URL}/#florist`,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    telephone: PHONE_E164,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.district,
      addressRegion: ADDRESS.city,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.lat,
      longitude: GEO.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    priceRange: "₺₺",
    currenciesAccepted: "TRY",
    paymentAccepted: "Nakit, Kredi Kartı, Havale/EFT",
    areaServed: SERVICE_AREAS.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${GEO.lat},${GEO.lng}`,
    sameAs: [SOCIAL.instagram, SOCIAL.facebook],
    // Not: aggregateRating bilerek eklenmedi. Doğrulanamayan puan işaretlemesi
    // Google'dan manuel işlem yiyebilir; Google İşletme Profili bağlanınca
    // gerçek puanla eklenmeli.
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
