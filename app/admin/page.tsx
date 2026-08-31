import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ModerationActions from './ModerationActions';
import type { CommunityListing, CommunitySellerProfile, Lead, Profile } from '@/lib/types';

export const dynamic = 'force-dynamic'; // admin luôn xem dữ liệu mới nhất, không cache

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/dang-nhap?next=/admin');

  // Kiểm tra quyền admin — RLS đã chặn ở DB nhưng vẫn check ở UI để hiện thông báo rõ ràng
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = (profile as Pick<Profile, 'role'> | null)?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Không có quyền truy cập</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Tài khoản <b>{user.email}</b> chưa được cấp quyền admin.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Để cấp quyền: vào Supabase Dashboard → Table Editor → bảng <code>profiles</code> → đổi
          cột <code>role</code> thành <code>admin</code> cho user này.
        </p>
        <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  const { data: leads } = await supabase
    .from('leads')
    .select('*, services(title)')
    .order('created_at', { ascending: false })
    .limit(100);

  const { data: pendingListings } = await supabase
    .from('community_listings')
    .select('*, community_seller_profiles(display_name, contact_email)')
    .eq('status', 'pending')
    .order('created_at');

  const statusLabel: Record<string, string> = {
    new: 'Mới',
    contacted: 'Đã liên hệ',
    closed: 'Đã đóng',
  };
  const statusClass: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
    closed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản trị — Yêu cầu tư vấn</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Tổng {leads?.length ?? 0} yêu cầu gần nhất
          </p>
        </div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Về trang chủ
        </Link>
      </div>

      {!leads?.length ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">
          Chưa có yêu cầu nào.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Ngày</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Họ tên</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Liên hệ</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Công ty</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Dịch vụ</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Nội dung</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {(leads as (Lead & { services: { title: string } | null })[]).map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                    {new Date(l.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{l.name}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    <div>{l.email}</div>
                    {l.phone && <div className="text-xs text-slate-500">{l.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{l.company || '—'}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {l.services?.title || '—'}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-700 dark:text-slate-300">
                    <div className="line-clamp-2">{l.message || '—'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[l.status]}`}>
                      {statusLabel[l.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Duyệt dịch vụ cộng đồng — khu vực nhiều người bán khác đăng dịch vụ,
          tách biệt với các dịch vụ chính (services) do bạn quản lý */}
      <div className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Cộng đồng — Duyệt dịch vụ ({pendingListings?.length ?? 0} chờ duyệt)
        </h2>
        {!pendingListings?.length ? (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
            Không có dịch vụ nào đang chờ duyệt.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {(
              pendingListings as (CommunityListing & {
                community_seller_profiles: Pick<CommunitySellerProfile, 'display_name' | 'contact_email'>;
              })[]
            ).map((l) => (
              <div
                key={l.id}
                className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white">{l.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Người bán: {l.community_seller_profiles.display_name} ·{' '}
                  {l.community_seller_profiles.contact_email}
                </p>
                {l.summary && <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{l.summary}</p>}
                {l.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                    {l.description}
                  </p>
                )}
                <ModerationActions listingId={l.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
