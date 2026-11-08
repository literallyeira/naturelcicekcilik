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
];

/** Sipariş alınan ilçeler — checkout formu ve API bu listeyi kullanır. */
export const DELIVERY_DISTRICTS = DISTRICTS.map((d) => d.name) as [string, ...string[]];

export function findDistrict(slug: string) {
  return DISTRICTS.find((d) => d.slug === slug);
}
