export const metadata = { title: "Sıkça Sorulan Sorular" };

const FAQS = [
  {
    q: "Siparişimi ne kadar sürede teslim alırım?",
    a: "İzmir içi siparişler, seçtiğiniz teslimat saati aralığında aynı gün teslim edilir. Şehir dışı için kargo süresi 1-2 iş günüdür.",
  },
  {
    q: "Çiçeklerim ne kadar dayanır?",
    a: "Doğru bakım koşullarında (su değişimi, doğrudan güneşten uzak tutma) buketlerimiz 5-7 gün, saksı çiçekleri ise haftalarca canlı kalır.",
  },
  {
    q: "Hangi ödeme yöntemleri kabul ediliyor?",
    a: "Tüm kredi/banka kartları ile Shopier güvenli ödeme altyapısı üzerinden ödeme yapabilirsiniz.",
  },
  {
    q: "Anonim sipariş gönderebilir miyim?",
    a: "Evet. Sipariş esnasında 'Anonim Gönder' seçeneğini işaretlerseniz alıcıya gönderici bilginiz iletilmez.",
  },
  {
    q: "İade ve iptal politikası nedir?",
    a: "Çiçek ürünleri çabuk bozulan nitelikte olduğundan iade kabul edilmemektedir. Detaylı bilgi için İptal/İade sayfamızı inceleyin.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight text-ink-900 mb-10">
        Sıkça Sorulan Sorular
      </h1>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <details
            key={i}
            className="group border border-ink-100 rounded-xl px-5 py-4 hover:border-ink-300 transition-colors"
          >
            <summary className="cursor-pointer font-semibold text-ink-900 list-none flex justify-between items-center">
              {f.q}
              <span className="text-brand-600 ml-4 group-open:rotate-45 transition-transform text-xl">
                +
              </span>
            </summary>
            <p className="mt-3 text-ink-700 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
