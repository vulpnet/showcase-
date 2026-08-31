'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ModerationActions({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  async function approve() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from('community_listings')
      .update({ status: 'approved', rejection_reason: null })
      .eq('id', listingId);
    setLoading(false);
    router.refresh();
  }

  async function reject() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from('community_listings')
      .update({ status: 'rejected', rejection_reason: reason || 'Không đạt yêu cầu nội dung' })
      .eq('id', listingId);
    setLoading(false);
    setShowReject(false);
    router.refresh();
  }

  if (showReject) {
    return (
      <div className="mt-3 space-y-2">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          placeholder="Lý do từ chối (seller sẽ nhìn thấy)..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
        />
        <div className="flex gap-2">
          <button
            onClick={reject}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Xác nhận từ chối
          </button>
          <button
            onClick={() => setShowReject(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
          >
            Huỷ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={approve}
        disabled={loading}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        Duyệt
      </button>
      <button
        onClick={() => setShowReject(true)}
        disabled={loading}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        Từ chối
      </button>
    </div>
  );
}
