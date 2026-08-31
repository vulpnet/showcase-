'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { PricingPlan } from '@/lib/types';

/**
 * Bảng giá dạng tab — bấm tên gói để chuyển qua lại, chỉ hiện chi tiết 1 gói.
 * Mặc định chọn sẵn gói được đánh dấu nổi bật (is_highlighted).
 * Trên màn hình rộng vẫn có thể xem cả 3 gói cùng lúc qua nút "So sánh tất cả".
 */
export function PricingTabs({ plans, serviceSlug }: { plans: PricingPlan[]; serviceSlug: string }) {
  // Mặc định mở gói nổi bật, nếu không có thì mở gói đầu
  const defaultIndex = Math.max(
    0,
    plans.findIndex((p) => p.is_highlighted)
  );
  const [active, setActive] = useState(defaultIndex);
  const [compareAll, setCompareAll] = useState(false);

  const current = plans[active];

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bảng giá</h2>
        <button
          type="button"
          onClick={() => setCompareAll((v) => !v)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"
        >
          {compareAll ? 'Xem từng gói' : 'So sánh tất cả'}
        </button>
      </div>

      {compareAll ? (
        // --- Chế độ so sánh: hiện cả 3 gói cạnh nhau ---
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} serviceSlug={serviceSlug} />
          ))}
        </div>
      ) : (
        <>
          {/* --- Thanh chọn gói --- */}
          <div
            role="tablist"
            aria-label="Chọn gói dịch vụ"
            className="mt-6 inline-flex w-full flex-wrap gap-1 rounded-xl bg-slate-100 p-1.5 dark:bg-slate-800/60"
          >
            {plans.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                  i === active
                    ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {p.name}
                {p.is_highlighted && (
                  <span className="ml-2 hidden rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 sm:inline dark:bg-blue-900 dark:text-blue-200">
                    Phổ biến
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* --- Chi tiết gói đang chọn --- */}
          {current && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {current.name}
                  </h3>
                  <div className="mt-1 text-3xl font-bold text-blue-600">{current.price_text}</div>
                </div>
                <Link
                  href={`/lien-he?service=${serviceSlug}&plan=${encodeURIComponent(current.name)}`}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Đăng ký tư vấn
                </Link>
              </div>

              {current.features?.length > 0 && (
                <ul className="mt-6 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800">
                  {current.features.map((f, i) => (
                    <li key={i} className="flex gap-2.5 text-slate-700 dark:text-slate-300">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                        ✓
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Thẻ gói dùng cho chế độ so sánh tất cả
function PlanCard({ plan, serviceSlug }: { plan: PricingPlan; serviceSlug: string }) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-6 ${
        plan.is_highlighted
          ? 'border-blue-500 shadow-lg ring-1 ring-blue-500'
          : 'border-slate-200 dark:border-slate-800'
      } bg-white dark:bg-slate-900`}
    >
      {plan.is_highlighted && (
        <span className="mb-3 inline-block self-start rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          Phổ biến nhất
        </span>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
      <div className="mt-2 text-2xl font-bold text-blue-600">{plan.price_text}</div>
      {plan.features?.length > 0 && (
        <ul className="mt-4 space-y-2">
          {plan.features.map((f, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="text-green-600">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
      <Link
        href={`/lien-he?service=${serviceSlug}&plan=${encodeURIComponent(plan.name)}`}
        className="mt-6 block rounded-lg bg-blue-600 px-4 py-2.5 text-center font-semibold text-white transition hover:bg-blue-700"
      >
        Đăng ký tư vấn
      </Link>
    </div>
  );
}
