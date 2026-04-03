import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPlans().then(setPlans).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-ryokan-green text-center mb-2">宿泊プラン</h1>
      <p className="text-center text-sm text-gray-500 mb-10">Plans</p>

      {loading ? (
        <p className="text-center text-gray-400">読み込み中...</p>
      ) : (
        <div className="space-y-6">
          {plans.map(plan => (
            <div key={plan.id} className="border border-gray-200 rounded overflow-hidden md:flex hover:shadow-md transition-shadow">
              <div className="md:w-56 h-40 md:h-auto bg-gray-100 flex items-center justify-center text-gray-400 text-sm flex-shrink-0">
                写真準備中
              </div>
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <div>
                    <span className="text-xs text-ryokan-gold font-medium">{plan.meal_type}</span>
                    {plan.min_nights > 1 && (
                      <span className="ml-2 text-xs bg-ryokan-green/10 text-ryokan-green px-2 py-0.5 rounded-full">
                        {plan.min_nights}泊〜
                      </span>
                    )}
                  </div>
                  <p className="text-ryokan-red font-medium text-sm">
                    {plan.price_modifier > 0
                      ? `+¥${plan.price_modifier.toLocaleString()}/名`
                      : '追加料金なし'}
                  </p>
                </div>
                <h2 className="font-serif text-xl text-ryokan-green mb-2">{plan.name}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{plan.description}</p>
                <Link
                  to="/reserve"
                  className="inline-block text-sm border border-ryokan-green text-ryokan-green px-4 py-2 rounded hover:bg-ryokan-green hover:text-white transition-colors"
                >
                  このプランで予約する
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
