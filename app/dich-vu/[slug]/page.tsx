import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
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
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Về trang chủ
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">{s.title}</h1>
      {s.summary && <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">{s.summary}</p>}

      {s.benefits?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Lợi ích chính</h2>
          <ul className="mt-3 space-y-2">
            {s.benefits.map((b, i) => (
              <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                <span className="text-green-600">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {s.description && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Chi tiết</h2>
          <div className="mt-3 whitespace-pre-wrap text-slate-700 dark:text-slate-300">
            {s.description}
          </div>
        </div>
      )}

      {plans && plans.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bảng giá</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(plans as PricingPlan[]).map((p) => (
              <div
                key={p.id}
                className={`rounded-xl border p-6 ${
                  p.is_highlighted
                    ? 'border-blue-500 shadow-lg ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800'
                } bg-white dark:bg-slate-900`}
              >
                {p.is_highlighted && (
                  <span className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    Phổ biến nhất
                  </span>
                )}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{p.name}</h3>
                <div className="mt-2 text-2xl font-bold text-blue-600">{p.price_text}</div>
                {p.features?.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-green-600">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/lien-he?service=${s.slug}&plan=${encodeURIComponent(p.name)}`}
                  className="mt-6 block rounded-lg bg-blue-600 px-4 py-2.5 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Đăng ký tư vấn
                </Link>
              </div>
            ))}
          </div>
        </div>
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

      <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Quan tâm đến giải pháp này?
        </h3>
        <Link
          href={`/lien-he?service=${s.slug}`}
          className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Liên hệ tư vấn miễn phí
        </Link>
      </div>
    </div>
  );
}
