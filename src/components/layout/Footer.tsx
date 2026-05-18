import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2H21l-6.52 7.452L22 22h-6.78l-5.31-6.94L3.8 22H1l7.02-8.03L1 2h6.94l4.8 6.34L18.24 2Zm-1.19 18h1.83L7.06 4H5.1l11.95 16Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-100 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex flex-col leading-none">
            <span
              className="text-[22px] font-medium tracking-wide text-white"
              style={{ fontFamily: "var(--font-logo)", fontStyle: "italic" }}
            >
              Naturel
            </span>
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400"
              style={{ fontFamily: "var(--font-logo)" }}
            >
              Çiçekçilik
            </span>
          </div>
          <p className="mt-4 text-sm text-ink-300 leading-relaxed">
            İzmir'de 7/24 taze çiçek teslimatı. Her özel anınız için özenle
            hazırlanmış buketler, aranjmanlar ve daha fazlası.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a
              href="#"
              aria-label="Facebook"
              className="size-9 grid place-items-center rounded-full bg-white/10 hover:bg-brand-500 transition-colors"
            >
              <FacebookIcon className="size-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="size-9 grid place-items-center rounded-full bg-white/10 hover:bg-brand-500 transition-colors"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="size-9 grid place-items-center rounded-full bg-white/10 hover:bg-brand-500 transition-colors"
            >
              <TwitterIcon className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Kurumsal
          </h3>
          <ul className="space-y-2 text-sm text-ink-300">
            <li>
              <Link href="/hakkimizda" className="hover:text-white">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-white">
                İletişim
              </Link>
            </li>
            <li>
              <Link href="/sss" className="hover:text-white">
                Sıkça Sorulan Sorular
              </Link>
            </li>
            <li>
              <Link href="/siparis-takip" className="hover:text-white">
                Sipariş Takibi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Yardım
          </h3>
          <ul className="space-y-2 text-sm text-ink-300">
            <li>
              <Link
                href="/mesafeli-satis-sozlesmesi"
                className="hover:text-white"
              >
                Mesafeli Satış Sözleşmesi
              </Link>
            </li>
            <li>
              <Link href="/iptal-iade" className="hover:text-white">
                İptal / İade Politikası
              </Link>
            </li>
            <li>
              <Link href="/teslimat-bilgileri" className="hover:text-white">
                Teslimat Bilgileri
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
            İletişim
          </h3>
          <ul className="space-y-3 text-sm text-ink-300">
            <li className="flex gap-3">
              <MapPin className="size-4 mt-0.5 text-brand-400 shrink-0" />
              <span>Bayraklı, İzmir</span>
            </li>
            <li className="flex gap-3">
              <Phone className="size-4 mt-0.5 text-brand-400 shrink-0" />
              <a href="tel:+905555555555" className="hover:text-white">
                +90 555 555 55 55
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="size-4 mt-0.5 text-brand-400 shrink-0" />
              <a
                href="mailto:info@izmirnaturelcicek.com"
                className="hover:text-white"
              >
                info@izmirnaturelcicek.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-300">
          <p>
            © {new Date().getFullYear()} Naturel Çiçekçilik. Tüm hakları
            saklıdır.
          </p>
          <p>Güvenli ödeme · 256-bit SSL · Shopier altyapısı</p>
        </div>
      </div>
    </footer>
  );
}
