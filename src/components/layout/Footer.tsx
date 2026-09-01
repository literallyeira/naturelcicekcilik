import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Wordmark } from "./Header";
import {
  ADDRESS,
  EMAIL,
  EMAIL_HREF,
  PHONE_HREF,
  PHONE_INTL_DISPLAY,
  SERVICE_AREAS,
  SOCIAL,
} from "@/lib/site";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.526 5.847L.057 23.885c-.07.35.234.655.583.583l6.038-1.469A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-4.997-1.368l-.357-.213-3.705.901.917-3.706-.234-.372A9.797 9.797 0 012.182 12C2.182 6.565 6.565 2.182 12 2.182S21.818 6.565 21.818 12 17.435 21.818 12 21.818z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-200 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark dark />
          <p className="mt-5 text-sm text-ink-300 leading-relaxed max-w-xs">
            İzmir&apos;de 7/24 taze çiçek teslimatı. Her özel anınız için özenle,
            elde hazırlanan buketler ve aranjmanlar.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="size-9 grid place-items-center rounded-full bg-white/10 hover:bg-brand-500 transition-colors"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="size-9 grid place-items-center rounded-full bg-white/10 hover:bg-brand-500 transition-colors"
            >
              <FacebookIcon className="size-4" />
            </a>
            <a
              href={PHONE_HREF}
              aria-label="Telefon"
              className="size-9 grid place-items-center rounded-full bg-white/10 hover:bg-brand-500 transition-colors"
            >
              <WhatsAppIcon className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white mb-5">
            Kurumsal
          </h3>
          <ul className="space-y-2.5 text-sm text-ink-300">
            <li>
              <Link href="/buket-yap" className="hover:text-white transition-colors">
                Kendi Buketini Yap
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="hover:text-white transition-colors">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-white transition-colors">
                İletişim
              </Link>
            </li>
            <li>
              <Link href="/sss" className="hover:text-white transition-colors">
                Sıkça Sorulan Sorular
              </Link>
            </li>
            <li>
              <Link href="/siparis-takip" className="hover:text-white transition-colors">
                Sipariş Takibi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white mb-5">
            Yardım
          </h3>
          <ul className="space-y-2.5 text-sm text-ink-300">
            <li>
              <Link
                href="/mesafeli-satis-sozlesmesi"
                className="hover:text-white transition-colors"
              >
                Mesafeli Satış Sözleşmesi
              </Link>
            </li>
            <li>
              <Link href="/iptal-iade" className="hover:text-white transition-colors">
                İptal / İade Politikası
              </Link>
            </li>
            <li>
              <Link
                href="/teslimat-bilgileri"
                className="hover:text-white transition-colors"
              >
                Teslimat Bilgileri
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white mb-5">
            İletişim
          </h3>
          <ul className="space-y-3.5 text-sm text-ink-300">
            <li className="flex gap-3">
              <MapPin className="size-4 mt-0.5 text-brand-400 shrink-0" />
              <span>{ADDRESS.full}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="size-4 mt-0.5 text-brand-400 shrink-0" />
              <a href={PHONE_HREF} className="hover:text-white transition-colors">
                {PHONE_INTL_DISPLAY}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="size-4 mt-0.5 text-brand-400 shrink-0" />
              <a href={EMAIL_HREF} className="hover:text-white transition-colors">
                {EMAIL}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="size-4 mt-0.5 text-brand-400 shrink-0" />
              <span>Her gün 7/24 sipariş</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-xs text-ink-400 leading-relaxed">
            <span className="text-ink-300 font-medium">Teslimat bölgelerimiz:</span>{" "}
            {SERVICE_AREAS.join(" · ")} ve tüm İzmir ilçeleri.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-400">
          <p>
            © {new Date().getFullYear()} Naturel Çiçekçilik. Tüm hakları saklıdır.
          </p>
          <p>Güvenli ödeme · 256-bit SSL · Shopier altyapısı</p>
        </div>
      </div>
    </footer>
  );
}
