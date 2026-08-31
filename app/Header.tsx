import Link from 'next/link';
import { Suspense } from 'react';
import HeaderAuth from './HeaderAuth';

/**
 * Header tĩnh — không gọi Supabase nên trang vẽ ra được ngay.
 * Riêng phần đăng nhập bọc trong Suspense để tải song song,
 * không chặn nội dung chính của trang.
 */
export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <Link href="/" className="font-bold text-slate-900 dark:text-white" prefetch>
          Solutions
        </Link>
        <Link
          href="/#dich-vu"
          className="text-sm text-slate-600 transition hover:text-blue-600 dark:text-slate-400"
          prefetch
        >
          Dịch vụ
        </Link>
        <Link
          href="/lien-he"
          className="text-sm text-slate-600 transition hover:text-blue-600 dark:text-slate-400"
          prefetch
        >
          Liên hệ
        </Link>
        <Link
          href="/cong-dong"
          className="text-sm text-slate-600 transition hover:text-blue-600 dark:text-slate-400"
          prefetch
        >
          Cộng đồng
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {/* Ô giữ chỗ cùng chiều cao để thanh điều hướng không bị giật khi tải xong */}
          <Suspense fallback={<div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />}>
            <HeaderAuth />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
