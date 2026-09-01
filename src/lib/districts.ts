export type District = {
  slug: string;
  name: string;
  /** Sayfa girişinde kullanılan kısa tanıtım */
  intro: string;
  /** Bilinen semtler / mahalleler — yerel aramalar için */
  areas: string[];
  /** Teslimat süresi vaadi */
  eta: string;
};

export const DISTRICTS: District[] = [
  {
    slug: "bayrakli",
    name: "Bayraklı",
    intro:
      "Atölyemiz Bayraklı'da. Bu yüzden Bayraklı'ya çiçek siparişleriniz genellikle birkaç saat içinde, en taze haliyle teslim edilir.",
    areas: ["Adalet", "Manavkuyu", "Onur", "Bostanlı sınırı", "Salhane", "Turan"],
    eta: "1-3 saat içinde",
  },
  {
    slug: "karsiyaka",
    name: "Karşıyaka",
    intro:
      "Karşıyaka'nın her noktasına — Bostanlı'dan Çarşı'ya, Mavişehir'den Alaybey'e — aynı gün çiçek teslimatı yapıyoruz.",
    areas: ["Bostanlı", "Mavişehir", "Alaybey", "Çarşı", "Donanmacı", "Şemikler"],
    eta: "2-4 saat içinde",
  },
  {
    slug: "bornova",
    name: "Bornova",
    intro:
      "Ege Üniversitesi kampüsünden Kazımdirik'e, Evka sitelerinden Bornova Merkez'e kadar tüm Bornova'ya çiçek gönderiyoruz.",
    areas: ["Kazımdirik", "Evka 3", "Erzene", "Merkez", "Çamdibi", "Ergene"],
    eta: "2-4 saat içinde",
  },
  {
    slug: "konak",
    name: "Konak",
    intro:
      "Alsancak, Kordon, Basmane ve Konak Meydanı çevresine hızlı ve özenli çiçek teslimatı.",
    areas: ["Alsancak", "Kordon", "Basmane", "Göztepe", "Güzelyalı", "Hatay"],
    eta: "2-4 saat içinde",
  },
  {
    slug: "cigli",
    name: "Çiğli",
    intro:
      "Ataşehir, Balatçık ve Çiğli Merkez başta olmak üzere tüm Çiğli'ye aynı gün çiçek siparişi.",
    areas: ["Ataşehir", "Balatçık", "Küçük Çiğli", "Büyük Çiğli", "Egekent"],
    eta: "3-5 saat içinde",
  },
  {
    slug: "buca",
    name: "Buca",
    intro:
      "Buca'nın tüm mahallelerine — Şirinyer, Tınaztepe, Kaynaklar hattına — taze çiçek teslimatı.",
    areas: ["Şirinyer", "Tınaztepe", "Adatepe", "Kuruçeşme", "Yıldız"],
    eta: "3-5 saat içinde",
  },
  {
    slug: "gaziemir",
    name: "Gaziemir",
    intro:
      "Sarnıç, Atıfbey ve Gaziemir Merkez'e doğum günü, yıldönümü ve taziye çiçekleri gönderin.",
    areas: ["Sarnıç", "Atıfbey", "Irmak", "Emrez", "Menderes sınırı"],
    eta: "3-5 saat içinde",
  },
  {
    slug: "balcova",
    name: "Balçova",
    intro:
      "İnciraltı, Teleferik ve Balçova Merkez'e aynı gün buket ve aranjman teslimatı.",
    areas: ["İnciraltı", "Teleferik", "Korutürk", "Onur", "Eğitim"],
    eta: "3-5 saat içinde",
  },
  {
    slug: "narlidere",
    name: "Narlıdere",
    intro:
      "Narlıdere Merkez, Sahilevleri ve Limanreis'e özenle paketlenmiş çiçek siparişi.",
    areas: ["Sahilevleri", "Limanreis", "Altevler", "Huzur", "2. İnönü"],
    eta: "3-5 saat içinde",
  },
  {
    slug: "guzelbahce",
    name: "Güzelbahçe",
    intro:
      "Güzelbahçe ve çevresine düğün, açılış ve özel gün çiçeklerini zamanında ulaştırıyoruz.",
    areas: ["Yalı", "Çelebi", "Mustafa Kemal Paşa", "Payamlı", "Yaka"],
    eta: "4-6 saat içinde",
  },
];

export function findDistrict(slug: string) {
  return DISTRICTS.find((d) => d.slug === slug);
}
