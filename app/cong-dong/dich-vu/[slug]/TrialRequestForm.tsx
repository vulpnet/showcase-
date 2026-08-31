'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  listingId: string;
  sellerId: string;
  offersFreeTrial: boolean;
};

export default function TrialRequestForm({ listingId, sellerId, offersFreeTrial }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('community_trial_requests').insert({
      listing_id: listingId,
      seller_id: sellerId,
      requester_user_id: user?.id ?? null,
      name: form.get('name') as string,
      email: form.get('email') as string,
      phone: (form.get('phone') as string) || null,
      company: (form.get('company') as string) || null,
      message: (form.get('message') as string) || null,
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
        <div className="text-3xl">✅</div>
        <h3 className="mt-3 text-lg font-bold text-green-800 dark:text-green-200">
          Đã gửi yêu cầu!
        </h3>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          Người bán sẽ liên hệ trực tiếp với bạn qua email/điện thoại đã cung cấp. Giá cả và
          thanh toán do hai bên tự thoả thuận, nền tảng không thu phí giao dịch.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Họ tên <span className="text-red-500">*</span>
        </label>
        <input name="name" required className={inputClass} placeholder="Nguyễn Văn A" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email <span className="text-red-500">*</span>
        </label>
        <input name="email" type="email" required className={inputClass} placeholder="email@congty.vn" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Số điện thoại
        </label>
        <input name="phone" className={inputClass} placeholder="0901234567" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Công ty
        </label>
        <input name="company" className={inputClass} placeholder="Công ty ABC" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Nội dung
        </label>
        <textarea
          name="message"
          rows={3}
          className={inputClass}
          placeholder="Mô tả ngắn nhu cầu của bạn..."
        />
      </div>

      {status === 'error' && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Gửi không thành công: {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'sending'
          ? 'Đang gửi...'
          : offersFreeTrial
            ? 'Đăng ký dùng thử'
            : 'Gửi yêu cầu liên hệ'}
      </button>

      <p className="text-center text-xs text-slate-500">
        Nền tảng chỉ kết nối — không xử lý thanh toán. Giá cả do bạn và người bán tự thoả thuận.
      </p>
    </form>
  );
}
