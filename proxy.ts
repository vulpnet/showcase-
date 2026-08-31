import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
* Proxy (Next.js 16) refresh session Supabase trên mỗi request.
 * Cần thiết vì Server Component không tự set được cookie khi token hết hạn.
 */
export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Gọi getUser() để trigger refresh token nếu cần — không bỏ dòng này
  const { data: { user } } = await supabase.auth.getUser();

  // Chặn truy cập /admin và /nguoi-ban nếu chưa đăng nhập
  const path = request.nextUrl.pathname;
  const needsAuth = path.startsWith('/admin') || path.startsWith('/nguoi-ban');
  if (needsAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dang-nhap';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Chỉ chạy trên các trang thật sự cần biết trạng thái đăng nhập.
    // Trang công khai (/, /dich-vu/*, /cong-dong/*, /lien-he) bỏ qua proxy
    // để không phải chờ một lượt gọi Supabase mỗi lần chuyển trang — đây là
    // nguyên nhân chính khiến điều hướng bị chậm.
    '/admin/:path*',
    '/nguoi-ban/:path*',
    '/dang-nhap',
  ],
};
