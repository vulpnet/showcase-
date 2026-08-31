import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Service, Client } from '@/lib/types';

// Lưu tạm 5 phút — nội dung ít đổi nên cache để trang mở nhanh và giảm số lần gọi Supabase
export const revalidate = 300;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: services }, { data: clients }] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('sort_order'),
    supabase
      .from('clients')
      .select('*')
      .eq('is_published', true)
      .order('sort_order'),
  ]);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Giải pháp công nghệ cho doanh nghiệp
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Chúng tôi xây dựng hệ thống dữ liệu và tự động hoá quy trình, giúp doanh nghiệp
            vận hành hiệu quả hơn với chi phí tối ưu.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="#dich-vu"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Xem dịch vụ
            </Link>
            <Link
              href="/lien-he"
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>

      {/* DỊCH VỤ */}
      <section id="dich-vu" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dịch vụ &amp; Giải pháp</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Các giải pháp đã triển khai thực tế cho doanh nghiệp.
        </p>

        {!services?.length ? (
          <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">
            Chưa có dịch vụ nào được đăng.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {(services as Service[]).map((s) => (
              <Link
                key={s.id}
                href={`/dich-vu/${s.slug}`}
                prefetch
                className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white">
                  {s.title}
                </h3>
                {s.summary && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.summary}</p>
                )}
                {s.benefits?.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {s.benefits.slice(0, 3).map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-green-600">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <span className="mt-4 inline-block text-sm font-medium text-blue-600">
                  Tìm hiểu thêm →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* KHÁCH HÀNG */}
      {clients && clients.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Khách hàng tiêu biểu</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(clients as Client[]).map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="font-semibold text-slate-900 dark:text-white">{c.name}</div>
                  {c.testimonial && (
                    <p className="mt-3 text-sm italic text-slate-600 dark:text-slate-400">
                      &ldquo;{c.testimonial}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA CUỐI */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Cần tư vấn giải pháp phù hợp?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
          Để lại thông tin, chúng tôi sẽ liên hệ trong vòng 24 giờ làm việc.
        </p>
        <Link
          href="/lien-he"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Liên hệ ngay
        </Link>
      </section>
    </div>
  );
}
