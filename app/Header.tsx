import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';
import type { Profile } from '@/lib/types';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    isAdmin = (profile as Pick<Profile, 'role'> | null)?.role === 'admin';
  }

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <Link href="/" className="font-bold text-slate-900 dark:text-white">
          Solutions
        </Link>
        <Link
          href="/#dich-vu"
          className="text-sm text-slate-600 transition hover:text-blue-600 dark:text-slate-400"
        >
          Dịch vụ
        </Link>
        <Link
          href="/lien-he"
          className="text-sm text-slate-600 transition hover:text-blue-600 dark:text-slate-400"
        >
          Liên hệ
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-blue-600 transition hover:underline"
            >
              Quản trị
            </Link>
          )}
          {user ? (
            <>
              <span className="hidden text-sm text-slate-500 sm:inline">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/dang-nhap"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
