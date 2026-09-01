import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { PHONE_HREF, PHONE_INTL_DISPLAY } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Sıkça Sorulan Sorular",
  description:
    "İzmir çiçek siparişi hakkında merak edilenler: teslimat süresi, aynı gün gönderim, ödeme yöntemleri, anonim sipariş ve iade koşulları.",
  path: "/sss",
});

const FAQS = [
  {
    q: "Siparişimi ne kadar sürede teslim alırım?",
    a: "İzmir içi siparişler, seçtiğiniz teslimat saati aralığında aynı gün teslim edilir. Bayraklı ve çevresine 1-3 saat içinde ulaşabiliyoruz. Şehir dışı için kargo süresi 1-2 iş günüdür.",
  },
  {
    q: "Aynı gün teslimat için en geç ne zaman sipariş vermeliyim?",
    a: "Aynı gün teslimat için siparişinizi saat 16:00'ya kadar vermenizi öneririz. Daha geç saatlerdeki siparişler için bizi arayarak teyit alabilirsiniz.",
  },
  {
    q: "Kendi buketimi kendim tasarlayabilir miyim?",
    a: "Evet. 'Kendi Buketini Yap' sayfasından çiçekleri tek tek seçip ambalajını belirleyebilir, buketinizi ekranda görebilir ve fiyatını anında hesaplayabilirsiniz.",
  },
  {
    q: "Çiçeklerim ne kadar dayanır?",
    a: "Doğru bakım koşullarında (düzenli su değişimi, doğrudan güneşten uzak tutma) buketlerimiz 5-7 gün, saksı çiçekleri ise haftalarca canlı kalır.",
  },
  {
    q: "Hangi ödeme yöntemleri kabul ediliyor?",
    a: "Tüm kredi ve banka kartları ile Shopier güvenli ödeme altyapısı üzerinden ödeme yapabilirsiniz. Havale/EFT ile ödeme de mümkündür.",
  },
  {
    q: "Anonim sipariş gönderebilir miyim?",
    a: "Evet. Sipariş esnasında 'Anonim Gönder' seçeneğini işaretlerseniz alıcıya gönderici bilginiz iletilmez.",
  },
  {
    q: "İzmir'in hangi ilçelerine teslimat yapıyorsunuz?",
    a: "Bayraklı, Karşıyaka, Bornova, Konak, Çiğli, Buca, Gaziemir, Balçova, Narlıdere, Güzelbahçe başta olmak üzere İzmir'in tüm ilçelerine teslimat yapıyoruz.",
  },
  {
    q: "İade ve iptal politikası nedir?",
    a: "Çiçek ürünleri çabuk bozulan nitelikte olduğundan iade kabul edilmemektedir. Teslimat öncesi iptal talepleriniz için bizimle iletişime geçin.",
  },
];

export default function FAQPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <div className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-display text-4xl md:text-5xl text-ink-900 mb-3">
          Sıkça Sorulan Sorular
        </h1>
        <p className="text-ink-600 mb-10">
          Aradığınız cevabı bulamazsanız{" "}
          <a href={PHONE_HREF} className="text-brand-600 underline underline-offset-4">
            {PHONE_INTL_DISPLAY}
          </a>{" "}
          numarasından bize ulaşabilirsiniz.
        </p>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group border border-ink-100 rounded-2xl px-5 py-4 hover:border-ink-300 transition-colors"
            >
              <summary className="cursor-pointer font-semibold text-ink-900 list-none flex justify-between items-center gap-4">
                {f.q}
                <span className="text-brand-600 text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-sm text-ink-500">
          Ne göndereceğinize karar veremediniz mi?{" "}
          <Link href="/buket-yap" className="text-brand-600 underline underline-offset-4">
            Kendi buketinizi tasarlayın
          </Link>
          .
        </p>
      </div>
    </>
  );
}
