"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  slug: string | null;
  price: string;
  image: string | null;
  description: string | null;
  isActive: boolean;
  isFeatured: boolean;
  categoryIds: number[];
};

type Cat = { id: number; name: string };

export function ProductForm({
  categories,
  product,
}: {
  categories: Cat[];
  product?: Product;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    price: product?.price ?? "",
    image: product?.image ?? "",
    description: product?.description ?? "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    categoryIds: new Set(product?.categoryIds ?? []),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) { setError(j.error ?? "Yükleme hatası"); return; }
      setForm((f) => ({ ...f, image: j.path }));
    } catch {
      setError("Yükleme hatası");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function toggleCategory(id: number) {
    const next = new Set(form.categoryIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setForm({ ...form, categoryIds: next });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || null,
        price: form.price,
        image: form.image || null,
        description: form.description || null,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        categoryIds: Array.from(form.categoryIds),
      };
      const res = await fetch(
        product
          ? `/api/admin/products/${product.id}`
          : "/api/admin/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const j = await res.json();
      if (!res.ok) {
        setError(j.error ?? "Hata");
        setSubmitting(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!product) return;
    if (!confirm("Bu ürünü silmek istiyor musunuz?")) return;
    setSubmitting(true);
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-ink-100">
      <Field label="Ürün Adı *">
        <input
          required
          className="w-full h-11 rounded-lg border border-ink-100 px-3.5 text-sm"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Slug (url)">
          <input
            className="w-full h-11 rounded-lg border border-ink-100 px-3.5 text-sm"
            value={form.slug}
            placeholder="otomatik üretilir"
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </Field>
        <Field label="Fiyat (TL) *">
          <input
            required
            type="number"
            step="0.01"
            className="w-full h-11 rounded-lg border border-ink-100 px-3.5 text-sm"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Görsel">
        <div className="space-y-2">
          {form.image && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-ink-100">
              <Image
                src={form.image}
                alt="Ürün görseli"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              className="flex-1 h-11 rounded-lg border border-ink-100 px-3.5 text-sm"
              value={form.image}
              placeholder="/products/dosya.png"
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="h-11 px-5 rounded-lg border border-ink-200 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-50 whitespace-nowrap"
            >
              {uploading ? "Yükleniyor..." : "Dosya Seç"}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-xs text-ink-400">JPG, PNG, WEBP — maks 5 MB</p>
        </div>
      </Field>
      <Field label="Açıklama">
        <textarea
          className="w-full min-h-[160px] rounded-lg border border-ink-100 px-3.5 py-2.5 text-sm"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </Field>
      <Field label="Kategoriler">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCategory(c.id)}
              className={`h-9 px-3 rounded-full border text-sm transition-colors ${
                form.categoryIds.has(c.id)
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-ink-100 text-ink-700 hover:border-ink-300"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </Field>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Aktif
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) =>
              setForm({ ...form, isFeatured: e.target.checked })
            }
          />
          Öne Çıkan
        </label>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="h-11 px-7 rounded-full bg-brand-500 text-white font-semibold disabled:bg-ink-300 hover:bg-brand-600"
        >
          {submitting ? "Kaydediliyor..." : product ? "Güncelle" : "Oluştur"}
        </button>
        {product ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={submitting}
            className="h-11 px-5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
          >
            Sil
          </button>
        ) : null}
      </div>
    </form>
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
