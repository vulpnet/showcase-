import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';
import type { Profile } from '@/lib/types';

/**
 * Phần bên phải của thanh điều hướng — cần gọi Supabase nên tách riêng
 * và bọc trong <Suspense> ở Header. Nhờ vậy phần còn lại của trang
 * hiển thị ngay, không phải đợi kiểm tra đăng nhập xong mới vẽ.
 */
export default async function HeaderAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/dang-nhap"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Đăng nhập
      </Link>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  const isAdmin = (profile as Pick<Profile, 'role'> | null)?.role === 'admin';

  return (
    <>
      {isAdmin && (
        <Link href="/admin" className="text-sm font-medium text-blue-600 transition hover:underline">
          Quản trị
        </Link>
      )}
      <span className="hidden text-sm text-slate-500 sm:inline">{user.email}</span>
      <LogoutButton />
    </>
  );
}
