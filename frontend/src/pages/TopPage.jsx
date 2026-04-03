import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

const HERO_IMAGES = [
  '/images/hero/hero-1.jpg',
  '/images/hero/hero-2.jpg',
  '/images/hero/hero-3.jpg',
];

export default function TopPage() {
  const [rooms, setRooms] = useState([]);
  const [plans, setPlans] = useState([]);
  const [news, setNews] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.getRooms().then(data => setRooms(data.slice(0, 3))).catch(() => {});
    api.getPlans().then(data => setPlans(data.slice(0, 3))).catch(() => {});
    api.getNews().then(data => setNews(data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      {/* ヒーロースライダー */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden text-white">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIndex ? 1 : 0 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
          </div>
        ))}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <p className="font-latin text-ryokan-gold tracking-[0.3em] text-sm mb-4">Welcome to</p>
          <h1 className="font-serif text-4xl md:text-6xl mb-4 leading-tight drop-shadow-lg">山の湯 花結</h1>
          <p className="text-white/85 text-lg mb-8">信州の山懐に抱かれた、心やすらぐ温泉旅館</p>
          <Link
            to="/reserve"
            className="inline-block bg-ryokan-gold text-white px-8 py-3 text-sm tracking-wider hover:bg-amber-600 transition-colors"
          >
            ご予約はこちら
          </Link>
        </div>
        {/* スライダーインジケーター */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setHeroIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === heroIndex ? 'bg-ryokan-gold' : 'bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* おすすめ客室 */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-serif text-2xl text-center text-ryokan-green mb-2">お部屋のご案内</h2>
        <p className="text-center text-sm text-gray-500 mb-10">Rooms</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map(room => (
            <Link key={room.id} to={`/rooms/${room.id}`} className="group border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                {room.images[0] ? (
                  <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                ) : (
                  '写真準備中'
                )}
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-ryokan-green mb-1">{room.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{room.type} ／ 最大{room.capacity}名</p>
                <p className="text-sm text-ryokan-red font-medium">
                  ¥{room.base_price.toLocaleString()}〜 <span className="text-xs text-gray-400">/ 1名</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/rooms" className="text-sm text-ryokan-green border-b border-ryokan-green pb-0.5 hover:text-ryokan-gold hover:border-ryokan-gold transition-colors">
            客室一覧を見る →
          </Link>
        </div>
      </section>

      {/* プランピックアップ */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-2xl text-center text-ryokan-green mb-2">宿泊プラン</h2>
          <p className="text-center text-sm text-gray-500 mb-10">Plans</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div key={plan.id} className="border border-gray-100 rounded p-5 hover:shadow-sm transition-shadow">
                <p className="text-xs text-ryokan-gold font-medium mb-2">{plan.meal_type}</p>
                <h3 className="font-serif text-base text-ryokan-green mb-2">{plan.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-3">{plan.description}</p>
                {plan.price_modifier > 0 && (
                  <p className="text-sm text-ryokan-red mt-3">+¥{plan.price_modifier.toLocaleString()}/名</p>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/plans" className="text-sm text-ryokan-green border-b border-ryokan-green pb-0.5 hover:text-ryokan-gold hover:border-ryokan-gold transition-colors">
              プラン一覧を見る →
            </Link>
          </div>
        </div>
      </section>

      {/* お知らせ */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-serif text-2xl text-center text-ryokan-green mb-2">お知らせ</h2>
        <p className="text-center text-sm text-gray-500 mb-10">News</p>
        <ul className="max-w-2xl mx-auto divide-y divide-gray-100">
          {news.map(item => (
            <li key={item.id} className="flex gap-4 py-4">
              <time className="text-xs text-gray-400 whitespace-nowrap pt-0.5">{item.published_at}</time>
              <span className="text-xs bg-ryokan-green/10 text-ryokan-green px-2 py-0.5 rounded-full h-fit whitespace-nowrap">{item.category}</span>
              <p className="text-sm text-ryokan-text">{item.title}</p>
            </li>
          ))}
        </ul>
        <div className="text-center mt-8">
          <Link to="/news" className="text-sm text-ryokan-green border-b border-ryokan-green pb-0.5 hover:text-ryokan-gold hover:border-ryokan-gold transition-colors">
            お知らせ一覧を見る →
          </Link>
        </div>
      </section>

      {/* ご予約CTA */}
      <section className="bg-ryokan-green text-white py-16 text-center px-4">
        <h2 className="font-serif text-2xl mb-4">ご予約・お問い合わせ</h2>
        <p className="text-white/70 text-sm mb-8">空室状況を確認してご予約ください</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/reserve" className="bg-ryokan-gold text-white px-8 py-3 text-sm tracking-wider hover:bg-amber-600 transition-colors">
            空室を確認する
          </Link>
          <Link to="/contact" className="border border-white text-white px-8 py-3 text-sm tracking-wider hover:bg-white/10 transition-colors">
            お問い合わせ
          </Link>
        </div>
      </section>
    </div>
  );
}
