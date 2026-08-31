'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;
    const supabase = createClient();

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: (form.get('full_name') as string) || '' } },
      });
      setLoading(false);
      if (error) {
        setIsError(true);
        setMessage(error.message);
        return;
      }
      setMessage('Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }
    router.push(nextUrl);
    router.refresh();
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Về trang chủ
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
        {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Họ tên
            </label>
            <input name="full_name" className={inputClass} placeholder="Nguyễn Văn A" />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input name="email" type="email" required className={inputClass} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Mật khẩu
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className={inputClass}
            placeholder="Tối thiểu 6 ký tự"
          />
        </div>

        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              isError
                ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
        <button
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setMessage('');
          }}
          className="font-medium text-blue-600 hover:underline"
        >
          {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
        </button>
      </p>

      {/* Link đăng ký người bán tạm ẩn cùng với mục Cộng đồng trong menu */}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-slate-500">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}
