# Showcase — Trang giới thiệu dịch vụ/giải pháp

App giới thiệu dịch vụ kinh doanh với CMS, đăng nhập khách hàng và thu thập yêu cầu tư vấn.
**Chi phí vận hành: 0đ** (Vercel free tier + Supabase free tier).

## Kiến trúc

| Thành phần | Công nghệ | Free tier |
|---|---|---|
| Frontend | Next.js 16 (App Router) + Tailwind | Vercel: 100GB băng thông/tháng |
| Backend/DB | Supabase (PostgreSQL) | 500MB DB, 50k monthly active users |
| Auth | Supabase Auth (email/password) | Miễn phí |
| Bảo mật | Row Level Security ở tầng database | — |

Không cần tự viết API — Supabase tự sinh REST API từ schema, bảo mật bằng RLS policy.

## Setup lần đầu

### 1. Tạo Supabase project
1. Vào https://supabase.com → đăng ký/đăng nhập (free, không cần thẻ)
2. **New project** → đặt tên, chọn region gần VN nhất (Singapore), đặt mật khẩu DB
3. Chờ ~2 phút để project khởi tạo xong

### 2. Tạo database schema
1. Trong Supabase Dashboard → **SQL Editor** → **New query**
2. Copy toàn bộ nội dung file `supabase/schema.sql` vào rồi bấm **Run**
3. Schema sẽ tạo các bảng: `profiles`, `services`, `pricing_plans`, `clients`, `leads` + RLS policies + dữ liệu mẫu
4. Chạy tiếp `supabase/merge-marketplace.sql` để bật khu vực **cộng đồng** (marketplace nhiều
   người bán) — tạo thêm `community_categories`, `community_seller_profiles`,
   `community_listings`, `community_trial_requests`, và mở rộng `profiles.role` để nhận thêm
   giá trị `seller`

### 3. Lấy API keys
1. Supabase Dashboard → **Project Settings** → **API**
2. Copy `Project URL` và `anon public` key
3. Tạo file `.env.local` ở thư mục gốc project (copy từ `.env.example`), điền 2 giá trị vào

### 4. Chạy thử local
```bash
npm install
npm run dev
```
Mở http://localhost:3000

### 5. Cấp quyền admin cho tài khoản của bạn
1. Đăng ký tài khoản qua trang `/dang-nhap` trên app
2. Supabase Dashboard → **Table Editor** → bảng `profiles`
3. Tìm dòng có email của bạn → đổi cột `role` từ `customer` thành `admin`
4. Refresh app → menu "Quản trị" sẽ xuất hiện

## Deploy lên Vercel (miễn phí)

