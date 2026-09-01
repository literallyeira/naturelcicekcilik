"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw, Sparkles } from "lucide-react";
import {
  MAX_STEMS,
  MIN_STEMS,
  PRESETS,
  describeBouquet,
  priceBouquet,
  stemCount,
  type BouquetCatalog,
  type Selection,
} from "@/lib/bouquet";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { BouquetPreview, FlowerIcon } from "./BouquetArt";
import { CheckoutDialog } from "@/components/product/CheckoutDialog";

const GROUPS: { id: "gul" | "mevsim" | "yesillik"; label: string; hint: string }[] = [
  { id: "gul", label: "Güller", hint: "Buketin yıldızı" },
  { id: "mevsim", label: "Mevsim Çiçekleri", hint: "Renk ve karakter katın" },
  { id: "yesillik", label: "Yeşillik & Dolgu", hint: "Buketi hacimlendirir" },
];

export function BouquetBuilder({
  deliveryHours,
  catalog,
}: {
  deliveryHours: { id: number; timeSlot: string }[];
  catalog: BouquetCatalog;
}) {
  const [selection, setSelection] = useState<Selection>(PRESETS[0].selection);
  const [wrapId, setWrapId] = useState(PRESETS[0].wrapId);
  const [extras, setExtras] = useState<string[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const count = stemCount(selection);
  const pricing = useMemo(
    () => priceBouquet(selection, wrapId, extras, catalog),
    [selection, wrapId, extras, catalog],
  );

  function add(id: string) {
    if (count >= MAX_STEMS) return;
    setSelection((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function remove(id: string) {
    setSelection((prev) => {
      const next = { ...prev };
      const value = (next[id] ?? 0) - 1;
      if (value <= 0) delete next[id];
      else next[id] = value;
      return next;
    });
  }

  function applyPreset(presetId: string) {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelection({ ...preset.selection });
    setWrapId(preset.wrapId);
  }

  function toggleExtra(id: string) {
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  }

  const canOrder = count >= MIN_STEMS;

  return (
    <div className="grid lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
      {/* Önizleme */}
      <div className="lg:sticky lg:top-28 space-y-4">
        <div className="relative rounded-3xl border border-ink-100 bg-gradient-to-b from-cream-50 to-white p-4 shadow-soft overflow-hidden">
          <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 border border-brand-100">
            <Sparkles className="size-3" /> Canlı Önizleme
          </span>
          <BouquetPreview
            selection={selection}
            wrapId={wrapId}
            className="w-full h-auto max-h-[440px]"
          />
        </div>

        <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-500">
              {count} dal çiçek
              {count > 0 ? ` · ${Object.keys(selection).length} çeşit` : ""}
            </span>
            <button
              onClick={() => {
                setSelection({});
                setExtras([]);
              }}
              className="inline-flex items-center gap-1.5 text-ink-500 hover:text-ink-900 transition-colors"
            >
              <RotateCcw className="size-3.5" /> Sıfırla
            </button>
          </div>

          <dl className="mt-4 space-y-1.5 text-sm border-t border-ink-100 pt-4">
            <Row label="Çiçekler" value={formatPrice(pricing.flowersTotal)} />
            <Row
              label={`Ambalaj · ${pricing.wrap.name}`}
              value={formatPrice(pricing.wrapTotal)}
            />
            {pricing.extras.map((e) => (
              <Row key={e.id} label={e.name} value={formatPrice(e.price)} />
            ))}
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-ink-100 pt-4">
            <span className="font-display text-lg text-ink-900">Toplam</span>
            <span className="text-3xl font-semibold text-brand-600 tabular-nums">
              {formatPrice(pricing.total)}
            </span>
          </div>

          <button
            disabled={!canOrder}
            onClick={() => setCheckoutOpen(true)}
            className="mt-4 w-full h-14 rounded-full bg-brand-500 text-white font-semibold uppercase tracking-[0.12em] text-sm disabled:bg-ink-300 disabled:cursor-not-allowed hover:bg-brand-600 shadow-soft hover:shadow-lift transition-all"
          >
            {canOrder ? "Buketimi Sipariş Et" : `En az ${MIN_STEMS} dal seçin`}
          </button>
          <p className="mt-3 text-center text-xs text-ink-500">
            Aynı gün İzmir teslimat · Ustalarımız buketinizi elde hazırlar
          </p>
        </div>
      </div>

      {/* Seçim paneli */}
      <div className="space-y-10 pb-24 lg:pb-0">
        <section>
          <SectionTitle
            step="1"
            title="Hazır bir kombinle başlayın"
            hint="İsterseniz sıfırdan da kurabilirsiniz"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="text-left rounded-2xl border border-ink-100 p-4 hover:border-brand-300 hover:bg-brand-50/40 transition-colors"
              >
                <p className="font-semibold text-ink-900">{p.name}</p>
                <p className="text-xs text-ink-500 mt-0.5">{p.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle
            step="2"
            title="Çiçeklerinizi seçin"
            hint={`${MIN_STEMS}–${MAX_STEMS} dal arası`}
          />
          <div className="space-y-8">
            {GROUPS.map((group) => (
              <div key={group.id}>
                <div className="flex items-baseline gap-3 mb-3">
                  <h3 className="font-display text-lg text-ink-900">
                    {group.label}
                  </h3>
                  <span className="text-xs text-ink-500">{group.hint}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {catalog.flowers.filter((f) => f.group === group.id).map((flower) => {
                    const qty = selection[flower.id] ?? 0;
                    return (
                      <div
                        key={flower.id}
                        className={cn(
                          "rounded-2xl border p-3 transition-all",
                          qty > 0
                            ? "border-brand-400 bg-brand-50/50 shadow-soft"
                            : "border-ink-100 hover:border-ink-300",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => add(flower.id)}
                          disabled={count >= MAX_STEMS}
                          className="w-full text-left disabled:cursor-not-allowed"
                          aria-label={`${flower.name} ekle`}
                        >
                          <div className="aspect-square rounded-xl bg-white grid place-items-center mb-2 overflow-hidden">
                            <FlowerIcon
                              flower={flower}
                              className="size-4/5 transition-transform hover:scale-105"
                            />
                          </div>
                          <p className="text-sm font-medium text-ink-900 leading-tight">
                            {flower.name}
                          </p>
                          <p className="text-[11px] text-ink-500 mt-0.5">
                            {flower.note}
                          </p>
                          <p className="text-sm font-semibold text-brand-600 mt-1">
                            {formatPrice(flower.price)}
                            <span className="text-[11px] font-normal text-ink-500">
                              {" "}
                              / dal
                            </span>
                          </p>
                        </button>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <Stepper
                            onMinus={() => remove(flower.id)}
                            onPlus={() => add(flower.id)}
                            qty={qty}
                            plusDisabled={count >= MAX_STEMS}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {count >= MAX_STEMS ? (
            <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              En fazla {MAX_STEMS} dal seçebilirsiniz. Daha büyük bir aranjman
              için bizi arayın, size özel hazırlayalım.
            </p>
          ) : null}
        </section>

        <section>
          <SectionTitle step="3" title="Ambalajını seçin" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {catalog.wraps.map((w) => (
              <button
                key={w.id}
                onClick={() => setWrapId(w.id)}
                className={cn(
                  "rounded-2xl border p-3 text-left transition-all",
                  wrapId === w.id
                    ? "border-brand-400 bg-brand-50/50 shadow-soft"
                    : "border-ink-100 hover:border-ink-300",
                )}
              >
                <span
                  className="block h-10 rounded-lg mb-2 border border-black/5"
                  style={{
                    background: `linear-gradient(135deg, ${w.color}, ${w.shade})`,
                  }}
                />
                <p className="text-sm font-medium text-ink-900">{w.name}</p>
                <p className="text-[11px] text-ink-500">{w.note}</p>
                <p className="text-sm font-semibold text-brand-600 mt-1">
                  {w.price === 0 ? "Ücretsiz" : formatPrice(w.price)}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle step="4" title="Yanına bir şey ekleyelim mi?" />
          <div className="grid sm:grid-cols-2 gap-3">
            {catalog.extras.map((e) => (
              <label
                key={e.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all",
                  extras.includes(e.id)
                    ? "border-brand-400 bg-brand-50/50"
                    : "border-ink-100 hover:border-ink-300",
                )}
              >
                <input
                  type="checkbox"
                  checked={extras.includes(e.id)}
                  onChange={() => toggleExtra(e.id)}
                  className="size-4 accent-brand-500"
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink-900">
                    {e.name}
                  </span>
                  <span className="block text-[11px] text-ink-500">{e.note}</span>
                </span>
                <span className="text-sm font-semibold text-brand-600">
                  {e.price === 0 ? "Ücretsiz" : formatPrice(e.price)}
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Mobil sabit alt bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-ink-100 px-4 py-3 flex items-center gap-3">
        <div className="leading-tight">
          <p className="text-[11px] text-ink-500">{count} dal</p>
          <p className="text-lg font-semibold text-brand-600 tabular-nums">
            {formatPrice(pricing.total)}
          </p>
        </div>
        <button
          disabled={!canOrder}
          onClick={() => setCheckoutOpen(true)}
          className="ml-auto h-12 px-6 rounded-full bg-brand-500 text-white font-semibold text-sm disabled:bg-ink-300 hover:bg-brand-600 transition-colors"
        >
          {canOrder ? "Sipariş Et" : `En az ${MIN_STEMS} dal`}
        </button>
      </div>

      {checkoutOpen ? (
        <CheckoutDialog
          item={{
            name: "Kendi Tasarladığınız Buket",
            price: pricing.total,
            detail: describeBouquet(selection, wrapId, extras, catalog),
            preview: (
              <BouquetPreview
                selection={selection}
                wrapId={wrapId}
                className="w-full h-full"
              />
            ),
          }}
          endpoint="/api/checkout/custom"
          payload={{ selection, wrapId, extras }}
          deliveryHours={deliveryHours}
          onClose={() => setCheckoutOpen(false)}
        />
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-ink-900 tabular-nums">{value}</dd>
    </div>
  );
}

function SectionTitle({
  step,
  title,
  hint,
}: {
  step: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="size-8 shrink-0 grid place-items-center rounded-full bg-ink-900 text-white text-sm font-semibold">
        {step}
      </span>
      <h2 className="font-display text-xl text-ink-900">{title}</h2>
      {hint ? <span className="text-xs text-ink-500">{hint}</span> : null}
    </div>
  );
}

function Stepper({
  qty,
  onMinus,
  onPlus,
  plusDisabled,
}: {
  qty: number;
  onMinus: () => void;
  onPlus: () => void;
  plusDisabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between w-full rounded-full border border-ink-100 bg-white">
      <button
        type="button"
        onClick={onMinus}
        disabled={qty === 0}
        aria-label="Azalt"
        className="size-8 grid place-items-center rounded-full text-ink-700 disabled:text-ink-300 hover:bg-cream-50 transition-colors"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="text-sm font-semibold tabular-nums text-ink-900">
        {qty}
      </span>
      <button
        type="button"
        onClick={onPlus}
        disabled={plusDisabled}
        aria-label="Artır"
        className="size-8 grid place-items-center rounded-full text-ink-700 disabled:text-ink-300 hover:bg-cream-50 transition-colors"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
