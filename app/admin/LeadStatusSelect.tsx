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

  async function handleChange(newStatus: Lead['status']) {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    setSaving(false);
    router.refresh();
  }

  return (
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
  );
}
