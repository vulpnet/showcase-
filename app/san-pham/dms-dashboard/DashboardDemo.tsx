'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  DEBT_STATUS,
  DELIVERY_STATS,
  DELIVERY_SUMMARY,
  INVENTORY_STATUS,
  MONTHLY_REVENUE,
  REGIONS,
  REVENUE_BY_REGION,
  TOP_PRODUCTS,
} from './mock-data';

type Tab = 'doanh-so' | 'ton-kho' | 'cong-no' | 'van-chuyen';

const TABS: { key: Tab; label: string }[] = [
  { key: 'doanh-so', label: 'Doanh số & Đơn hàng' },
  { key: 'ton-kho', label: 'Tồn kho' },
  { key: 'cong-no', label: 'Công nợ' },
  { key: 'van-chuyen', label: 'Vận chuyển & Giao hàng' },
];

const CHART_COLOR = '#2563eb';
const WARN_COLOR = '#f59e0b';
const DANGER_COLOR = '#dc2626';
const OK_COLOR = '#16a34a';

function fmt(n: number) {
  return n.toLocaleString('vi-VN');
}

function KpiCard({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'ok' | 'warn' | 'danger' }) {
  const toneClass =
    tone === 'danger'
      ? 'text-red-600 dark:text-red-400'
      : tone === 'warn'
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-slate-900 dark:text-white';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

export default function DashboardDemo() {
  const [tab, setTab] = useState<Tab>('doanh-so');
  const [region, setRegion] = useState<string>('Tất cả');

  const filteredRevenueByRegion =
    region === 'Tất cả' ? REVENUE_BY_REGION : REVENUE_BY_REGION.filter((r) => r.region === region);

  return (
    <div>
      {/* Thanh tab */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t.key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-slate-500">Khu vực:</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
          >
            <option>Tất cả</option>
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== TAB: DOANH SỐ & ĐƠN HÀNG ===== */}
      {tab === 'doanh-so' && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard label="Doanh thu tháng này" value="6.210 triệu đ" sub="+5,4% so với tháng trước" />
            <KpiCard label="Số đơn hàng" value="3.284 đơn" sub="Trung bình 1,9 triệu đ/đơn" />
            <KpiCard label="Đạt mục tiêu" value="112,9%" sub="Mục tiêu: 5.500 triệu đ" tone="ok" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">Doanh thu 6 tháng gần nhất</h3>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_REVENUE}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => `${fmt(Number(v))} triệu đ`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke={CHART_COLOR} strokeWidth={2.5} />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Mục tiêu"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">Doanh thu theo khu vực</h3>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredRevenueByRegion}
                      dataKey="revenue"
                      nameKey="region"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(entry: unknown) => {
                        const e = entry as { region: string; revenue: number };
                        return `${e.region}: ${fmt(e.revenue)}tr`;
                      }}
                    >
                      {filteredRevenueByRegion.map((_, i) => (
                        <Cell key={i} fill={['#2563eb', '#60a5fa', '#93c5fd'][i % 3]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${fmt(Number(v))} triệu đ`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">Top sản phẩm bán chạy</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="pb-2 pr-4">Sản phẩm</th>
                    <th className="pb-2 pr-4">Sản lượng (thùng)</th>
                    <th className="pb-2">Doanh thu (triệu đ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {TOP_PRODUCTS.map((p) => (
                    <tr key={p.name}>
                      <td className="py-2 pr-4 font-medium text-slate-900 dark:text-white">{p.name}</td>
                      <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{fmt(p.units)}</td>
                      <td className="py-2 text-slate-600 dark:text-slate-400">{fmt(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: TỒN KHO ===== */}
      {tab === 'ton-kho' && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="NPP sắp hết hàng"
              value={`${INVENTORY_STATUS.filter((d) => d.status === 'sắp hết').length} nhà phân phối`}
              tone="danger"
            />
            <KpiCard
              label="NPP tồn dư"
              value={`${INVENTORY_STATUS.filter((d) => d.status === 'tồn dư').length} nhà phân phối`}
              tone="warn"
            />
            <KpiCard
              label="NPP tồn kho ổn định"
              value={`${INVENTORY_STATUS.filter((d) => d.status === 'ổn định').length} nhà phân phối`}
              tone="ok"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Mức tồn kho theo nhà phân phối (% so với định mức an toàn)
            </h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INVENTORY_STATUS} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis type="number" tick={{ fontSize: 12 }} unit="%" />
                  <YAxis type="category" dataKey="distributor" tick={{ fontSize: 12 }} width={140} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="stockLevel" name="Mức tồn kho" radius={[0, 4, 4, 0]}>
                    {INVENTORY_STATUS.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.status === 'sắp hết' ? DANGER_COLOR : d.status === 'tồn dư' ? WARN_COLOR : OK_COLOR}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Đỏ: dưới 40% định mức (cần bổ sung gấp) · Vàng: trên 100% (tồn dư, giảm luân chuyển) · Xanh: ổn định
            </p>
          </div>
        </div>
      )}

      {/* ===== TAB: CÔNG NỢ ===== */}
      {tab === 'cong-no' && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Tổng công nợ"
              value={`${fmt(DEBT_STATUS.reduce((s, d) => s + d.currentDebt, 0))} triệu đ`}
            />
            <KpiCard
              label="Nợ quá hạn"
              value={`${fmt(DEBT_STATUS.reduce((s, d) => s + d.overdue, 0))} triệu đ`}
              tone="danger"
            />
            <KpiCard
              label="NPP vượt hạn mức"
              value={`${DEBT_STATUS.filter((d) => d.currentDebt > d.creditLimit).length} nhà phân phối`}
              tone="warn"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">Công nợ theo nhà phân phối</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="pb-2 pr-4">Nhà phân phối</th>
                    <th className="pb-2 pr-4">Hạn mức</th>
                    <th className="pb-2 pr-4">Công nợ hiện tại</th>
                    <th className="pb-2 pr-4">Nợ quá hạn</th>
                    <th className="pb-2">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {DEBT_STATUS.map((d) => {
                    const overLimit = d.currentDebt > d.creditLimit;
                    return (
                      <tr key={d.distributor}>
                        <td className="py-2 pr-4 font-medium text-slate-900 dark:text-white">{d.distributor}</td>
                        <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{fmt(d.creditLimit)} tr</td>
                        <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{fmt(d.currentDebt)} tr</td>
                        <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">
                          {d.overdue > 0 ? `${fmt(d.overdue)} tr` : '—'}
                        </td>
                        <td className="py-2">
                          {overLimit ? (
                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-200">
                              Vượt hạn mức
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-200">
                              Bình thường
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: VẬN CHUYỂN & GIAO HÀNG ===== */}
      {tab === 'van-chuyen' && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <KpiCard label="Tổng đơn 7 ngày" value={fmt(DELIVERY_SUMMARY.totalOrders)} />
            <KpiCard label="Tỷ lệ giao đúng hẹn" value={`${DELIVERY_SUMMARY.onTimeRate}%`} tone="ok" />
            <KpiCard label="Thời gian giao TB" value={`${DELIVERY_SUMMARY.avgDeliveryHours} giờ`} />
            <KpiCard label="Đơn đang vận chuyển" value={fmt(DELIVERY_SUMMARY.activeShipments)} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">Giao hàng đúng hẹn theo ngày</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DELIVERY_STATS}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="onTime" name="Đúng hẹn" fill={OK_COLOR} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late" name="Trễ hẹn" fill={DANGER_COLOR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
