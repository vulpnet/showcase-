import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { CommunityCategory, CommunityListing } from '@/lib/types';

export const revalidate = 300;

/**
 * Trang giới thiệu khu vực cộng đồng — nơi các đơn vị khác (ngoài chủ web)
 * đăng dịch vụ của họ, tách biệt hoàn toàn với dịch vụ chính ở trang chủ.
 */
export default async function CommunityHomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: listings }] = await Promise.all([
    supabase.from('community_categories').select('*').order('sort_order'),
    supabase
      .from('community_listings')
      .select('*, community_seller_profiles(display_name, is_verified)')
      .eq('status', 'approved')
      .order('sort_order')
      .limit(6),
  ]);

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Cộng đồng dịch vụ IT &amp; Dữ liệu
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Ngoài dịch vụ do chúng tôi trực tiếp cung cấp, đây là nơi các đơn vị đối tác khác
            đăng dịch vụ của họ — mỗi hồ sơ đều được kiểm duyệt trước khi hiển thị.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/cong-dong/dich-vu"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Tìm dịch vụ
            </Link>
            <Link
              href="/tro-thanh-nguoi-ban"
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Đăng dịch vụ của bạn
            </Link>
          </div>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Lĩnh vực dịch vụ</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(categories as CommunityCategory[]).map((c) => (
              <Link
                key={c.id}
                href={`/cong-dong/dich-vu?category=${c.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                {c.description && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{c.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dịch vụ nổi bật</h2>
            <Link href="/cong-dong/dich-vu" className="text-sm font-medium text-blue-600 hover:underline">
              Xem tất cả →
            </Link>
          </div>

          {!listings?.length ? (
            <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">
              Chưa có dịch vụ nào được duyệt.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(
                listings as (CommunityListing & {
                  community_seller_profiles: { display_name: string; is_verified: boolean } | null;
                })[]
              ).map((l) => (
                <Link
                  key={l.id}
                  href={`/cong-dong/dich-vu/${l.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                >
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white">
                    {l.title}
                  </h3>
                  {l.summary && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{l.summary}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      {l.community_seller_profiles?.display_name}
                      {l.community_seller_profiles?.is_verified && ' ✓'}
                    </span>
                    {l.offers_free_trial && (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">
                        Có dùng thử
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
