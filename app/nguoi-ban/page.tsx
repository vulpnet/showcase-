import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { CommunityListing, CommunityListingStatus, CommunityTrialRequest, Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

const statusLabel: Record<CommunityListingStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Bị từ chối',
};
const statusClass: Record<CommunityListingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
};

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/dang-nhap?next=/nguoi-ban');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if ((profile as Pick<Profile, 'role'> | null)?.role !== 'seller') {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chưa có hồ sơ người bán</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Tài khoản này chưa đăng ký làm người bán trong khu vực cộng đồng.
        </p>
        <Link
          href="/tro-thanh-nguoi-ban"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Đăng ký làm người bán
        </Link>
      </div>
    );
  }

  const [{ data: listings }, { data: requests }] = await Promise.all([
    supabase
      .from('community_listings')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('community_trial_requests')
      .select('*, community_listings(title)')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kênh người bán</h1>
        <Link
          href="/nguoi-ban/dich-vu-moi"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Đăng dịch vụ mới
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dịch vụ của tôi</h2>
        {!listings?.length ? (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
            Chưa có dịch vụ nào. Bấm &quot;Đăng dịch vụ mới&quot; để bắt đầu.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {(listings as CommunityListing[]).map((l) => (
              <div
                key={l.id}
                className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{l.title}</h3>
                    {l.summary && (
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{l.summary}</p>
                    )}
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusClass[l.status]}`}>
                    {statusLabel[l.status]}
                  </span>
                </div>
                {l.status === 'rejected' && l.rejection_reason && (
                  <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                    Lý do từ chối: {l.rejection_reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Yêu cầu gần đây</h2>
        {!requests?.length ? (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
            Chưa có yêu cầu nào.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Ngày</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Dịch vụ</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Khách</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Liên hệ</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Nội dung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {(requests as (CommunityTrialRequest & { community_listings: { title: string } | null })[]).map(
                  (r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                        {new Date(r.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {r.community_listings?.title || '—'}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{r.name}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        <div>{r.email}</div>
                        {r.phone && <div className="text-xs text-slate-500">{r.phone}</div>}
                      </td>
                      <td className="max-w-xs px-4 py-3 text-slate-700 dark:text-slate-300">
                        <div className="line-clamp-2">{r.message || '—'}</div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
