import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Service, PricingPlan } from '@/lib/types';

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

  const { data: plans } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('service_id', (service as Service).id)
    .order('sort_order');

  const s = service as Service;

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
