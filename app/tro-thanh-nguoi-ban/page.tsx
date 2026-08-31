import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SellerSignupForm from './SellerSignupForm';
import type { Profile } from '@/lib/types';

export default async function BecomeSellerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trở thành người bán</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Bạn cần đăng nhập (hoặc đăng ký tài khoản mới) trước khi tạo hồ sơ người bán.
        </p>
        <Link
          href="/dang-nhap?next=/tro-thanh-nguoi-ban"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Đăng nhập / Đăng ký
        </Link>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if ((profile as Pick<Profile, 'role'> | null)?.role === 'seller') {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Bạn đã là người bán
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Tài khoản của bạn đã có hồ sơ người bán. Vào kênh người bán để đăng dịch vụ mới.
        </p>
        <Link
          href="/nguoi-ban"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Vào kênh người bán
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/cong-dong" className="text-sm text-blue-600 hover:underline">
        ← Về trang cộng đồng
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Trở thành người bán</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Điền hồ sơ năng lực để bắt đầu đăng dịch vụ trong khu vực cộng đồng. Mỗi dịch vụ đăng
        lên sẽ được đội ngũ quản trị duyệt trước khi hiển thị công khai — thường trong vòng 1-2
        ngày làm việc.
      </p>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        Khu vực cộng đồng chỉ nhận dịch vụ thuộc lĩnh vực <b>IT, dữ liệu và tự động hoá</b> (báo
        cáo, Data Warehouse, phát triển phần mềm, hạ tầng...). Nền tảng không xử lý thanh toán —
        bạn và khách hàng tự thoả thuận giá và giao dịch trực tiếp.
      </div>

      <SellerSignupForm userEmail={user.email ?? ''} />
    </div>
  );
}
