'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SellerSignupForm({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
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

    if (!user) {
      setStatus('error');
      setErrorMsg('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'seller' })
      .eq('id', user.id);

    if (profileError) {
      setStatus('error');
      setErrorMsg(profileError.message);
      return;
    }

    const { error: sellerError } = await supabase.from('community_seller_profiles').insert({
      id: user.id,
      display_name: form.get('display_name') as string,
      headline: (form.get('headline') as string) || null,
      bio: (form.get('bio') as string) || null,
      years_experience: form.get('years_experience') ? Number(form.get('years_experience')) : null,
      website_url: (form.get('website_url') as string) || null,
      contact_email: (form.get('contact_email') as string) || userEmail,
      contact_phone: (form.get('contact_phone') as string) || null,
    });

    if (sellerError) {
      setStatus('error');
      setErrorMsg(sellerError.message);
      return;
    }

    router.push('/nguoi-ban');
    router.refresh();
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Tên hiển thị / Tên công ty <span className="text-red-500">*</span>
        </label>
        <input name="display_name" required className={inputClass} placeholder="Nguyễn Văn A / Công ty ABC" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Câu giới thiệu ngắn
        </label>
        <input
          name="headline"
          className={inputClass}
          placeholder="Chuyên gia Power BI với 5 năm kinh nghiệm ngành phân phối"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Giới thiệu chi tiết
        </label>
        <textarea name="bio" rows={4} className={inputClass} placeholder="Kinh nghiệm, thế mạnh, các dự án tiêu biểu..." />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Số năm kinh nghiệm
          </label>
          <input name="years_experience" type="number" min={0} className={inputClass} placeholder="5" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Website (nếu có)
          </label>
          <input name="website_url" className={inputClass} placeholder="https://..." />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email liên hệ (khách sẽ thấy) <span className="text-red-500">*</span>
          </label>
          <input
            name="contact_email"
            type="email"
            required
            defaultValue={userEmail}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Số điện thoại liên hệ
          </label>
          <input name="contact_phone" className={inputClass} placeholder="0901234567" />
        </div>
      </div>

      {status === 'error' && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'sending' ? 'Đang tạo hồ sơ...' : 'Tạo hồ sơ người bán'}
      </button>
    </form>
  );
}
