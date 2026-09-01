import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import {
  ADDRESS,
  EMAIL,
  EMAIL_HREF,
  PHONE_HREF,
  PHONE_INTL_DISPLAY,
  SERVICE_AREAS,
  whatsappLink,
} from "@/lib/site";

export const metadata = pageMetadata({
  title: "İletişim — İzmir Çiçekçi",
  description: `Naturel Çiçekçilik iletişim: ${PHONE_INTL_DISPLAY}, ${ADDRESS.full}. 7/24 sipariş, aynı gün İzmir teslimat.`,
  path: "/iletisim",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "İletişim", path: "/iletisim" },
        ])}
      />
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="font-display text-4xl md:text-5xl text-ink-900 mb-3">
          İletişim
        </h1>
        <p className="text-ink-600 mb-10 max-w-xl">
          Siparişleriniz, özel tasarım talepleriniz ve kurumsal çiçek
          organizasyonlarınız için 7/24 ulaşabilirsiniz.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-5">
            <InfoBlock
              icon={<Phone className="size-5" />}
              title="Telefon"
              value={
                <a href={PHONE_HREF} className="hover:text-brand-600">
                  {PHONE_INTL_DISPLAY}
                </a>
              }
            />
            <InfoBlock
              icon={<MessageCircle className="size-5" />}
              title="WhatsApp"
              value={
                <a
                  href={whatsappLink(
                    "Merhaba, çiçek siparişi hakkında bilgi almak istiyorum.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600"
                >
                  Hemen mesaj gönderin
                </a>
              }
            />
            <InfoBlock
              icon={<MapPin className="size-5" />}
              title="Adres"
              value={ADDRESS.full}
            />
            <InfoBlock
              icon={<Mail className="size-5" />}
              title="E-posta"
              value={
                <a href={EMAIL_HREF} className="hover:text-brand-600">
                  {EMAIL}
                </a>
              }
            />
            <InfoBlock
              icon={<Clock className="size-5" />}
              title="Çalışma Saatleri"
              value="Her gün 7/24 sipariş kabul edilir"
            />
          </div>

          <div className="rounded-3xl border border-ink-100 bg-cream-50 p-8">
            <h2 className="font-display text-2xl text-ink-900">
              En hızlı yol: telefon
            </h2>
            <p className="mt-3 text-ink-600 leading-relaxed">
              Aynı gün teslimat, özel tasarım buket veya kurumsal sipariş için
              bizi doğrudan aramanız en hızlı çözümdür. Talebinizi dinleyip
              bütçenize uygun seçenekleri hemen sunuyoruz.
            </p>
            <a
              href={PHONE_HREF}
              className="mt-6 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
            >
              <Phone className="size-4" /> {PHONE_INTL_DISPLAY}
            </a>

            <div className="mt-8 pt-6 border-t border-ink-200">
              <h3 className="font-semibold text-ink-900 mb-2">
                Teslimat bölgelerimiz
              </h3>
              <p className="text-sm text-ink-600 leading-relaxed">
                {SERVICE_AREAS.join(" · ")} ve tüm İzmir ilçeleri.{" "}
                <Link
                  href="/izmir-cicekci"
                  className="text-brand-600 underline underline-offset-4"
                >
                  İlçe bazlı teslimat sürelerini görün
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoBlock({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="size-11 grid place-items-center rounded-full bg-brand-50 text-brand-600 border border-brand-100 shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="text-ink-600">{value}</p>
      </div>
    </div>
  );
}
