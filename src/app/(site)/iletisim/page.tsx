import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = { title: "İletişim" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight text-ink-900 mb-2">
        İletişim
      </h1>
      <p className="text-ink-500 mb-10">
        Sorularınız için bize ulaşmaktan çekinmeyin.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <InfoBlock
            icon={<MapPin className="size-5" />}
            title="Adres"
            value="Bayraklı, İzmir"
          />
          <InfoBlock
            icon={<Phone className="size-5" />}
            title="Telefon"
            value={<a href="tel:+905555555555">+90 555 555 55 55</a>}
          />
          <InfoBlock
            icon={<Mail className="size-5" />}
            title="E-posta"
            value={
              <a href="mailto:info@izmirnaturelcicek.com">
                info@izmirnaturelcicek.com
              </a>
            }
          />
          <InfoBlock
            icon={<Clock className="size-5" />}
            title="Çalışma Saatleri"
            value="7/24 sipariş kabul edilir"
          />
        </div>

        <form className="space-y-3 bg-cream-50 p-6 rounded-xl border border-ink-100">
          <h2 className="font-bold text-ink-900 mb-2">Bize yazın</h2>
          <input
            placeholder="Adınız"
            className="w-full h-11 rounded-lg border border-ink-100 px-3.5 text-sm bg-white"
          />
          <input
            type="email"
            placeholder="E-posta"
            className="w-full h-11 rounded-lg border border-ink-100 px-3.5 text-sm bg-white"
          />
          <input
            placeholder="Konu"
            className="w-full h-11 rounded-lg border border-ink-100 px-3.5 text-sm bg-white"
          />
          <textarea
            placeholder="Mesajınız..."
            className="w-full min-h-[140px] rounded-lg border border-ink-100 px-3.5 py-2.5 text-sm bg-white"
          />
          <button
            type="button"
            className="h-11 px-7 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
          >
            Gönder
          </button>
          <p className="text-xs text-ink-500">
            Form gönderimi yakında aktif olacaktır. Şimdilik lütfen telefon
            veya e-posta ile ulaşın.
          </p>
        </form>
      </div>
    </div>
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
      <div className="size-11 grid place-items-center rounded-full bg-brand-50 text-brand-600 shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="text-ink-700">{value}</p>
      </div>
    </div>
  );
}
