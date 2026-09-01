import Link from 'next/link';
import type { Metadata } from 'next';
import ModulePreview from './ModulePreview';

export const metadata: Metadata = {
  title: 'DMS & Logistics — Tổng quan sản phẩm',
  robots: { index: false, follow: false },
};

const MODULES = [
  {
    variant: 'sales' as const,
    title: 'Bán hàng & Đặt hàng',
    description:
      'Nhân viên thị trường tạo đơn cho nhà phân phối theo giá sỉ, hoặc khách tự đặt hàng lẻ. Hệ thống tự tính chiết khấu theo bậc số lượng và áp khuyến mãi combo.',
    points: ['Đặt hàng theo 2 kênh: sỉ (NPP) và lẻ', 'Tự động tính chiết khấu, tặng kèm', 'Bảng giá tuỳ biến theo nhóm khách hàng'],
    demoHref: '/san-pham/dms-dashboard/dat-hang',
  },
  {
    variant: 'inventory' as const,
    title: 'Kho & Tồn kho',
    description:
      'Theo dõi mức tồn kho tại từng nhà phân phối theo thời gian thực, cảnh báo sớm khi sắp hết hàng hoặc tồn dư vượt định mức an toàn.',
    points: ['Cảnh báo tồn kho dưới ngưỡng an toàn', 'Phát hiện hàng tồn dư, chậm luân chuyển', 'Xem tồn kho theo từng NPP/khu vực'],
    demoHref: '/san-pham/dms-dashboard',
  },
  {
    variant: 'debt' as const,
    title: 'Công nợ & Tài chính',
    description:
      'Quản lý hạn mức tín dụng theo từng nhà phân phối, cảnh báo ngay khi công nợ vượt hạn mức hoặc quá hạn thanh toán.',
    points: ['Theo dõi hạn mức tín dụng theo NPP', 'Cảnh báo nợ quá hạn tự động', 'Đối chiếu công nợ minh bạch'],
    demoHref: '/san-pham/dms-dashboard',
  },
  {
    variant: 'shipping' as const,
    title: 'Vận chuyển & Giao hàng',
    description:
      'Theo dõi từng đơn hàng đang vận chuyển: vị trí trên tuyến đường, thời gian dự kiến, cảnh báo trễ hẹn theo thời gian thực.',
    points: ['Theo dõi lộ trình từng đơn hàng', 'Cảnh báo trễ hẹn ngay khi phát sinh', 'Thống kê tỷ lệ giao đúng hẹn'],
    demoHref: '/san-pham/dms-dashboard/van-chuyen',
  },
];

export default function DmsProductOverviewPage() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400">
            ← Về trang chủ
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Hệ thống quản lý phân phối &amp; vận chuyển
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Toàn bộ chuỗi phân phối — từ đặt hàng, tồn kho, công nợ đến giao hàng — theo dõi trên
            cùng một hệ thống. Xây dựng từ kinh nghiệm thực tế triển khai dữ liệu cho ngành hàng
            tiêu dùng nhanh.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/san-pham/dms-dashboard"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Xem demo Dashboard →
            </Link>
            <Link
              href="/lien-he?service=san-pham-dms-logistics"
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Liên hệ tư vấn miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* 4 MODULE */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
          4 module cốt lõi
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-600 dark:text-slate-400">
          Mỗi module hoạt động độc lập nhưng dùng chung một nguồn dữ liệu — không còn tình trạng
          số liệu lệch nhau giữa các phòng ban.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {MODULES.map((m) => (
            <div
              key={m.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <ModulePreview variant={m.variant} />

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {m.description}
              </p>

              <ul className="mt-4 space-y-2">
                {m.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="text-green-600">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={m.demoHref}
                className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:underline"
              >
                Xem demo tương tác →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* VÌ SAO CHỌN */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
            Vì sao chọn giải pháp này
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Xuất phát từ dữ liệu thật, không phải lý thuyết
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Xây dựng từ kinh nghiệm trực tiếp xử lý dữ liệu cho các doanh nghiệp phân phối
                ngành hàng tiêu dùng — hiểu rõ những vấn đề thực tế như lệch số liệu, báo cáo
                chậm, tồn kho không đồng bộ.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Một nguồn dữ liệu duy nhất
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Bán hàng, kho, công nợ và vận chuyển cùng đọc từ một cơ sở dữ liệu — không còn
                tình trạng mỗi phòng ban báo một con số khác nhau.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Triển khai theo từng giai đoạn
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Không cần triển khai toàn bộ 4 module cùng lúc. Bắt đầu từ module cần thiết nhất
                (thường là báo cáo/dashboard), mở rộng dần theo nhu cầu thực tế.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Xem thử trước khi quyết định
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Có bản demo tương tác để trải nghiệm thực tế cách hệ thống hoạt động, thay vì chỉ
                xem tài liệu mô tả hoặc ảnh chụp màn hình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA CUỐI */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Sẵn sàng xem hệ thống hoạt động?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
          Trải nghiệm cả 4 module qua bản demo tương tác, hoặc liên hệ để được tư vấn theo đúng
          quy mô doanh nghiệp của bạn.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/san-pham/dms-dashboard"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Xem demo Dashboard
          </Link>
          <Link
            href="/lien-he?service=san-pham-dms-logistics"
            className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Liên hệ tư vấn miễn phí
          </Link>
        </div>
      </section>
    </div>
  );
}
