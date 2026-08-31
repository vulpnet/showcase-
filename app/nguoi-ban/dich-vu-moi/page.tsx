import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NewListingForm from './NewListingForm';
import type { CommunityCategory, Profile } from '@/lib/types';

export default async function NewListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/dang-nhap?next=/nguoi-ban/dich-vu-moi');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if ((profile as Pick<Profile, 'role'> | null)?.role !== 'seller') {
    redirect('/tro-thanh-nguoi-ban');
  }

  const { data: categories } = await supabase
    .from('community_categories')
    .select('*')
    .order('sort_order');

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/nguoi-ban" className="text-sm text-blue-600 hover:underline">
        ← Về kênh người bán
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Đăng dịch vụ mới</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Điền thông tin dịch vụ. Sau khi gửi, dịch vụ sẽ ở trạng thái chờ duyệt.
      </p>

      <NewListingForm sellerId={user.id} categories={(categories as CommunityCategory[]) ?? []} />
    </div>
  );
}
