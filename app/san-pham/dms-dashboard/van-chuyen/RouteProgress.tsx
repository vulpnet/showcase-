/**
 * Sơ đồ lộ trình dạng thanh tiến trình đơn giản (Kho -> điểm giao), không
 * dùng bản đồ thật (Google Maps...) để demo không phụ thuộc API key hay
 * phát sinh chi phí — vẫn truyền tải được ý "xe đang ở đâu trên tuyến".
 */
export default function RouteProgress({ percent, delayed }: { percent: number; delayed: boolean }) {
  const color = delayed ? '#dc2626' : percent >= 100 ? '#16a34a' : '#2563eb';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>🏭 Kho tổng</span>
        <span>📍 Điểm giao</span>
      </div>
      <div className="relative mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%`, backgroundColor: color }}
        />
        <div
          className="absolute top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-xs shadow"
          style={{ left: `calc(${Math.min(100, Math.max(0, percent))}% - 10px)`, backgroundColor: color }}
        >
          🚚
        </div>
      </div>
      <div className="mt-1 text-right text-xs text-slate-500">{percent}% quãng đường</div>
    </div>
  );
}
