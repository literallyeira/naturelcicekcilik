export const metadata = { title: "Teslimat Bilgileri" };

export default function DeliveryInfoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-black tracking-tight text-ink-900 mb-8">
        Teslimat Bilgileri
      </h1>
      <div className="content text-ink-700 leading-relaxed space-y-4">
        <h2>Teslimat Bölgeleri</h2>
        <p>
          İzmir il merkezi ve tüm ilçelerine aynı gün teslimat hizmeti
          sunulmaktadır. Şehir dışı siparişler için kargo seçeneği mevcuttur.
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
