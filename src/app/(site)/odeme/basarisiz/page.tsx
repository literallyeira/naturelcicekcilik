import Link from "next/link";
import { AlertCircle } from "lucide-react";

type SP = Promise<{ oid?: string; reason?: string }>;

export const metadata = {
  title: "Ödeme Tamamlanamadı",
};

const REASONS: Record<string, string> = {
  not_configured:
    "Ödeme altyapısı şu an aktif değil. Siparişiniz kaydedildi, kısa süre içinde sizinle iletişime geçeceğiz.",
};

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const { oid, reason } = await searchParams;
  const msg = reason
    ? (REASONS[reason] ?? "Ödeme tamamlanamadı.")
    : "Ödeme tamamlanamadı.";
  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <AlertCircle className="size-16 text-amber-500 mx-auto mb-4" />
      <h1 className="text-3xl font-black tracking-tight text-ink-900">
        Bir sorun oluştu
      </h1>
      <p className="mt-3 text-ink-700">{msg}</p>
      {oid ? (
        <div className="mt-6 inline-block px-5 py-3 bg-cream-50 border border-ink-100 rounded-lg">
          <p className="text-sm text-ink-500">Sipariş Numaranız</p>
          <p className="font-mono font-bold text-ink-900">{oid}</p>
        </div>
      ) : null}
      <div className="mt-10 flex justify-center gap-3">
        <Link
          href="/iletisim"
          className="h-11 px-6 grid place-items-center rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600"
        >
          Bize Ulaşın
        </Link>
        <Link
          href="/"
          className="h-11 px-6 grid place-items-center rounded-full border border-ink-100 hover:border-ink-300 text-ink-700 font-semibold"
        >
          Anasayfa
        </Link>
      </div>
    </div>
  );
}
