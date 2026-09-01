'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Lead } from '@/lib/types';

const STATUS_LABEL: Record<Lead['status'], string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  closed: 'Đã đóng',
};

const STATUS_CLASS: Record<Lead['status'], string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  closed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

export default function LeadStatusSelect({ leadId, status }: { leadId: string; status: Lead['status'] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleChange(newStatus: Lead['status']) {
    // Chuyển sang "Đã liên hệ" thì hỏi trước — đây là hành động gửi mail
    // thật đến khách, không nên xảy ra do bấm nhầm dropdown
    if (newStatus === 'contacted') {
      const confirmed = window.confirm(
        'Chuyển sang "Đã liên hệ" sẽ gửi email kèm link demo sản phẩm cho khách này. Tiếp tục?'
      );
      if (!confirmed) return;
    }

    setSaving(true);
    setNotice(null);
    const supabase = createClient();
    await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);

    if (newStatus === 'contacted') {
      try {
        const res = await fetch('/api/send-demo-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId }),
        });
        const data = await res.json();
        setNotice(res.ok ? 'Đã gửi email demo cho khách.' : `Lỗi gửi mail: ${data.error}`);
      } catch {
        setNotice('Lỗi gửi mail: không kết nối được server.');
      }
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      <select
        value={status}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value as Lead['status'])}
        className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none disabled:opacity-50 ${STATUS_CLASS[status]}`}
      >
        {(Object.keys(STATUS_LABEL) as Lead['status'][]).map((s) => (
          <option key={s} value={s} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      {notice && <div className="mt-1 max-w-[180px] text-[11px] text-slate-500">{notice}</div>}
    </div>
  );
}
