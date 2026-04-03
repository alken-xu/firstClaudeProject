import { useLocation, Link } from 'react-router-dom';

export default function ReserveCompletePage() {
  const { state } = useLocation();

  if (!state?.reservation) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">予約情報が見つかりません。</p>
        <Link to="/" className="text-ryokan-green text-sm mt-4 inline-block hover:underline">トップへ戻る</Link>
      </div>
    );
  }

  const { reservation, room, plan } = state;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-4xl mb-4">🌸</div>
      <h1 className="font-serif text-3xl text-ryokan-green mb-3">ご予約を承りました</h1>
      <p className="text-sm text-gray-500 mb-10">ご予約いただきありがとうございます。心よりお待ちしております。</p>

      <div className="bg-white border border-gray-200 rounded p-6 text-left mb-8">
        <div className="text-center mb-6">
          <p className="text-xs text-gray-500 mb-1">予約番号</p>
          <p className="font-latin text-2xl text-ryokan-green tracking-wider">{reservation.reservation_no}</p>
        </div>

        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            {[
              ['客室', room?.name || '—'],
              ['プラン', plan?.name || 'プランなし'],
              ['チェックイン', reservation.check_in],
              ['チェックアウト', reservation.check_out],
              ['泊数', `${reservation.nights}泊`],
              ['人数', `${reservation.guest_count}名`],
              ['お名前', reservation.guest_name],
              ['メール', reservation.guest_email],
              ['電話', reservation.guest_phone],
              ['合計金額', `¥${reservation.total_price.toLocaleString()}`],
            ].map(([label, value]) => (
              <tr key={label}>
                <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">{label}</td>
                <td className="py-2 font-medium text-ryokan-text">{value}</td>
              </tr>
            ))}
            {reservation.requests && (
              <tr>
                <td className="py-2 pr-4 text-gray-500">特別リクエスト</td>
                <td className="py-2 text-ryokan-text">{reservation.requests}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mb-8">
        ※ このサイトはデモサイトです。実際のご予約・メール送信は行われません。
      </p>

      <Link to="/" className="inline-block bg-ryokan-green text-white px-8 py-3 text-sm tracking-wider hover:bg-ryokan-green/90 transition-colors rounded">
        トップページへ戻る
      </Link>
    </div>
  );
}
