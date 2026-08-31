import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Markdown } from '@/app/Markdown';
import { PricingTabs } from '@/app/PricingTabs';
import type { Service, PricingPlan, CaseStudy, Faq } from '@/lib/types';

export const revalidate = 60;

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!service) notFound();

  const s = service as Service;

  // Lấy song song bảng giá, dự án tiêu biểu và FAQ để giảm thời gian chờ
  const [{ data: plans }, { data: cases }, { data: faqs }] = await Promise.all([
    supabase.from('pricing_plans').select('*').eq('service_id', s.id).order('sort_order'),
    supabase
      .from('case_studies')
      .select('*')
      .eq('service_id', s.id)
      .eq('is_published', true)
      .order('sort_order'),
    // FAQ của riêng dịch vụ này + FAQ chung (service_id null)
    supabase
      .from('faqs')
      .select('*')
      .or(`service_id.eq.${s.id},service_id.is.null`)
      .eq('is_published', true)
      .order('sort_order'),
  ]);

  return (
    <div>
      {/* Hero — nền gradient tách bạch phần mở đầu với nội dung bên dưới */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <Link
            href="/"
            className="text-sm text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
          >
            ← Về trang chủ
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {s.title}
          </h1>
          {s.summary && (
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {s.summary}
            </p>
          )}

          <Link
            href={`/lien-he?service=${s.slug}`}
            className="mt-7 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Nhận tư vấn miễn phí
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {s.benefits?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Lợi ích chính</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {s.benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
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

        {s.description && (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
            <Markdown content={s.description} />
          </div>
        )}

        {plans && plans.length > 0 && (
          <PricingTabs plans={plans as PricingPlan[]} serviceSlug={s.slug} />
        )}

      {cases && cases.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dự án tiêu biểu</h2>
          <div className="mt-6 space-y-6">
            {(cases as CaseStudy[]).map((c) => (
              <article
                key={c.id}
                className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                {c.industry && (
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {c.industry}
                  </span>
                )}
                <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {c.title}
                </h3>

                <dl className="mt-4 space-y-3 text-sm">
                  {c.challenge && (
                    <div>
                      <dt className="font-semibold text-slate-900 dark:text-white">Vấn đề</dt>
                      <dd className="mt-1 text-slate-700 dark:text-slate-300">{c.challenge}</dd>
                    </div>
                  )}
                  {c.solution && (
                    <div>
                      <dt className="font-semibold text-slate-900 dark:text-white">Cách giải quyết</dt>
                      <dd className="mt-1 text-slate-700 dark:text-slate-300">{c.solution}</dd>
                    </div>
                  )}
                  {c.result && (
                    <div>
                      <dt className="font-semibold text-slate-900 dark:text-white">Kết quả</dt>
                      <dd className="mt-1 text-slate-700 dark:text-slate-300">{c.result}</dd>
                    </div>
                  )}
                </dl>

                {c.metrics?.length > 0 && (
                  <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3 dark:border-slate-800">
                    {c.metrics.map((m, i) => (
                      <div key={i}>
                        <div className="text-lg font-bold text-blue-600">{m.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {faqs && faqs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Câu hỏi thường gặp</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {(faqs as Faq[]).map((f) => (
              <details key={f.id} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900 dark:text-white">
                  <span>{f.question}</span>
                  <span className="shrink-0 text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}

        <div className="mt-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-10 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-white">Quan tâm đến giải pháp này?</h3>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Buổi khảo sát đầu tiên hoàn toàn miễn phí. Chúng tôi đánh giá hiện trạng và đề xuất
            phương án cụ thể trước khi bạn quyết định.
          </p>
          <Link
            href={`/lien-he?service=${s.slug}`}
            className="mt-6 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            Liên hệ tư vấn miễn phí
          </Link>
        </div>
      </div>
    </div>
  );
}
