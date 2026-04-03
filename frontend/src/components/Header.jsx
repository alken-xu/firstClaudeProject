import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/rooms', label: '客室' },
  { to: '/plans', label: 'プラン' },
  { to: '/facilities', label: '施設・温泉' },
  { to: '/access', label: 'アクセス' },
  { to: '/news', label: 'お知らせ' },
  { to: '/contact', label: 'お問い合わせ' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-ryokan-green text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* ロゴ */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-latin text-ryokan-gold text-sm tracking-widest">Yamayu Hanayui</span>
          <span className="font-serif text-xl tracking-wider">山の湯 花結</span>
        </Link>

        {/* PC ナビ */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-ryokan-gold border-b border-ryokan-gold pb-0.5'
                  : 'hover:text-ryokan-gold transition-colors'
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/reserve"
            className="ml-4 bg-ryokan-gold text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            ご予約
          </Link>
        </nav>

        {/* ハンバーガー */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="メニュー"
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* SP メニュー */}
      {menuOpen && (
        <nav className="md:hidden bg-ryokan-green border-t border-white/20">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className="block px-6 py-3 text-sm border-b border-white/10 hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/reserve"
            className="block px-6 py-3 text-ryokan-gold font-medium"
            onClick={() => setMenuOpen(false)}
          >
            ご予約
          </Link>
        </nav>
      )}
    </header>
  );
}
