import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRooms()
      .then(setRooms)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-ryokan-green text-center mb-2">客室一覧</h1>
      <p className="text-center text-sm text-gray-500 mb-10">Rooms</p>

      {loading ? (
        <p className="text-center text-gray-400">読み込み中...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <Link
              key={room.id}
              to={`/rooms/${room.id}`}
              className="group border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-52 bg-gray-100 overflow-hidden">
                <img
                  src={room.images[0] || '/images/rooms/matsu-1.jpg'}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h2 className="font-serif text-xl text-ryokan-green mb-1 group-hover:text-ryokan-gold transition-colors">
                  {room.name}
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  {room.type} ／ {room.size}㎡ ／ 最大{room.capacity}名
                </p>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{room.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {room.amenities.slice(0, 4).map(a => (
                    <span key={a} className="text-xs bg-ryokan-green/10 text-ryokan-green px-2 py-0.5 rounded-full">
                      {a}
                    </span>
                  ))}
                  {room.amenities.length > 4 && (
                    <span className="text-xs text-gray-400">+{room.amenities.length - 4}</span>
                  )}
                </div>
                <p className="text-ryokan-red font-medium">
                  ¥{room.base_price.toLocaleString()}〜
                  <span className="text-xs text-gray-400 font-normal ml-1">/ 1名・1泊</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
