import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getRoom(id)
      .then(setRoom)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-20 text-gray-400">読み込み中...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;
  if (!room) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/rooms" className="text-sm text-gray-500 hover:text-ryokan-green mb-6 inline-block">← 客室一覧に戻る</Link>

      <div className="h-72 bg-gray-100 rounded overflow-hidden mb-8">
        <img
          src={room.images[0] || '/images/rooms/matsu-1.jpg'}
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>
      {room.images.length > 1 && (
        <div className="grid grid-cols-3 gap-2 mb-8">
          {room.images.slice(1).map((img, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded overflow-hidden">
              <img src={img} alt={`${room.name} ${i + 2}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* メイン情報 */}
        <div className="md:col-span-2">
          <p className="text-xs text-ryokan-gold font-medium mb-1">{room.type}</p>
          <h1 className="font-serif text-3xl text-ryokan-green mb-3">{room.name}</h1>
          <p className="text-sm text-gray-500 mb-5">{room.size}㎡ ／ 最大{room.capacity}名</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-8">{room.description}</p>

          <h2 className="font-serif text-lg text-ryokan-green mb-3">設備・アメニティ</h2>
          <ul className="flex flex-wrap gap-2">
            {room.amenities.map(a => (
              <li key={a} className="text-sm bg-ryokan-green/10 text-ryokan-green px-3 py-1 rounded-full">
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* 予約サイドバー */}
        <div className="border border-gray-200 rounded p-5 h-fit">
          <p className="text-xs text-gray-500 mb-1">1名・1泊あたり（基本料金）</p>
          <p className="font-serif text-2xl text-ryokan-red mb-1">
            ¥{room.base_price.toLocaleString()}〜
          </p>
          <p className="text-xs text-gray-400 mb-6">（プランにより異なります）</p>
          <Link
            to={`/reserve?room_id=${room.id}`}
            className="block w-full text-center bg-ryokan-gold text-white py-3 text-sm tracking-wider hover:bg-amber-600 transition-colors rounded"
          >
            この客室を予約する
          </Link>
          <Link
            to="/reserve"
            className="block w-full text-center border border-ryokan-green text-ryokan-green py-3 text-sm mt-2 hover:bg-ryokan-green/5 transition-colors rounded"
          >
            空室カレンダーを見る
          </Link>
        </div>
      </div>
    </div>
  );
}
