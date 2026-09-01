import { pageMetadata } from "@/lib/seo";
import { PHONE_HREF, PHONE_INTL_DISPLAY } from "@/lib/site";

export const metadata = pageMetadata({
  title: "İptal / İade Politikası",
  description:
    "Naturel Çiçekçilik sipariş iptali, iade ve ücretsiz değişim koşulları.",
  path: "/iptal-iade",
});

export default function CancelReturnPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-4xl text-ink-900 mb-8">
        İptal / İade Politikası
      </h1>
      <div className="content text-ink-600 leading-relaxed space-y-4">
        <h2>Sipariş İptali</h2>
        <p>
          Sipariş verdikten sonra çiçek hazırlık aşamasına alınmamışsa
          (genelde sipariş onayından sonraki ilk 1 saat içinde) iptal talebi
          kabul edilebilir. Lütfen iptal talepleriniz için en kısa sürede{" "}
          <a href={PHONE_HREF} className="text-brand-600 underline underline-offset-4">
            {PHONE_INTL_DISPLAY}
          </a>{" "}
          numaralı telefondan bize ulaşın.
        </p>
        <h2>İade</h2>
        <p>
          Çiçek ürünleri çabuk bozulan ürünler olduğundan, teslimat sonrası
          iade kabul edilmemektedir. Ancak teslim aldığınız ürünün siparişe
          uygun olmaması veya hasarlı olması durumunda, fotoğraflı bildirim
          ile ücretsiz değişim talep edebilirsiniz.
        </p>
        <h2>İade Süreci</h2>
        <ul>
          <li>Teslim aldıktan sonra en geç 2 saat içinde bize ulaşın</li>
          <li>Ürün fotoğraflarını paylaşın</li>
          <li>Onayımız sonrası ücretsiz değişim yapılır</li>
        </ul>
      </div>
    </div>
  );
}
