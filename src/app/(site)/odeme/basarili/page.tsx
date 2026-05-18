import Link from "next/link";
import { CheckCircle } from "lucide-react";

type SP = Promise<{ oid?: string }>;

export const metadata = {
  title: "Ödeme Başarılı",
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const { oid } = await searchParams;
  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <CheckCircle className="size-16 text-brand-500 mx-auto mb-4" />
      <h1 className="text-3xl font-black tracking-tight text-ink-900">
        Siparişiniz alındı
      </h1>
      <p className="mt-3 text-ink-700">
        Ödemeniz alınır alınmaz çiçeğinizi hazırlamaya başlayacağız.
      </p>
      {oid ? (
        <div className="mt-6 inline-block px-5 py-3 bg-brand-50 border border-brand-200 rounded-lg">
          <p className="text-sm text-ink-500">Sipariş Numaranız</p>
          <p className="font-mono font-bold text-ink-900">{oid}</p>
        </div>
      ) : null}
      <div className="mt-10 flex justify-center gap-3">
        <Link
          href="/siparis-takip"
          className="h-11 px-6 grid place-items-center rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600"
        >
          Siparişi Takip Et
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
