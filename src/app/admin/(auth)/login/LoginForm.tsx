"use client";

import { useState } from "react";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Giriş başarısız");
        setLoading(false);
        return;
      }
      window.location.href = "/admin";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bilinmeyen hata");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block">
        <span className="block text-sm font-medium text-ink-700 mb-1.5">
          Kullanıcı Adı
        </span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          className="w-full h-11 rounded-lg border border-ink-100 px-3.5 text-sm focus:border-brand-500 outline-none"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-ink-700 mb-1.5">
          Şifre
        </span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
          required
          className="w-full h-11 rounded-lg border border-ink-100 px-3.5 text-sm focus:border-brand-500 outline-none"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-full bg-brand-500 text-white font-semibold disabled:bg-ink-300 hover:bg-brand-600 transition-colors"
      >
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}
