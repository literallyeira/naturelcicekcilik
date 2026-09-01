import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL, defaultMetadata, floristJsonLd } from "@/lib/seo";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-logo",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata = defaultMetadata();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink-900">
        <JsonLd data={floristJsonLd()} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            inLanguage: "tr-TR",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/arama?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
