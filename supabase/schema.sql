-- =====================================================================
-- Schema cho app giới thiệu dịch vụ/giải pháp kinh doanh (showcase)
-- Chạy file này trong Supabase Dashboard > SQL Editor > New query
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROFILES — thông tin bổ sung cho user (Supabase Auth quản lý auth.users)
--    Mỗi user đăng ký sẽ tự động có 1 profile qua trigger bên dưới
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Tự tạo profile khi có user mới đăng ký
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. SERVICES — dịch vụ/giải pháp giới thiệu
-- ---------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,              -- dùng cho URL đẹp: /dich-vu/<slug>
  title text not null,
  summary text,                            -- mô tả ngắn hiện ở trang danh sách
  description text,                        -- mô tả dài (markdown) ở trang chi tiết
  benefits jsonb default '[]'::jsonb,      -- mảng lợi ích: ["Tiết kiệm 30% chi phí", ...]
  cover_image_url text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. PRICING_PLANS — bảng giá theo từng dịch vụ
-- ---------------------------------------------------------------------
create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,                      -- "Cơ bản", "Nâng cao", "Doanh nghiệp"
  price_text text not null,                -- để text thay vì số: "5.000.000đ/tháng", "Liên hệ"
  features jsonb default '[]'::jsonb,      -- ["10 người dùng", "Hỗ trợ 24/7", ...]
  is_highlighted boolean not null default false, -- gói nổi bật (viền nhấn)
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------
-- 4. CLIENTS — khách hàng tiêu biểu (logo + tên)
-- ---------------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  testimonial text,                        -- lời nhận xét của khách (tùy chọn)
  is_published boolean not null default true,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------
-- 5. LEADS — form liên hệ từ khách hàng tiềm năng
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null, -- null nếu khách chưa đăng nhập
  service_id uuid references public.services(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  company text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) — bảo mật ở tầng database
-- Nguyên tắc: khách chỉ đọc nội dung đã publish; chỉ admin mới sửa được
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.pricing_plans enable row level security;
alter table public.clients enable row level security;
alter table public.leads enable row level security;

-- Helper: kiểm tra user hiện tại có phải admin không
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- --- PROFILES ---
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- --- SERVICES: ai cũng đọc được bản đã publish, chỉ admin sửa ---
drop policy if exists "services_select_published" on public.services;
create policy "services_select_published" on public.services
  for select using (is_published = true or public.is_admin());

drop policy if exists "services_admin_all" on public.services;
create policy "services_admin_all" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- --- PRICING_PLANS: đọc theo service đã publish ---
drop policy if exists "pricing_select" on public.pricing_plans;
create policy "pricing_select" on public.pricing_plans
  for select using (
    exists (select 1 from public.services s where s.id = service_id and (s.is_published or public.is_admin()))
  );

drop policy if exists "pricing_admin_all" on public.pricing_plans;
create policy "pricing_admin_all" on public.pricing_plans
  for all using (public.is_admin()) with check (public.is_admin());

-- --- CLIENTS ---
drop policy if exists "clients_select_published" on public.clients;
create policy "clients_select_published" on public.clients
  for select using (is_published = true or public.is_admin());

drop policy if exists "clients_admin_all" on public.clients;
create policy "clients_admin_all" on public.clients
  for all using (public.is_admin()) with check (public.is_admin());

-- --- LEADS: ai cũng gửi được (kể cả khách vãng lai), chỉ admin đọc/sửa ---
drop policy if exists "leads_insert_anyone" on public.leads;
create policy "leads_insert_anyone" on public.leads
  for insert with check (true);

drop policy if exists "leads_select_own_or_admin" on public.leads;
create policy "leads_select_own_or_admin" on public.leads
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "leads_admin_update" on public.leads;
create policy "leads_admin_update" on public.leads
  for update using (public.is_admin());

-- =====================================================================
-- INDEXES — tối ưu truy vấn thường dùng
-- =====================================================================
create index if not exists idx_services_published on public.services(is_published, sort_order);
create index if not exists idx_pricing_service on public.pricing_plans(service_id, sort_order);
create index if not exists idx_clients_published on public.clients(is_published, sort_order);
create index if not exists idx_leads_created on public.leads(created_at desc);

-- =====================================================================
-- DỮ LIỆU MẪU — xoá phần này nếu không cần
-- =====================================================================
insert into public.services (slug, title, summary, description, benefits, is_published, sort_order)
values
  ('giai-phap-dwh', 'Giải pháp Data Warehouse',
   'Xây dựng kho dữ liệu tập trung, báo cáo tự động cho doanh nghiệp phân phối.',
   'Chi tiết về giải pháp DWH...',
   '["Tổng hợp dữ liệu từ nhiều nguồn", "Báo cáo realtime", "Giảm 70% thời gian tổng hợp thủ công"]'::jsonb,
   true, 1),
  ('tu-dong-hoa-quy-trinh', 'Tự động hoá quy trình',
   'Số hoá và tự động hoá các quy trình thủ công, giảm sai sót và chi phí vận hành.',
   'Chi tiết về tự động hoá...',
   '["Giảm thao tác thủ công", "Hạn chế sai sót nhập liệu", "Theo dõi tiến độ realtime"]'::jsonb,
   true, 2)
on conflict (slug) do nothing;
