import { createClient } from '@/lib/supabase/server';
import ContactForm from './ContactForm';
import type { Service } from '@/lib/types';

export const revalidate = 60;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; plan?: string }>;
}) {
  const { service: serviceSlug, plan } = await searchParams;
  const supabase = await createClient();

  const { data: services } = await supabase
    .from('services')
    .select('id, slug, title')
    .eq('is_published', true)
    .order('sort_order');

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Liên hệ tư vấn</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Để lại thông tin, chúng tôi sẽ liên hệ trong vòng 24 giờ làm việc.
        {plan && <span className="block mt-1 font-medium text-blue-600">Gói quan tâm: {plan}</span>}
      </p>

      <ContactForm
        services={(services as Pick<Service, 'id' | 'slug' | 'title'>[]) ?? []}
        defaultServiceSlug={serviceSlug}
        defaultEmail={user?.email ?? ''}
        planName={plan}
      />
    </div>
  );
}
