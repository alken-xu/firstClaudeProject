import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNews().then(setNews).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-ryokan-green text-center mb-2">お知らせ</h1>
      <p className="text-center text-sm text-gray-500 mb-10">News</p>

      {loading ? (
        <p className="text-center text-gray-400">読み込み中...</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {news.map(item => (
            <li key={item.id} className="py-6">
              <div className="flex items-center gap-3 mb-2">
                <time className="text-xs text-gray-400">{item.published_at}</time>
                <span className="text-xs bg-ryokan-green/10 text-ryokan-green px-2 py-0.5 rounded-full">{item.category}</span>
              </div>
              <h2 className="font-serif text-lg text-ryokan-green mb-2">{item.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
