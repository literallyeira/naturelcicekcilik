# Naturel Çiçekçilik — Next.js

İzmir Naturel Çiçekçilik için Next.js 16 + Prisma 7 + PostgreSQL ile yazılmış
e-ticaret sitesi. Lukani şablon estetiği, Türkçe arayüz, tek-ürün checkout akışı,
Shopier ödeme entegrasyonu, tam donanımlı admin paneli.

## Yapı

| Yol | Açıklama |
|-----|----------|
| `src/app/(site)/` | Halka açık sayfalar — Header/Footer ile |
| `src/app/admin/(auth)/login/` | Yönetici giriş ekranı |
| `src/app/admin/(panel)/` | Korumalı admin sayfaları (dashboard + CRUD) |
| `src/app/api/` | API endpointleri (checkout, shopier callback, admin CRUD) |
| `src/components/` | UI bileşenleri |
| `src/lib/` | DB client, auth, format, Shopier, SEO yardımcıları |
| `prisma/schema.prisma` | Postgres veritabanı şeması |
| `prisma/seed.ts` | Orijinal MySQL dump'ından veri import script'i |
| `public/products/` | 185+ ürün görseli |

## Lokal Geliştirme

```bash
npm install
cp .env.example .env
# .env içindeki DATABASE_URL'i lokal Postgres'inle doldur
# (Lokal Postgres yoksa Neon.tech free tier en kolayı)

npm run db:push     # Şemayı veritabanına uygula
npm run db:seed     # 131 ürün + 7 kategoriyi import et
npm run dev         # http://localhost:3000
```

Admin girişi: `/admin/login`
Default kullanıcı: `admin` / şifre orijinal MySQL dump'taki bcrypt hash.
Bilmiyorsan, seed sonrası `npx prisma studio` ile admin tablosuna
yeni bir bcrypt hash yazabilirsin.

## Vercel Deployment

1. Bu klasörü Git repo'sa push et.
2. [vercel.com](https://vercel.com) → **Add New** → **Project** → repo'yu seç.
3. **Storage** sekmesinden Postgres ekle (Neon entegrasyonu). Vercel
   otomatik olarak `DATABASE_URL` env değişkenini doldurur.
4. **Environment Variables** kısmından şunları ekle:
   - `SESSION_PASSWORD` — `openssl rand -base64 48` ile üret
   - `SHOPIER_API_KEY`, `SHOPIER_API_SECRET`, `SHOPIER_WEBSITE_INDEX` — Shopier panelinden
   - `NEXT_PUBLIC_SITE_URL` — `https://senin-domain.com`
5. Deploy et.
6. İlk deploy sonrası lokal'den:
   ```bash
   vercel env pull .env.production.local
   DATABASE_URL=... npx prisma db push
   DATABASE_URL=... npm run db:seed
   ```

## Shopier Entegrasyonu

`SHOPIER_*` değişkenleri boşken sipariş veritabanına kaydedilir ama
ödeme sayfasına yönlendirme yapılmaz — kullanıcıya "ödeme şu an
alınamıyor, sizi arayacağız" mesajı gösterilir. Credentials eklenince
otomatik olarak Shopier'e POST edilen form çalışmaya başlar.

Webhook URL'si Shopier paneline girilirken:
```
https://senin-domain.com/api/shopier/callback
```

## Özellikler

- Lukani-vari minimalist tasarım (Tailwind 4)
- 4 adımlı sipariş akışı (gönderici / alıcı / teslimat / özet)
- Admin: ürün CRUD, kategori CRUD, sipariş yönetimi, teslimat saatleri, KDV ayarı
- Sipariş takip sayfası (merchant_oid ile)
- ISR ile anasayfa / kategori / ürün sayfaları
- Tüm görseller `next/image` ile otomatik optimize
- SEO: dinamik sitemap.xml, robots.txt, JSON-LD Florist schema
- Sessions: iron-session (cookie-based, signed)
- Admin auth: bcrypt (PHP `$2y$` hash'leriyle uyumlu)

## Senaryolar

- **Yeni ürün eklemek**: Admin → Ürünler → "+ Yeni Ürün". Görsel
  yolunu `/products/dosya.png` formatında ver; resmi public/products/
  altına el ile koyman gerekir (veya Vercel Blob entegrasyonu ekle).
- **Sipariş durumunu değiştirmek**: Admin → Siparişler → Detay → üst
  sağdaki iki dropdown.
- **KDV gizlemek/açmak**: Admin → Ayarlar → "Fiyatlara KDV dahil" checkbox.
