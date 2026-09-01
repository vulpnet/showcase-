/**
 * Ảnh minh hoạ thu nhỏ cho từng module — dựng bằng CSS/khối hình chứ không
 * dùng ảnh chụp thật (đỡ công chụp/thiết kế, và tự động khớp theme sáng/tối).
 * Mỗi variant mô phỏng đúng bố cục của trang demo thật tương ứng.
 */
type Variant = 'sales' | 'inventory' | 'debt' | 'shipping';

const BAR_HEIGHTS: Record<Variant, number[]> = {
  sales: [40, 65, 50, 80, 95, 70],
  inventory: [82, 34, 91, 18, 76, 105],
  debt: [60, 95, 40, 90, 55, 25],
  shipping: [70, 85, 55, 90, 95, 40],
};

const COLORS: Record<Variant, string> = {
  sales: '#2563eb',
  inventory: '#16a34a',
  debt: '#dc2626',
  shipping: '#f59e0b',
};

export default function ModulePreview({ variant }: { variant: Variant }) {
  const bars = BAR_HEIGHTS[variant];
  const color = COLORS[variant];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      {/* Thanh tiêu đề giả lập cửa sổ ứng dụng */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
        <span className="size-2 rounded-full bg-red-300" />
        <span className="size-2 rounded-full bg-amber-300" />
        <span className="size-2 rounded-full bg-green-300" />
      </div>

      <div className="p-4">
        {/* Hàng KPI giả lập */}
        <div className="mb-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg bg-white p-2 dark:bg-slate-900">
              <div className="h-1.5 w-8 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-1.5 h-2.5 w-12 rounded" style={{ backgroundColor: color, opacity: 0.7 }} />
            </div>
          ))}
        </div>

        {/* Biểu đồ cột giả lập */}
        <div className="flex h-20 items-end gap-1.5 rounded-lg bg-white p-2 dark:bg-slate-900">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{ height: `${h}%`, backgroundColor: color, opacity: 0.55 + (i / bars.length) * 0.4 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
