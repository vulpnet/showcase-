'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Service } from '@/lib/types';

type Props = {
  services: Pick<Service, 'id' | 'slug' | 'title'>[];
  defaultServiceSlug?: string;
  defaultEmail?: string;
  planName?: string;
};

export default function ContactForm({ services, defaultServiceSlug, defaultEmail, planName }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedName, setSubmittedName] = useState('');

  const CONTACT_EMAIL = 'tai.huynh@dmspro.vn';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const serviceId = (form.get('service_id') as string) || null;
    const messageBase = (form.get('message') as string) || '';
    setSubmittedName((form.get('company') as string) || (form.get('name') as string) || '');
    // Ghi kèm tên gói vào nội dung để admin biết khách quan tâm gói nào mà không cần thêm cột riêng
    const message = planName ? `[Gói: ${planName}] ${messageBase}` : messageBase;

    const { error } = await supabase.from('leads').insert({
      user_id: user?.id ?? null,
      service_id: serviceId || null,
      name: form.get('name') as string,
      email: form.get('email') as string,
      phone: (form.get('phone') as string) || null,
      company: (form.get('company') as string) || null,
      message: message || null,
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }
    setStatus('sent');
  }

  // Gói miễn phí (Khảo sát/Rà soát/Thử nghiệm) cần khách gửi kèm file dữ liệu mẫu
  // qua email — web chưa có chỗ tải file lên nên hướng dẫn rõ để khách gửi đúng chỗ
  const isFreeTrial = planName != null && /^(Khảo sát|Rà soát nhanh|Thử nghiệm)$/.test(planName);

  if (status === 'sent') {
    return (
      <div className="mt-8 rounded-xl border border-green-300 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950">
        <div className="text-3xl">✅</div>
        <h2 className="mt-3 text-xl font-bold text-green-800 dark:text-green-200">
          Đã gửi thành công!
        </h2>
        <p className="mt-2 text-green-700 dark:text-green-300">
          Cảm ơn bạn đã quan tâm. Chúng tôi sẽ liên hệ sớm nhất có thể.
        </p>

        {isFreeTrial && (
          <div className="mt-6 rounded-lg border border-green-300 bg-white p-5 text-left dark:border-green-800 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-white">
              Để chúng tôi bắt đầu ngay, vui lòng gửi kèm dữ liệu mẫu qua email:
            </p>
            <p className="mt-2 text-lg font-bold text-blue-600">{CONTACT_EMAIL}</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Tiêu đề mail ghi rõ: <b>&quot;{planName} — {submittedName || 'Tên công ty'}&quot;</b>. Đính
              kèm 1 file Excel/CSV mẫu (có thể ẩn tên khách hàng nếu cần bảo mật). Chúng tôi phản hồi
              kết quả trong 2-3 ngày làm việc.
            </p>
          </div>
        )}
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      {isFreeTrial && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
          Sau khi gửi form này, bạn gửi thêm 1 file dữ liệu mẫu (Excel/CSV) qua email —
          chúng tôi sẽ hiện địa chỉ email cụ thể ở bước tiếp theo.
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Họ tên <span className="text-red-500">*</span>
        </label>
        <input name="name" required className={inputClass} placeholder="Nguyễn Văn A" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            defaultValue={defaultEmail}
            className={inputClass}
            placeholder="email@congty.vn"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Số điện thoại
          </label>
          <input name="phone" className={inputClass} placeholder="0901234567" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Công ty
        </label>
        <input name="company" className={inputClass} placeholder="Công ty ABC" />
      </div>

      {services.length > 0 && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Dịch vụ quan tâm
          </label>
          <select
            name="service_id"
            defaultValue={services.find((s) => s.slug === defaultServiceSlug)?.id ?? ''}
            className={inputClass}
          >
            <option value="">— Chọn dịch vụ —</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Nội dung
        </label>
        <textarea
          name="message"
          rows={4}
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
        {status === 'sending' ? 'Đang gửi...' : 'Gửi thông tin'}
      </button>
    </form>
  );
}
