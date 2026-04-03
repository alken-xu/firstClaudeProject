export default function FacilitiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-ryokan-green text-center mb-2">施設・温泉案内</h1>
      <p className="text-center text-sm text-gray-500 mb-12">Facilities & Onsen</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: '大浴場・露天風呂', desc: '信州の名湯を満喫できる広々とした大浴場と、山の自然を感じながら入れる露天風呂をご用意しています。男女別・入れ替え制でご利用いただけます。', icon: '♨️' },
          { title: 'お食事処', desc: '地元の旬の食材を使った会席料理をご提供いたします。個室でゆっくりとお食事をお楽しみください。朝食は和朝食をご用意しています。', icon: '🍱' },
          { title: 'ロビー・ラウンジ', desc: 'チェックイン後やお食事前のひとときを、和の雰囲気漂うラウンジでお過ごしください。ウェルカムドリンクをご用意しています。', icon: '🍵' },
          { title: '庭園', desc: '四季折々の花が咲く日本庭園を散策いただけます。朝の空気の中での散歩は格別です。', icon: '🌸' },
        ].map(item => (
          <div key={item.title} className="bg-white border border-gray-100 rounded p-6 hover:shadow-sm transition-shadow">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h2 className="font-serif text-xl text-ryokan-green mb-3">{item.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
