import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ryokan-green text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 旅館情報 */}
        <div>
          <p className="font-latin text-ryokan-gold text-sm tracking-widest mb-1">Yamayu Hanayui</p>
          <p className="font-serif text-lg mb-3">山の湯 花結</p>
          <address className="not-italic text-sm text-white/70 leading-relaxed">
            〒000-0000<br />
            長野県山ノ湯温泉1-1<br />
            TEL: 0000-00-0000<br />
            E-mail: info@hanayui.example.com
          </address>
        </div>

        {/* サイトマップ */}
        <div>
          <p className="font-serif text-sm text-ryokan-gold mb-3">サイトマップ</p>
          <ul className="text-sm text-white/70 space-y-1.5">
            {[
              ['/', 'トップページ'],
              ['/rooms', '客室一覧'],
              ['/plans', 'プラン一覧'],
              ['/facilities', '施設・温泉案内'],
              ['/access', 'アクセス'],
              ['/news', 'お知らせ'],
              ['/contact', 'お問い合わせ'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ご予約 */}
        <div>
          <p className="font-serif text-sm text-ryokan-gold mb-3">ご予約・お問い合わせ</p>
          <p className="text-sm text-white/70 mb-4">
            お電話またはウェブフォームよりお気軽にお問い合わせください。
          </p>
          <Link
            to="/reserve"
            className="inline-block bg-ryokan-gold text-white px-5 py-2 rounded text-sm hover:bg-amber-600 transition-colors"
          >
            空室を確認する
          </Link>
        </div>
      </div>

      <div className="border-t border-white/20 text-center py-4 text-xs text-white/50">
        © 2026 山の湯 花結（デモサイト）. All rights reserved.
      </div>
    </footer>
  );
}
