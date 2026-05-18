export const metadata = { title: "Mesafeli Satış Sözleşmesi" };

export default function DistanceSalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-black tracking-tight text-ink-900 mb-8">
        Mesafeli Satış Sözleşmesi
      </h1>
      <div className="content text-ink-700 leading-relaxed space-y-4">
        <h2>1. Taraflar</h2>
        <p>
          İşbu sözleşme, bir tarafta Naturel Çiçekçilik ("SATICI") ile diğer
          tarafta www.izmirnaturelcicek.com internet sitesi üzerinden sipariş
          veren tüketici ("ALICI") arasında, aşağıda belirtilen hüküm ve
          koşullar dahilinde elektronik ortamda kurulmuştur.
        </p>
        <h2>2. Konu</h2>
        <p>
          İşbu sözleşmenin konusu, ALICI'nın elektronik ortamda sipariş
          verdiği, aşağıda nitelikleri ve satış fiyatı belirtilen ürünün
          satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin
          Korunması Hakkındaki Kanun ve Mesafeli Sözleşmeler Yönetmeliği
          hükümleri gereğince tarafların hak ve yükümlülüklerinin
          belirlenmesidir.
        </p>
        <h2>3. Cayma Hakkı</h2>
        <p>
          Çiçek ürünleri çabuk bozulabilen niteliklere sahip olduğundan,
          Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi gereği cayma
          hakkının kullanılamayacağı sözleşmeler arasında yer almaktadır.
          ALICI bu hususu kabul, beyan ve taahhüt eder.
        </p>
        <h2>4. Teslimat</h2>
        <p>
          Ürün, ALICI tarafından belirtilen teslimat adresine, seçilen
          teslimat gün ve saat aralığında SATICI tarafından teslim edilir.
        </p>
        <h2>5. Yetkili Mahkeme</h2>
        <p>
          İşbu sözleşmenin uygulanmasından doğan uyuşmazlıklarda T.C.
          Sanayi ve Ticaret Bakanlığı'nca ilan edilen değere kadar Tüketici
          Hakem Heyetleri, aşan durumlarda İzmir Tüketici Mahkemeleri
          yetkilidir.
        </p>
      </div>
    </div>
  );
}
