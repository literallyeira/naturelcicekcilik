import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Teslimat Bilgileri — İzmir Aynı Gün Çiçek Teslimatı",
  description:
    "İzmir'in tüm ilçelerine aynı gün çiçek teslimatı. Teslimat saatleri, ücretsiz kargo koşulları ve teslimat süreci hakkında bilmeniz gerekenler.",
  path: "/teslimat-bilgileri",
});

export default function DeliveryInfoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-4xl text-ink-900 mb-8">
        Teslimat Bilgileri
      </h1>
      <div className="content text-ink-600 leading-relaxed space-y-4">
        <h2>Teslimat Bölgeleri</h2>
        <p>
          İzmir il merkezi ve tüm ilçelerine aynı gün teslimat hizmeti
          sunulmaktadır. Şehir dışı siparişler için kargo seçeneği mevcuttur.{" "}
          <Link
            href="/izmir-cicekci"
            className="text-brand-600 underline underline-offset-4"
          >
            İlçe bazlı teslimat sürelerini
          </Link>{" "}
          inceleyebilirsiniz.
        </p>
        <h2>Teslimat Saatleri</h2>
        <ul>
          <li>09:00 - 12:00</li>
          <li>12:00 - 15:00</li>
          <li>15:00 - 18:00</li>
          <li>10:00 - 20:00 (esnek)</li>
        </ul>
        <h2>Teslimat Ücretleri</h2>
        <p>
          500 TL ve üzeri siparişlerde İzmir içi teslimat ücretsizdir.
          500 TL altındaki siparişler için 50 TL teslimat ücreti
          uygulanır.
        </p>
        <h2>Alıcıya Ulaşılamadığında</h2>
        <p>
          Teslimat anında alıcıya ulaşılamadığında, gönderici ile iletişime
          geçilir ve siparişin akıbeti hakkında ortak karar verilir. Ürün
          komşu / kapıcıya bırakılmaz.
        </p>
      </div>
    </div>
  );
}
