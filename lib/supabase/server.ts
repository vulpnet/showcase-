import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase client dùng ở phía server (Server Components, Route Handlers, Server Actions).
 * Đọc/ghi session qua cookie để giữ trạng thái đăng nhập giữa các request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Gọi từ Server Component thì không set được cookie — bỏ qua an toàn,
            // middleware sẽ lo phần refresh session.
          }
        },
      },
    }
  );
}
