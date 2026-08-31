import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { Markdown } from '@/app/Markdown';
import TrialRequestForm from './TrialRequestForm';
import type { CommunityListing, CommunitySellerProfile, CommunityCategory } from '@/lib/types';

export const revalidate = 300;

export async function generateStaticParams() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase.from('community_listings').select('slug').eq('status', 'approved');
  return (data ?? []).map((l: { slug: string }) => ({ slug: l.slug }));
}

export default async function CommunityListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from('community_listings')
    .select('*, community_seller_profiles(*), community_categories(name, slug)')
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle();

  if (!listing) notFound();

  const l = listing as CommunityListing & {
    community_seller_profiles: CommunitySellerProfile;
    community_categories: CommunityCategory | null;
  };

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <Link href="/cong-dong" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400">
            ← Về trang cộng đồng
          </Link>
          {l.community_categories && (
            <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              {l.community_categories.name}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {l.title}
          </h1>
          {l.summary && (
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {l.summary}
            </p>
          )}
          <div className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>
              Người bán:{' '}
              <b className="text-slate-900 dark:text-white">{l.community_seller_profiles.display_name}</b>
              {l.community_seller_profiles.is_verified && (
                <span className="ml-1 text-blue-600" title="Đã xác minh">
                  ✓
                </span>
              )}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {l.benefits?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lợi ích chính</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {l.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      ✓
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {l.description && (
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
              <Markdown content={l.description} />
            </div>
          )}

          {l.community_seller_profiles.bio && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Về {l.community_seller_profiles.display_name}
              </h2>
              {l.community_seller_profiles.headline && (
                <p className="mt-2 font-medium text-slate-700 dark:text-slate-300">
                  {l.community_seller_profiles.headline}
                </p>
              )}
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                {l.community_seller_profiles.bio}
              </p>
              {l.community_seller_profiles.years_experience != null && (
                <p className="mt-2 text-sm text-slate-500">
                  {l.community_seller_profiles.years_experience} năm kinh nghiệm
                </p>
              )}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            {l.price_text && (
              <div className="mb-4 border-b border-slate-200 pb-4 dark:border-slate-800">
                <div className="text-sm text-slate-500">Mức giá tham khảo</div>
                <div className="mt-1 text-2xl font-bold text-blue-600">{l.price_text}</div>
              </div>
            )}

            {l.offers_free_trial && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm dark:border-green-900 dark:bg-green-950">
                <div className="font-semibold text-green-800 dark:text-green-200">
                  Có gói dùng thử miễn phí
                </div>
                {l.free_trial_note && (
                  <p className="mt-1 text-green-700 dark:text-green-300">{l.free_trial_note}</p>
                )}
              </div>
            )}

            <TrialRequestForm
              listingId={l.id}
              sellerId={l.seller_id}
              offersFreeTrial={l.offers_free_trial}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
