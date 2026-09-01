"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Check, ChevronLeft } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { whatsappLink } from "@/lib/site";

type DeliveryHour = { id: number; timeSlot: string };

export type CheckoutItem = {
  name: string;
  price: string | number;
  image?: string | null;
  preview?: React.ReactNode;
  detail?: string;
};

type Props = {
  item: CheckoutItem;
  endpoint: string;
  payload: Record<string, unknown>;
  deliveryHours: DeliveryHour[];
  onClose: () => void;
};

type FormData = {
  senderName: string;
  senderSurname: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  recipientName: string;
  recipientSurname: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  district: string;
  deliveryDay: string;
  deliveryHour: string;
  note: string;
  isAnonymous: boolean;
  acceptTerms: boolean;
};

const EMPTY: FormData = {
  senderName: "",
  senderSurname: "",
  senderPhone: "",
  senderEmail: "",
  senderAddress: "",
  recipientName: "",
  recipientSurname: "",
  recipientPhone: "",
  recipientAddress: "",
  recipientCity: "İzmir",
  district: "",
  deliveryDay: "",
  deliveryHour: "",
  note: "",
  isAnonymous: false,
  acceptTerms: false,
};

const STEPS = ["Gönderici", "Alıcı", "Teslimat", "Özet"];

export function CheckoutDialog({
  item,
  endpoint,
  payload,
  deliveryHours,
  onClose,
}: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ orderId: string; total: number } | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function canAdvance(): boolean {
    if (step === 0) {
      return Boolean(
        data.senderName &&
          data.senderSurname &&
          data.senderPhone &&
          data.senderEmail,
      );
    }
    if (step === 1) {
      return Boolean(
        data.recipientName &&
          data.recipientSurname &&
          data.recipientPhone &&
          data.recipientAddress &&
          data.recipientCity &&
          data.district,
      );
    }
    if (step === 2) {
      return Boolean(data.deliveryDay && data.deliveryHour);
    }
    return data.acceptTerms;
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, ...data }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Bir hata oluştu");
        setSubmitting(false);
        return;
      }
      if (json.bankTransfer) {
        setDone({ orderId: json.orderId, total: json.totalAmount });
        return;
      }
      if (json.paymentUrl) {
        window.location.href = json.paymentUrl;
        return;
      }
      if (json.paymentForm) {
        document.open();
        document.write(json.paymentForm);
        document.close();
        return;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bilinmeyen hata");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Shell onClose={onClose}>
        <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-8 space-y-6 text-center">
          <div className="size-16 rounded-full bg-brand-50 grid place-items-center mx-auto">
            <Check className="size-8 text-brand-600" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink-900">
              Siparişiniz Alındı
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              Sipariş No:{" "}
              <span className="font-mono font-semibold text-ink-700">
                {done.orderId}
              </span>
            </p>
          </div>
          <div className="bg-cream-50 rounded-2xl p-5 text-left space-y-3 border border-ink-100">
            <p className="text-sm font-semibold text-ink-700">
              Havale / EFT Bilgileri
            </p>
            <div className="space-y-1 text-sm text-ink-900">
              <p>
                <span className="text-ink-500">Ad Soyad:</span> Muratcan Kıyanç
              </p>
              <p>
                <span className="text-ink-500">IBAN:</span>
              </p>
              <p className="font-mono font-semibold tracking-wider text-base">
                TR14 0004 6003 5088 8000 2527 27
              </p>
              <p>
                <span className="text-ink-500">Tutar:</span>{" "}
                <span className="font-bold text-brand-600">
                  {formatPrice(done.total)}
                </span>
              </p>
            </div>
          </div>
          <p className="text-sm text-ink-500">
            Havalenizi yaptıktan sonra dekontu WhatsApp ile gönderin, siparişiniz
            hemen onaylanacak.
          </p>
          <a
            href={whatsappLink(
              `Merhaba! ${done.orderId} numaralı siparişim için ${done.total} ₺ havale yaptım. Dekont ektedir.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-12 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe5d] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.526 5.847L.057 23.885c-.07.35.234.655.583.583l6.038-1.469A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-4.997-1.368l-.357-.213-3.705.901.917-3.706-.234-.372A9.797 9.797 0 012.182 12C2.182 6.565 6.565 2.182 12 2.182S21.818 6.565 21.818 12 17.435 21.818 12 21.818z" />
            </svg>
            WhatsApp&apos;tan Dekont Gönder
          </a>
          <button
            onClick={onClose}
            className="text-sm text-ink-500 hover:text-ink-900"
          >
            Kapat
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell onClose={onClose}>
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <header className="flex items-center justify-between p-5 border-b border-ink-100">
          <div className="flex items-center gap-3">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="size-9 grid place-items-center rounded-full hover:bg-cream-50"
                aria-label="Geri"
              >
                <ChevronLeft className="size-4" />
              </button>
            ) : null}
            <h2 className="font-display text-xl text-ink-900">
              Sipariş — {STEPS[step]}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="size-9 grid place-items-center rounded-full hover:bg-cream-50"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex items-center gap-2 px-5 py-4 border-b border-ink-100 overflow-x-auto">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "size-7 grid place-items-center rounded-full text-xs font-bold transition-colors",
                  i < step
                    ? "bg-brand-500 text-white"
                    : i === step
                      ? "bg-ink-900 text-white"
                      : "bg-cream-100 text-ink-500",
                )}
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs",
                  i === step ? "font-semibold text-ink-900" : "text-ink-500",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 ? (
                <div className="w-6 h-px bg-ink-100" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="overflow-y-auto p-5 flex-1">
          {step === 0 ? <StepSender data={data} update={update} /> : null}
          {step === 1 ? <StepRecipient data={data} update={update} /> : null}
          {step === 2 ? (
            <StepDelivery
              data={data}
              update={update}
              deliveryHours={deliveryHours}
            />
          ) : null}
          {step === 3 ? (
            <StepSummary data={data} item={item} update={update} />
          ) : null}
        </div>

        {error ? (
          <div className="px-5 pb-3 text-sm text-red-600">{error}</div>
        ) : null}

        <footer className="p-5 border-t border-ink-100 flex items-center justify-between gap-4">
          <div className="text-sm text-ink-500">
            Toplam:{" "}
            <span className="font-bold text-ink-900 text-lg">
              {formatPrice(item.price)}
            </span>
          </div>
          {step < STEPS.length - 1 ? (
            <button
              disabled={!canAdvance()}
              onClick={() => setStep((s) => s + 1)}
              className="h-11 px-7 rounded-full bg-ink-900 text-white font-semibold disabled:bg-ink-300 disabled:cursor-not-allowed hover:bg-ink-700 transition-colors"
            >
              Devam Et
            </button>
          ) : (
            <button
              disabled={!canAdvance() || submitting}
              onClick={submit}
              className="h-11 px-7 rounded-full bg-brand-500 text-white font-semibold disabled:bg-ink-300 disabled:cursor-not-allowed hover:bg-brand-600 transition-colors"
            >
              {submitting ? "İşleniyor..." : "Siparişi Tamamla"}
            </button>
          )}
        </footer>
      </div>
    </Shell>
  );
}

function Shell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm grid place-items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="contents" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink-700 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-11 rounded-xl border border-ink-100 px-3.5 text-sm bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all";
const textareaCls =
  "w-full min-h-[88px] rounded-xl border border-ink-100 px-3.5 py-2.5 text-sm bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-y";

type StepProps = {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
};

function StepSender({ data, update }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="Adınız *">
        <input
          className={inputCls}
          value={data.senderName}
          onChange={(e) => update("senderName", e.target.value)}
        />
      </Field>
      <Field label="Soyadınız *">
        <input
          className={inputCls}
          value={data.senderSurname}
          onChange={(e) => update("senderSurname", e.target.value)}
        />
      </Field>
      <Field label="Telefon *">
        <input
          className={inputCls}
          type="tel"
          placeholder="0555 535 62 86"
          value={data.senderPhone}
          onChange={(e) => update("senderPhone", e.target.value)}
        />
      </Field>
      <Field label="E-posta *">
        <input
          className={inputCls}
          type="email"
          value={data.senderEmail}
          onChange={(e) => update("senderEmail", e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Adresiniz (fatura için)">
          <textarea
            className={textareaCls}
            value={data.senderAddress}
            onChange={(e) => update("senderAddress", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}

function StepRecipient({ data, update }: StepProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="Alıcı Adı *">
        <input
          className={inputCls}
          value={data.recipientName}
          onChange={(e) => update("recipientName", e.target.value)}
        />
      </Field>
      <Field label="Alıcı Soyadı *">
        <input
          className={inputCls}
          value={data.recipientSurname}
          onChange={(e) => update("recipientSurname", e.target.value)}
        />
      </Field>
      <Field label="Alıcı Telefon *">
        <input
          className={inputCls}
          type="tel"
          value={data.recipientPhone}
          onChange={(e) => update("recipientPhone", e.target.value)}
        />
      </Field>
      <Field label="İl *">
        <input
          className={inputCls}
          value={data.recipientCity}
          onChange={(e) => update("recipientCity", e.target.value)}
        />
      </Field>
      <Field label="İlçe *">
        <input
          className={inputCls}
          value={data.district}
          onChange={(e) => update("district", e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Teslimat Adresi *">
          <textarea
            className={textareaCls}
            value={data.recipientAddress}
            onChange={(e) => update("recipientAddress", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}

function StepDelivery({
  data,
  update,
  deliveryHours,
}: StepProps & { deliveryHours: DeliveryHour[] }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="space-y-4">
      <Field label="Teslimat Tarihi *">
        <input
          type="date"
          min={today}
          className={inputCls}
          value={data.deliveryDay}
          onChange={(e) => update("deliveryDay", e.target.value)}
        />
      </Field>
      <div>
        <span className="block text-sm font-medium text-ink-700 mb-2">
          Teslimat Saati *
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {deliveryHours.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => update("deliveryHour", h.timeSlot)}
              className={cn(
                "h-11 rounded-xl border text-sm font-medium transition-colors",
                data.deliveryHour === h.timeSlot
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-ink-100 text-ink-700 hover:border-ink-300",
              )}
            >
              {h.timeSlot}
            </button>
          ))}
        </div>
      </div>
      <Field label="Karta Not (opsiyonel)">
        <textarea
          className={textareaCls}
          placeholder="Sevdiğiniz kişiye iletmek istediğiniz mesajı yazın..."
          value={data.note}
          onChange={(e) => update("note", e.target.value)}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
        <input
          type="checkbox"
          checked={data.isAnonymous}
          onChange={(e) => update("isAnonymous", e.target.checked)}
          className="size-4 accent-brand-500"
        />
        Anonim gönder (alıcı gönderici bilgisini görmesin)
      </label>
    </div>
  );
}

function StepSummary({
  data,
  item,
  update,
}: StepProps & { item: CheckoutItem }) {
  return (
    <div className="space-y-5">
      <div className="flex gap-4 border border-ink-100 rounded-2xl p-4">
        {item.preview ? (
          <div className="size-24 shrink-0 bg-cream-50 rounded-xl overflow-hidden grid place-items-center">
            {item.preview}
          </div>
        ) : item.image ? (
          <div className="relative size-24 shrink-0 bg-cream-50 rounded-xl overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="flex-1">
          <h3 className="font-semibold text-ink-900">{item.name}</h3>
          {item.detail ? (
            <p className="text-xs text-ink-500 mt-1 whitespace-pre-line leading-relaxed">
              {item.detail}
            </p>
          ) : null}
          <p className="text-brand-600 font-bold text-lg mt-1">
            {formatPrice(item.price)}
          </p>
        </div>
      </div>

      <SummaryRow
        title="Alıcı"
        lines={[
          `${data.recipientName} ${data.recipientSurname}`,
          data.recipientPhone,
          `${data.recipientAddress}`,
          `${data.district} / ${data.recipientCity}`,
        ]}
      />

      <SummaryRow
        title="Teslimat"
        lines={[
          new Date(data.deliveryDay).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            weekday: "long",
          }),
          data.deliveryHour,
          data.note ? `Not: ${data.note}` : undefined,
        ]}
      />

      <label className="flex items-start gap-2 text-sm text-ink-700 cursor-pointer pt-2 border-t border-ink-100">
        <input
          type="checkbox"
          checked={data.acceptTerms}
          onChange={(e) => update("acceptTerms", e.target.checked)}
          className="size-4 mt-0.5 accent-brand-500"
        />
        <span>
          <a
            href="/mesafeli-satis-sozlesmesi"
            target="_blank"
            className="text-brand-600 underline"
          >
            Mesafeli Satış Sözleşmesi
          </a>
          &apos;ni ve{" "}
          <a
            href="/iptal-iade"
            target="_blank"
            className="text-brand-600 underline"
          >
            İptal/İade Politikası
          </a>
          &apos;nı okudum, onaylıyorum.
        </span>
      </label>
    </div>
  );
}

function SummaryRow({
  title,
  lines,
}: {
  title: string;
  lines: (string | undefined)[];
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold mb-1">
        {title}
      </p>
      <div className="text-sm text-ink-900 space-y-0.5">
        {lines.filter(Boolean).map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </div>
  );
}
