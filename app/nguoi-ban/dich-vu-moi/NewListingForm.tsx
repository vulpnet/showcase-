'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { CommunityCategory } from '@/lib/types';

function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewListingForm({
  sellerId,
  categories,
}: {
  sellerId: string;
  categories: CommunityCategory[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [offersFreeTrial, setOffersFreeTrial] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const title = form.get('title') as string;
    const benefitsRaw = (form.get('benefits') as string) || '';
    const benefits = benefitsRaw
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const supabase = createClient();
    const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`;

    const { error } = await supabase.from('community_listings').insert({
      seller_id: sellerId,
      category_id: (form.get('category_id') as string) || null,
      slug,
      title,
      summary: (form.get('summary') as string) || null,
      description: (form.get('description') as string) || null,
      benefits,
      price_text: (form.get('price_text') as string) || null,
      offers_free_trial: offersFreeTrial,
      free_trial_note: offersFreeTrial ? (form.get('free_trial_note') as string) || null : null,
      status: 'pending',
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
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
          Tên dịch vụ <span className="text-red-500">*</span>
        </label>
        <input name="title" required className={inputClass} placeholder="Xây dựng báo cáo Power BI" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Lĩnh vực <span className="text-red-500">*</span>
        </label>
        <select name="category_id" required className={inputClass}>
          <option value="">— Chọn lĩnh vực —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Mô tả ngắn (hiện ở danh sách)
        </label>
        <input name="summary" className={inputClass} placeholder="1-2 câu mô tả dịch vụ" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Mô tả chi tiết
        </label>
        <textarea
          name="description"
          rows={6}
          className={inputClass}
          placeholder={'Có thể dùng ## Tiêu đề, - gạch đầu dòng, **chữ đậm** để định dạng'}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Lợi ích chính (mỗi dòng 1 ý)
        </label>
        <textarea
          name="benefits"
          rows={3}
          className={inputClass}
          placeholder={'Giảm thời gian tổng hợp báo cáo\nSố liệu cập nhật hàng ngày'}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Mức giá tham khảo
        </label>
        <input name="price_text" className={inputClass} placeholder="Từ 10.000.000đ hoặc Liên hệ báo giá" />
      </div>

      <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={offersFreeTrial}
            onChange={(e) => setOffersFreeTrial(e.target.checked)}
            className="size-4 rounded border-slate-300"
          />
          Có gói dùng thử miễn phí
        </label>
        {offersFreeTrial && (
          <textarea
            name="free_trial_note"
            rows={2}
            className={`${inputClass} mt-3`}
            placeholder="Mô tả điều kiện dùng thử: cần gửi gì, giới hạn phạm vi, thời gian trả kết quả..."
          />
        )}
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
        {status === 'sending' ? 'Đang gửi...' : 'Gửi để duyệt'}
      </button>
      <p className="text-center text-xs text-slate-500">
        Dịch vụ sẽ ở trạng thái &quot;Chờ duyệt&quot; cho đến khi admin xem xét.
      </p>
    </form>
  );
}
