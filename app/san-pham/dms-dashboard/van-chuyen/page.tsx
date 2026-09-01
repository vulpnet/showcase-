import Link from 'next/link';
import type { Metadata } from 'next';
import ShipmentTracker from './ShipmentTracker';

export const metadata: Metadata = {
  title: 'Demo Theo dõi vận chuyển DMS',
  robots: { index: false, follow: false },
};

export default function ShipmentTrackingPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/san-pham/dms-dashboard"
            className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400"
          >
            ← Về trang demo Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Demo Theo dõi vận chuyển
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Theo dõi từng đơn hàng đang vận chuyển theo thời gian thực — trạng thái, vị trí trên
            tuyến đường và cảnh báo trễ hẹn. Bấm vào 1 đơn ở danh sách để xem chi tiết lộ trình.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <span>⚠️</span>
            <span>Dữ liệu trong bản demo này là dữ liệu mẫu, minh hoạ cho cách trình bày.</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/san-pham/dms-dashboard"
              className="inline-block rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              ← Xem demo Dashboard báo cáo
            </Link>
            <Link
              href="/san-pham/dms-dashboard/dat-hang"
              className="inline-block rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              Xem demo quy trình đặt hàng →
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <ShipmentTracker />

        <div className="mt-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-10 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-white">
            Muốn theo dõi vận chuyển thật cho đội xe của bạn?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Chúng tôi kết nối với thiết bị định vị GPS hoặc ứng dụng tài xế hiện có để cập nhật
            trạng thái tự động, không cần nhập tay.
          </p>
          <Link
            href="/lien-he?service=san-pham-dms-logistics"
            className="mt-6 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            Liên hệ tư vấn miễn phí
          </Link>
        </div>
      </div>
    </div>
  );
}
