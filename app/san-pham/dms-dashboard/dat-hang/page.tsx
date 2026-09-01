import Link from 'next/link';
import type { Metadata } from 'next';
import OrderDemo from './OrderDemo';

export const metadata: Metadata = {
  title: 'Demo Quy trình đặt hàng DMS',
  robots: { index: false, follow: false },
};

export default function OrderDemoPage() {
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
            Demo Quy trình đặt hàng
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Mô phỏng 2 kênh bán hàng: nhân viên tạo đơn sỉ cho nhà phân phối, và khách tự đặt
            hàng lẻ. Hệ thống tự tính chiết khấu và tặng kèm theo số lượng đặt hàng.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <span>⚠️</span>
            <span>Đây là bản demo minh hoạ quy trình — đơn hàng không được lưu lại.</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <OrderDemo />

        <div className="mt-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-10 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-white">
            Muốn quy trình này áp dụng đúng chính sách giá của bạn?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Chúng tôi tuỳ biến quy tắc khuyến mãi, bảng giá theo từng nhóm khách hàng, và kết nối
            với hệ thống kho/công nợ hiện có của bạn.
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
