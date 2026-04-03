import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { api } from '../utils/api';

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(data) {
    setError('');
    try {
      await api.sendContact(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-ryokan-green text-center mb-2">お問い合わせ</h1>
      <p className="text-center text-sm text-gray-500 mb-10">Contact</p>

      {submitted ? (
        <div className="text-center py-12">
          <p className="text-ryokan-green font-medium mb-2">お問い合わせを受け付けました。</p>
          <p className="text-sm text-gray-500">担当者よりご連絡いたします。</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-200 rounded p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">お名前 <span className="text-red-500">*</span></label>
            <input {...register('name', { required: '入力してください' })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">メールアドレス <span className="text-red-500">*</span></label>
            <input type="email" {...register('email', { required: '入力してください' })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">電話番号</label>
            <input type="tel" {...register('phone')}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">件名</label>
            <input {...register('subject')}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">お問い合わせ内容 <span className="text-red-500">*</span></label>
            <textarea {...register('message', { required: '入力してください' })} rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-ryokan-green resize-none" />
            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit"
            className="w-full bg-ryokan-green text-white py-3 text-sm tracking-wider hover:bg-ryokan-green/90 transition-colors rounded">
            送信する
          </button>
          <p className="text-xs text-gray-400 text-center">※ このサイトはデモサイトのため、実際には送信されません。</p>
        </form>
      )}
    </div>
  );
}