1. Push code lên GitHub repo
2. Vào https://vercel.com → **Add New Project** → import repo vừa push
3. Ở phần **Environment Variables**, thêm 2 biến giống trong `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Bấm **Deploy** — xong, có URL public dạng `<tên-project>.vercel.app`

Mỗi lần push code lên GitHub, Vercel tự động deploy lại.

## Quản lý nội dung

Hiện tại quản lý qua **Supabase Table Editor** (giao diện bảng như Excel):
- **services** — thêm/sửa dịch vụ, đặt `is_published = true` để hiện ra ngoài
- **pricing_plans** — bảng giá theo từng dịch vụ (dùng `service_id` để liên kết)
- **clients** — khách hàng tiêu biểu
- **leads** — xem yêu cầu tư vấn khách gửi (cũng xem được qua trang `/admin` trên app)

Nếu sau này cần giao diện quản trị đầy đủ hơn (thêm/sửa dịch vụ ngay trên app), có thể mở rộng trang `/admin`.

## Khu vực cộng đồng (marketplace)

Ngoài dịch vụ chính do bạn quản lý (`services`), web còn có khu vực **cộng đồng** — nơi
người dùng khác tự đăng ký làm người bán và đăng dịch vụ của họ, tách biệt hoàn toàn về dữ
liệu (bảng `community_*`) nhưng dùng chung 1 Supabase project, 1 domain.

| Vai trò | Làm được gì |
|---|---|
| `customer` (mặc định) | Xem dịch vụ, gửi yêu cầu liên hệ/dùng thử |
| `seller` | Đăng dịch vụ trong `/nguoi-ban` (cần admin duyệt), xem yêu cầu gửi đến |
| `admin` | Duyệt/từ chối dịch vụ cộng đồng (ở cuối trang `/admin`), quản lý dịch vụ chính |

**Luồng:** `/cong-dong` (trang giới thiệu) → `/tro-thanh-nguoi-ban` (nâng cấp role thành
seller) → `/nguoi-ban/dich-vu-moi` (đăng dịch vụ, mặc định `pending`) → admin duyệt tại
`/admin` → dịch vụ hiện công khai ở `/cong-dong/dich-vu`.

**Không xử lý thanh toán** — form chỉ chuyển tiếp thông tin liên hệ, khách và người bán tự
thoả thuận và giao dịch bên ngoài nền tảng.

## Sản phẩm DMS & Logistics

Dịch vụ "Sản phẩm DMS & Logistics" (bảng `services`, slug `san-pham-dms-logistics`) có bộ
demo tương tác riêng, đóng vai trò PoC/thử nghiệm ý tưởng trước khi triển khai bản chính thức
bằng **Blazor** (kế hoạch riêng, không nằm trong repo này).

**Cấu trúc demo — 1 trang tổng quan dẫn vào 3 lớp demo tương tác:**

```
/san-pham/dms                          Trang tổng quan — 4 module + ảnh minh hoạ mockup
      │
      ├─ /san-pham/dms-dashboard              Lớp 1: Dashboard báo cáo
      │     (Doanh số/Đơn hàng, Tồn kho, Công nợ, Vận chuyển — biểu đồ recharts)
      │
      ├─ /san-pham/dms-dashboard/dat-hang     Lớp 2: Quy trình đặt hàng
      │     (Kênh NPP bán sỉ + Kênh bán lẻ, engine tính giá + khuyến mãi dùng chung)
      │
      └─ /san-pham/dms-dashboard/van-chuyen   Lớp 3: Theo dõi vận chuyển
            (Danh sách đơn, lọc trạng thái/khu vực, timeline chi tiết từng đơn)
