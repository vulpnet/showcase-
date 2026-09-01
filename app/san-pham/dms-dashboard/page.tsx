import Link from 'next/link';
import type { Metadata } from 'next';
import DashboardDemo from './DashboardDemo';

// Không cho công cụ tìm kiếm lập chỉ mục — trang chỉ dành cho người có link riêng
export const metadata: Metadata = {
  title: 'Demo Dashboard DMS/Logistics',
  robots: { index: false, follow: false },
};

export default function DmsDashboardDemoPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/san-pham/dms"
            className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400"
          >
            ← Về trang tổng quan sản phẩm
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Demo Dashboard DMS/Logistics
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Bản xem trước hệ thống báo cáo quản trị cho doanh nghiệp phân phối — theo dõi doanh
            số, tồn kho, công nợ và giao hàng trên cùng một màn hình. Bấm vào các tab và bộ lọc
            bên dưới để trải nghiệm.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <span>⚠️</span>
            <span>Dữ liệu trong bản demo này là dữ liệu mẫu, minh hoạ cho cách trình bày.</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/san-pham/dms-dashboard/dat-hang"
              className="inline-block rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              Xem demo quy trình đặt hàng →
            </Link>
            <Link
              href="/san-pham/dms-dashboard/van-chuyen"
              className="inline-block rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              Xem demo theo dõi vận chuyển →
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <DashboardDemo />

        <div className="mt-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-10 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-white">
            Muốn dashboard này chạy với dữ liệu thật của bạn?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Gửi cho chúng tôi 1 file dữ liệu mẫu, chúng tôi dựng thử màn hình này với đúng số
            liệu của doanh nghiệp bạn trong 2-3 ngày làm việc.
          </p>
          <Link
            href="/lien-he"
            className="mt-6 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            Liên hệ tư vấn miễn phí
          </Link>
        </div>
      </div>
    </div>
  );
}
