export const metadata = { title: "Hakkımızda" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight text-ink-900 mb-6">
        Hakkımızda
      </h1>
      <div className="content text-ink-700 leading-relaxed space-y-4">
        <p>
          Naturel Çiçekçilik, İzmir'de yıllardır taze ve özenle hazırlanmış
          çiçekleri sevdiklerinize ulaştıran bir aile işletmesidir. Her bir
          buketi ve aranjmanı, ustalarımızın elinden geçirerek sizlere
          sunuyoruz.
        </p>
        <h2>Misyonumuz</h2>
        <p>
          Sevdiklerinize duyduğunuz duyguları en doğal ve etkileyici şekilde
          ifade etmenize yardımcı olmak. Her çiçeğin bir hikâyesi olduğuna
          inanıyor, doğru çiçeği doğru anla buluşturmanın peşinden gidiyoruz.
        </p>
        <h2>Neden Naturel?</h2>
        <ul>
          <li>Aynı gün İzmir içi teslimat</li>
          <li>Doğrudan üreticiden taze çiçek</li>
          <li>7/24 sipariş hattı</li>
          <li>Mevsimsel ve özel tasarım koleksiyonlar</li>
          <li>Düğün, açılış, taziye için profesyonel hizmet</li>
        </ul>
      </div>
    </div>
  );
}
