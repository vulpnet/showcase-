import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { CommunityCategory, CommunityListing } from '@/lib/types';

export const revalidate = 300;

export default async function CommunityListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('community_categories')
    .select('*')
    .order('sort_order');

  let query = supabase
    .from('community_listings')
    .select('*, community_seller_profiles(display_name, is_verified), community_categories(slug, name)')
    .eq('status', 'approved')
    .order('sort_order');

  if (categorySlug) {
    const cat = (categories as CommunityCategory[] | null)?.find((c) => c.slug === categorySlug);
    if (cat) query = query.eq('category_id', cat.id);
  }

  const { data: listings } = await query;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/cong-dong" className="text-sm text-blue-600 hover:underline">
        ← Về trang cộng đồng
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Tìm dịch vụ</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Danh sách dịch vụ đã được kiểm duyệt từ các đối tác trên nền tảng.
      </p>

      {categories && categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/cong-dong/dich-vu"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              !categorySlug
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 text-slate-600 hover:border-blue-400 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            Tất cả
          </Link>
          {(categories as CommunityCategory[]).map((c) => (
            <Link
              key={c.id}
              href={`/cong-dong/dich-vu?category=${c.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                categorySlug === c.slug
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-300 text-slate-600 hover:border-blue-400 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {!listings?.length ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">
          Chưa có dịch vụ nào trong danh mục này.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(
            listings as (CommunityListing & {
              community_seller_profiles: { display_name: string; is_verified: boolean } | null;
              community_categories: { slug: string; name: string } | null;
            })[]
          ).map((l) => (
            <Link
              key={l.id}
              href={`/cong-dong/dich-vu/${l.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              {l.community_categories && (
                <span className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {l.community_categories.name}
                </span>
              )}
              <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white">
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
  );
}
