'use client';

import { useMemo, useState } from 'react';
import RouteProgress from './RouteProgress';
import { REGION_LIST, SHIPMENTS, STATUS_COLOR, STATUS_LABEL, type ShipmentStatus } from './shipment-data';

const STATUS_FILTERS: { key: ShipmentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'picked_up', label: STATUS_LABEL.picked_up },
  { key: 'in_transit', label: STATUS_LABEL.in_transit },
  { key: 'out_for_delivery', label: STATUS_LABEL.out_for_delivery },
  { key: 'delivered', label: STATUS_LABEL.delivered },
  { key: 'delayed', label: STATUS_LABEL.delayed },
];

function fmtEta(hours: number) {
  if (hours < 0) return `Trễ ${Math.abs(hours).toFixed(1)} giờ`;
  if (hours === 0) return 'Đã hoàn tất';
  return `Còn ${hours.toFixed(1)} giờ`;
}

export default function ShipmentTracker() {
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('Tất cả');
  const [selectedId, setSelectedId] = useState<string>(SHIPMENTS[0].id);

  const filtered = useMemo(() => {
    return SHIPMENTS.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (regionFilter !== 'Tất cả' && s.region !== regionFilter) return false;
      return true;
    });
  }, [statusFilter, regionFilter]);

  const selected = SHIPMENTS.find((s) => s.id === selectedId) ?? filtered[0];

  const summary = {
    total: SHIPMENTS.length,
    delayed: SHIPMENTS.filter((s) => s.status === 'delayed').length,
    delivered: SHIPMENTS.filter((s) => s.status === 'delivered').length,
    onTimeRate: Math.round(
      (SHIPMENTS.filter((s) => s.status !== 'delayed').length / SHIPMENTS.length) * 100
    ),
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500">Tổng đơn đang theo dõi</div>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{summary.total}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500">Đơn trễ hẹn</div>
          <div className="mt-1 text-2xl font-bold text-red-600">{summary.delayed}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500">Đã giao thành công</div>
          <div className="mt-1 text-2xl font-bold text-green-600">{summary.delivered}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500">Tỷ lệ đúng hẹn</div>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{summary.onTimeRate}%</div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                statusFilter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-slate-500">Khu vực:</label>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
          >
            <option>Tất cả</option>
            {REGION_LIST.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Danh sách đơn */}
        <div className="lg:col-span-2">
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
              Không có đơn nào khớp bộ lọc.
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selected?.id === s.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                      : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">{s.id}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[s.status]}`}>
                      {STATUS_LABEL[s.status]}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.distributor}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {s.region} · {fmtEta(s.etaHours)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chi tiết đơn được chọn */}
        <div className="lg:col-span-3">
          {selected && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selected.id}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selected.distributor}</p>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${STATUS_COLOR[selected.status]}`}>
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-slate-500">Tài xế</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{selected.driver}</div>
                </div>
                <div>
                  <div className="text-slate-500">Phương tiện</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{selected.vehicle}</div>
                </div>
                <div>
                  <div className="text-slate-500">Quãng đường</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{selected.distanceKm} km</div>
                </div>
              </div>

              <div className="mt-6">
                <RouteProgress percent={selected.progressPercent} delayed={selected.status === 'delayed'} />
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Lộ trình chi tiết</h4>
                <ol className="mt-3 space-y-4">
                  {selected.timeline.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            step.delayed
                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                              : step.done
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          }`}
                        >
                          {step.delayed ? '!' : step.done ? '✓' : i + 1}
                        </span>
                        {i < selected.timeline.length - 1 && (
                          <span className="mt-1 h-8 w-px bg-slate-200 dark:bg-slate-700" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`text-sm font-medium ${
                            step.delayed
                              ? 'text-red-600'
                              : step.done
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </div>
                        <div className="text-xs text-slate-500">{step.time}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
