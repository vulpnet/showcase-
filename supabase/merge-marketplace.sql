-- =====================================================================
-- Gop tinh nang Marketplace (nhieu nguoi ban dang dich vu) vao chung
-- voi Supabase project cua showcase.
--
-- Khong dung lai ten bang voi phan showcase (services/pricing_plans/...)
-- vi do la noi dung CUA BAN (1 chu quan ly), con day la noi dung CONG DONG
-- (nhieu seller tu dang). Dat prefix "community_" de tach biet ro rang.
--
-- Chay trong Supabase Dashboard > SQL Editor > New query
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. MO RONG PROFILES — them vai tro 'seller' vao rang buoc role hien co
--    Showcase dang co: check (role in ('customer', 'admin'))
--    Can doi thanh: check (role in ('customer', 'seller', 'admin'))
-- ---------------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('customer', 'seller', 'admin'));

-- ---------------------------------------------------------------------
-- 2. COMMUNITY_CATEGORIES — linh vuc dich vu, gioi han IT/du lieu/tu dong hoa
-- ---------------------------------------------------------------------
create table if not exists public.community_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------
-- 3. COMMUNITY_SELLER_PROFILES — ho so nguoi ban trong cong dong
-- ---------------------------------------------------------------------
create table if not exists public.community_seller_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null,
  headline text,
  bio text,
  years_experience int,
  website_url text,
  contact_email text not null,
  contact_phone text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4. COMMUNITY_LISTINGS — dich vu nguoi ban dang, can admin duyet
-- ---------------------------------------------------------------------
create table if not exists public.community_listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.community_seller_profiles(id) on delete cascade,
  category_id uuid references public.community_categories(id) on delete set null,
  slug text unique not null,
  title text not null,
  summary text,
  description text,
  benefits jsonb default '[]'::jsonb,
  price_text text,
  offers_free_trial boolean not null default false,
  free_trial_note text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. COMMUNITY_TRIAL_REQUESTS — yeu cau lien he/dung thu gui den seller
-- ---------------------------------------------------------------------
create table if not exists public.community_trial_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.community_listings(id) on delete cascade,
  seller_id uuid not null references public.community_seller_profiles(id) on delete cascade,
  requester_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  company text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY — dung chung ham is_admin() da co san trong showcase
-- =====================================================================

alter table public.community_categories enable row level security;
alter table public.community_seller_profiles enable row level security;
alter table public.community_listings enable row level security;
alter table public.community_trial_requests enable row level security;

-- --- CATEGORIES: ai cung doc duoc, chi admin sua ---
drop policy if exists "community_categories_select_all" on public.community_categories;
create policy "community_categories_select_all" on public.community_categories
  for select using (true);

drop policy if exists "community_categories_admin_all" on public.community_categories;
create policy "community_categories_admin_all" on public.community_categories
  for all using (public.is_admin()) with check (public.is_admin());

-- --- SELLER_PROFILES: ai cung xem duoc, chi chinh seller hoac admin sua ---
drop policy if exists "community_seller_profiles_select_all" on public.community_seller_profiles;
create policy "community_seller_profiles_select_all" on public.community_seller_profiles
  for select using (true);

drop policy if exists "community_seller_profiles_insert_own" on public.community_seller_profiles;
create policy "community_seller_profiles_insert_own" on public.community_seller_profiles
  for insert with check (auth.uid() = id);

drop policy if exists "community_seller_profiles_update_own" on public.community_seller_profiles;
create policy "community_seller_profiles_update_own" on public.community_seller_profiles
  for update using (auth.uid() = id or public.is_admin());

-- --- LISTINGS: khach chi thay ban da duyet; seller thay them cua chinh minh;
--     admin thay toan bo ---
drop policy if exists "community_listings_select_approved_or_own" on public.community_listings;
create policy "community_listings_select_approved_or_own" on public.community_listings
  for select using (
    status = 'approved' or seller_id = auth.uid() or public.is_admin()
  );

drop policy if exists "community_listings_insert_own" on public.community_listings;
create policy "community_listings_insert_own" on public.community_listings
  for insert with check (seller_id = auth.uid());

drop policy if exists "community_listings_update_own_or_admin" on public.community_listings;
create policy "community_listings_update_own_or_admin" on public.community_listings
  for update using (seller_id = auth.uid() or public.is_admin());

drop policy if exists "community_listings_delete_own_or_admin" on public.community_listings;
create policy "community_listings_delete_own_or_admin" on public.community_listings
  for delete using (seller_id = auth.uid() or public.is_admin());

-- --- TRIAL_REQUESTS: ai cung gui duoc; seller xem yeu cau gui den minh;
--     admin xem toan bo ---
drop policy if exists "community_trial_requests_insert_anyone" on public.community_trial_requests;
create policy "community_trial_requests_insert_anyone" on public.community_trial_requests
  for insert with check (true);

drop policy if exists "community_trial_requests_select_own_seller_or_admin" on public.community_trial_requests;
create policy "community_trial_requests_select_own_seller_or_admin" on public.community_trial_requests
  for select using (seller_id = auth.uid() or public.is_admin());

drop policy if exists "community_trial_requests_update_seller_or_admin" on public.community_trial_requests;
create policy "community_trial_requests_update_seller_or_admin" on public.community_trial_requests
  for update using (seller_id = auth.uid() or public.is_admin());

-- =====================================================================
-- INDEXES
-- =====================================================================
create index if not exists idx_community_listings_status on public.community_listings(status, sort_order);
create index if not exists idx_community_listings_seller on public.community_listings(seller_id);
create index if not exists idx_community_listings_category on public.community_listings(category_id);
create index if not exists idx_community_trial_requests_seller on public.community_trial_requests(seller_id, created_at desc);

-- =====================================================================
-- DANH MUC MAU
-- =====================================================================
insert into public.community_categories (slug, name, description, sort_order) values
  ('bao-cao-du-lieu', 'Báo cáo & Business Intelligence', 'Power BI, dashboard, báo cáo quản trị', 1),
  ('kho-du-lieu', 'Data Warehouse & Tích hợp dữ liệu', 'Xây dựng ETL, kho dữ liệu, đồng bộ hệ thống', 2),
  ('tu-dong-hoa', 'Tự động hoá quy trình', 'RPA, tự động hoá báo cáo, tích hợp phần mềm', 3),
  ('phat-trien-phan-mem', 'Phát triển phần mềm', 'Web, mobile, hệ thống quản lý theo yêu cầu', 4),
  ('ha-tang-bao-mat', 'Hạ tầng & Bảo mật', 'Triển khai server, bảo mật hệ thống, DevOps', 5)
on conflict (slug) do nothing;
