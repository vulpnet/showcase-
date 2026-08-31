import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client dùng ở phía trình duyệt (Client Components).
 * Anon key là public-by-design — bảo mật thật nằm ở Row Level Security trong database.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
