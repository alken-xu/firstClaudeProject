import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, differenceInCalendarDays } from 'date-fns';
import { api } from '../utils/api';

const STEPS = ['日程・人数', '客室・プラン選択', 'お客様情報'];

export default function ReservePage() {
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Step1 state
  const [availableRooms, setAvailableRooms] = useState(null);
  const [plans, setPlans] = useState([]);
  const [searchInfo, setSearchInfo] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Step2 selection
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { register: reg1, handleSubmit: hs1, formState: { errors: e1 } } = useForm();
  const { register: reg3, handleSubmit: hs3, formState: { errors: e3 } } = useForm();

  // Step1: 空室検索
  async function onSearchSubmit(data) {
    setSearchError('');
    const nights = differenceInCalendarDays(new Date(data.check_out), new Date(data.check_in));
    if (nights <= 0) {
      setSearchError('チェックアウト日はチェックイン日より後の日付を入力してください');
      return;
    }
    try {
      const [rooms, planList] = await Promise.all([
        api.getAvailableRooms({ check_in: data.check_in, check_out: data.check_out, guest_count: data.guest_count }),
        api.getPlans(),
      ]);
      setAvailableRooms(rooms);
      setPlans(planList);
      setSearchInfo({ ...data, nights });
    } catch (err) {
      setSearchError(err.message);
    }
  }

  // Step2 → Step3
  function onSelectSubmit() {
    if (!selectedRoom) return;
    setStep(3);
  }

  // Step3: 予約確定 → 確認画面
  async function onGuestSubmit(data) {
    const nights = searchInfo.nights;
    const basePrice = selectedRoom.base_price;
    const planModifier = selectedPlan?.price_modifier || 0;
    const total = (basePrice + planModifier) * parseInt(searchInfo.guest_count) * nights;

    const payload = {
      room_id: selectedRoom.id,
      plan_id: selectedPlan?.id || null,
      check_in: searchInfo.check_in,
      check_out: searchInfo.check_out,
      nights,
      guest_count: parseInt(searchInfo.guest_count),
      total_price: total,
      guest_name: data.guest_name,
      guest_email: data.guest_email,
      guest_phone: data.guest_phone,
      requests: data.requests,
    };

    try {
      const reservation = await api.createReservation(payload);
      navigate('/reserve/complete', { state: { reservation, room: selectedRoom, plan: selectedPlan } });
    } catch (err) {
      alert('予約に失敗しました: ' + err.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-ryokan-green text-center mb-2">ご予約</h1>
      <p className="text-center text-sm text-gray-500 mb-10">Reservation</p>

      {/* ステップ表示 */}
      <div className="flex items-center justify-center mb-10 gap-0">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex flex-col items-center`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === i + 1 ? 'bg-ryokan-green text-white' : step > i + 1 ? 'bg-ryokan-gold text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-16 h-0.5 mx-2 mb-5 ${step > i + 1 ? 'bg-ryokan-gold' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white border border-gray-200 rounded p-6">
          <h2 className="font-serif text-xl text-ryokan-green mb-6">日程・人数を入力してください</h2>
          <form onSubmit={hs1(onSearchSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">チェックイン日 <span className="text-red-500">*</span></label>
                <input type="date" {...reg1('check_in', { required: '入力してください' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green" />
                {e1.check_in && <p className="text-xs text-red-500 mt-1">{e1.check_in.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">チェックアウト日 <span className="text-red-500">*</span></label>
                <input type="date" {...reg1('check_out', { required: '入力してください' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green" />
                {e1.check_out && <p className="text-xs text-red-500 mt-1">{e1.check_out.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">人数 <span className="text-red-500">*</span></label>
              <select {...reg1('guest_count', { required: true })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}名</option>)}
              </select>
            </div>
            {searchError && <p className="text-sm text-red-500">{searchError}</p>}
            <button type="submit" className="w-full bg-ryokan-green text-white py-3 text-sm tracking-wider hover:bg-ryokan-green/90 transition-colors rounded">
              空室を検索する
            </button>
          </form>

          {availableRooms !== null && (
            <div className="mt-8">
              <h3 className="font-serif text-lg text-ryokan-green mb-4">
                空室状況 — {searchInfo.check_in} 〜 {searchInfo.check_out}（{searchInfo.nights}泊・{searchInfo.guest_count}名）
              </h3>
              {availableRooms.length === 0 ? (
                <p className="text-sm text-gray-500">指定の日程・人数で空室がありません。日程を変更してお試しください。</p>
              ) : (
                <div className="space-y-3">
                  {availableRooms.map(room => (
                    <button key={room.id} onClick={() => { setSelectedRoom(room); setStep(2); }}
                      className="w-full text-left border border-gray-200 rounded p-4 hover:border-ryokan-green hover:bg-ryokan-green/5 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-serif text-base text-ryokan-green">{room.name}</p>
                          <p className="text-xs text-gray-500">{room.type} ／ 最大{room.capacity}名</p>
                        </div>
                        <p className="text-ryokan-red font-medium text-sm">
                          ¥{room.base_price.toLocaleString()}/名〜
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && selectedRoom && (
        <div className="bg-white border border-gray-200 rounded p-6">
          <h2 className="font-serif text-xl text-ryokan-green mb-6">客室・プランを選択してください</h2>

          <div className="bg-ryokan-bg border border-gray-100 rounded p-4 mb-6">
            <p className="text-sm font-medium text-ryokan-green">{selectedRoom.name}</p>
            <p className="text-xs text-gray-500">{selectedRoom.type} ／ 最大{selectedRoom.capacity}名</p>
            <p className="text-xs text-ryokan-red mt-1">¥{selectedRoom.base_price.toLocaleString()}/名（基本料金）</p>
          </div>

          <h3 className="font-serif text-base text-ryokan-green mb-3">プランを選択</h3>
          <div className="space-y-2 mb-6">
            <button
              onClick={() => setSelectedPlan(null)}
              className={`w-full text-left border rounded p-3 text-sm transition-colors ${!selectedPlan ? 'border-ryokan-green bg-ryokan-green/5' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <span className="font-medium">プランなし</span>
              <span className="text-gray-400 ml-2 text-xs">基本料金のみ</span>
            </button>
            {plans.map(plan => (
              <button key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`w-full text-left border rounded p-3 text-sm transition-colors ${selectedPlan?.id === plan.id ? 'border-ryokan-green bg-ryokan-green/5' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{plan.name}</span>
                  <span className="text-ryokan-red text-xs">
                    {plan.price_modifier > 0 ? `+¥${plan.price_modifier.toLocaleString()}/名` : '追加なし'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{plan.meal_type}</p>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-600 py-3 text-sm rounded hover:bg-gray-50 transition-colors">
              戻る
            </button>
            <button onClick={onSelectSubmit} className="flex-1 bg-ryokan-green text-white py-3 text-sm rounded hover:bg-ryokan-green/90 transition-colors">
              次へ進む
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="bg-white border border-gray-200 rounded p-6">
          <h2 className="font-serif text-xl text-ryokan-green mb-6">お客様情報を入力してください</h2>

          {/* 予約サマリ */}
          <div className="bg-ryokan-bg border border-gray-100 rounded p-4 mb-6 text-sm">
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
              <span>客室</span><span className="font-medium">{selectedRoom?.name}</span>
              <span>プラン</span><span className="font-medium">{selectedPlan?.name || 'プランなし'}</span>
              <span>日程</span><span className="font-medium">{searchInfo?.check_in} → {searchInfo?.check_out}（{searchInfo?.nights}泊）</span>
              <span>人数</span><span className="font-medium">{searchInfo?.guest_count}名</span>
              <span className="font-medium text-ryokan-red">合計（概算）</span>
              <span className="font-medium text-ryokan-red">
                ¥{((selectedRoom.base_price + (selectedPlan?.price_modifier || 0)) * parseInt(searchInfo.guest_count) * searchInfo.nights).toLocaleString()}
              </span>
            </div>
          </div>

          <form onSubmit={hs3(onGuestSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">お名前 <span className="text-red-500">*</span></label>
              <input {...reg3('guest_name', { required: '入力してください' })}
                placeholder="山田 花子"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green" />
              {e3.guest_name && <p className="text-xs text-red-500 mt-1">{e3.guest_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">メールアドレス <span className="text-red-500">*</span></label>
              <input type="email" {...reg3('guest_email', { required: '入力してください' })}
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green" />
              {e3.guest_email && <p className="text-xs text-red-500 mt-1">{e3.guest_email.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">電話番号 <span className="text-red-500">*</span></label>
              <input type="tel" {...reg3('guest_phone', { required: '入力してください' })}
                placeholder="090-0000-0000"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green" />
              {e3.guest_phone && <p className="text-xs text-red-500 mt-1">{e3.guest_phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">特別リクエスト（任意）</label>
              <textarea {...reg3('requests')} rows={3}
                placeholder="アレルギー、アーリーチェックインのご希望など"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green resize-none" />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)}
                className="flex-1 border border-gray-300 text-gray-600 py-3 text-sm rounded hover:bg-gray-50 transition-colors">
                戻る
              </button>
              <button type="submit"
                className="flex-1 bg-ryokan-gold text-white py-3 text-sm rounded hover:bg-amber-600 transition-colors">
                予約を確定する
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