```

Cả 4 trang đặt `robots: { index: false, follow: false }` — không bị Google lập chỉ mục, chỉ
ai có link riêng mới vào được. Mô hình phân phối: khách đăng ký dịch vụ (gói "Xem demo" miễn
phí) → admin đổi trạng thái lead sang "Đã liên hệ" ở `/admin` → hệ thống **tự động gửi email**
kèm link demo (xem mục Gửi email bên dưới).

**Engine tính giá/khuyến mãi** (`app/san-pham/dms-dashboard/dat-hang/pricing.ts`) đã verify
bằng test số trước khi dựng UI — dùng làm spec tham chiếu khi viết lại bằng C#:
- Chiết khấu bậc thang theo tổng số lượng: ≥50 đơn vị giảm 5%, ≥100 đơn vị giảm 10%
- Tặng kèm khi mua combo: từ 2 sản phẩm trở lên, mỗi loại ≥20 đơn vị → tặng 1 đơn vị/loại

Dữ liệu mẫu dùng bối cảnh FMCG (nước giải khát/thực phẩm) — `mock-data.ts`, `order-data.ts`,
`shipment-data.ts`, không kết nối gì bên ngoài.

**Roadmap ý tưởng — chưa làm, cân nhắc khi port sang Blazor:**

| Hạng mục | Mô tả |
|---|---|
| Trang landing riêng cho DMS | Tách khỏi menu showcase chung, vì DMS dự kiến là sản phẩm chủ lực |
| Video demo ngắn 60-90s | Khách B2B thường lười tự bấm thử, video thuyết phục nhanh hơn |
| Khối "So sánh trước/sau" | Ở đầu dashboard, đánh vào nỗi đau cụ thể (vd "Trước: 3 ngày tổng hợp báo cáo → Sau: tức thời") |
| Case study thật | Thay 2 case study mẫu hiện có khi có khách đầu tiên dùng thử |
| Trang "Về chúng tôi" | Kể kinh nghiệm thực tế — DMS cần niềm tin, khách sẽ tra cứu người đứng sau |
| Demo tuỳ biến theo tên khách | Nhập tên công ty → dashboard hiện đúng tên, tăng cảm giác "riêng cho bạn" |
| Cảnh báo tự động qua Zalo/Telegram | Minh hoạ tính năng tự động hoá tồn kho/công nợ |

## Gửi email link demo (Lead → Đã liên hệ)

Khi admin đổi trạng thái 1 yêu cầu ở `/admin` sang **"Đã liên hệ"**, hệ thống tự động gửi
email chứa link demo (`/san-pham/dms-dashboard`) đến đúng địa chỉ email của khách trong lead
đó — xem `app/api/send-demo-link/route.ts` + `app/admin/LeadStatusSelect.tsx`.

- Gửi qua **Gmail SMTP** (thư viện `nodemailer`), xác thực bằng session admin đang đăng nhập
  (không dùng `service_role` key) — API tự chặn nếu người gọi không phải admin
- Cần cấu hình 2 biến môi trường **chỉ ở server** (không có tiền tố `NEXT_PUBLIC_`, không lộ
  ra client) — xem `.env.example`:
  - `GMAIL_USER` — địa chỉ Gmail dùng để gửi
  - `GMAIL_APP_PASSWORD` — **App Password** tạo tại
    [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (cần bật
    Xác minh 2 bước trước), **không phải** mật khẩu Gmail thường
- Trên Vercel: thêm 2 biến này ở **Settings → Environment Variables**, rồi **Redeploy** để áp
  dụng
- Trước khi đổi trạng thái, admin sẽ được hỏi xác nhận (vì đây là hành động gửi mail thật đến
  khách, không nên xảy ra do bấm nhầm dropdown)

## Cấu trúc thư mục

```
app/
  page.tsx                        Trang chủ — danh sách dịch vụ + khách hàng
  dich-vu/[slug]/page.tsx         Chi tiết dịch vụ chính + bảng giá
  lien-he/                        Form thu thập yêu cầu tư vấn
  dang-nhap/page.tsx              Đăng nhập / đăng ký
  admin/page.tsx                  Quản trị — xem leads + duyệt dịch vụ cộng đồng
  Header.tsx                      Navigation (hiện menu theo role)

  cong-dong/page.tsx              Trang giới thiệu khu vực cộng đồng
  cong-dong/dich-vu/              Danh sách + chi tiết dịch vụ cộng đồng
  tro-thanh-nguoi-ban/page.tsx    Đăng ký làm người bán (nâng role → seller)
  nguoi-ban/page.tsx              Kênh người bán — dịch vụ của tôi + yêu cầu gửi đến
  nguoi-ban/dich-vu-moi/page.tsx  Form đăng dịch vụ mới (status=pending)

  api/send-demo-link/route.ts    Gửi email link demo qua Gmail SMTP khi admin duyệt lead

  san-pham/dms/page.tsx                        Tổng quan sản phẩm DMS — 4 module + preview
  san-pham/dms-dashboard/page.tsx              Demo Lớp 1: Dashboard báo cáo
  san-pham/dms-dashboard/dat-hang/             Demo Lớp 2: Quy trình đặt hàng + engine giá
  san-pham/dms-dashboard/van-chuyen/           Demo Lớp 3: Theo dõi vận chuyển

lib/
  supabase/client.ts        Supabase client cho Client Component
  supabase/server.ts        Supabase client cho Server Component
  types.ts                  TypeScript types khớp với DB schema
proxy.ts                    Refresh session + chặn /admin, /nguoi-ban nếu chưa đăng nhập
supabase/schema.sql             Database schema chính + RLS policies
supabase/merge-marketplace.sql  Schema khu vực cộng đồng (community_*) + RLS policies
supabase/add-dms-service.sql    Dịch vụ "Sản phẩm DMS & Logistics" + bảng giá + FAQ
```

## Lưu ý về bảo mật

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` là **public-by-design**, an toàn khi lộ ra client.
  Bảo mật thật nằm ở **Row Level Security policies** trong `schema.sql`:
  - Khách chỉ đọc được nội dung `is_published = true`
  - Chỉ user có `role = 'admin'` mới sửa/xoá được dữ liệu
  - Ai cũng gửi được lead, nhưng chỉ admin đọc được danh sách
- Với khu vực cộng đồng: seller chỉ sửa được dữ liệu của chính mình và **không có cách nào
  tự đổi `status` của listing** — RLS ở `merge-marketplace.sql` chỉ cho phép seller cập nhật
  dòng của mình, nhưng chỉ admin mới có quyền chuyển `pending` → `approved`/`rejected` (thực
  thi qua policy `community_listings_update_own_or_admin` kết hợp kiểm tra ở tầng ứng dụng)
