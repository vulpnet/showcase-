# Hướng dẫn A-Z: Tạo và deploy web app miễn phí (Next.js + Supabase + Vercel)

Tài liệu này ghi lại **toàn bộ quy trình thực tế** đã làm để tạo app `showcase` — trang giới thiệu dịch vụ có đăng nhập, quản trị nội dung và thu thập khách hàng tiềm năng, **chi phí vận hành 0đ**.

Có thể dùng lại làm khuôn mẫu cho các app tương tự sau này.

---

## Mục lục

1. [Tổng quan kiến trúc và lý do chọn](#1-tổng-quan-kiến-trúc-và-lý-do-chọn)
2. [Chuẩn bị môi trường](#2-chuẩn-bị-môi-trường)
3. [Tạo project Next.js](#3-tạo-project-nextjs)
4. [Thiết lập Supabase (database + auth)](#4-thiết-lập-supabase-database--auth)
5. [Kết nối app với Supabase](#5-kết-nối-app-với-supabase)
6. [Chạy thử ở máy local](#6-chạy-thử-ở-máy-local)
7. [Đưa code lên GitHub](#7-đưa-code-lên-github)
8. [Deploy lên Vercel](#8-deploy-lên-vercel)
9. [Cấp quyền admin](#9-cấp-quyền-admin)
10. [Quản lý nội dung hàng ngày](#10-quản-lý-nội-dung-hàng-ngày)
11. [Các lỗi thường gặp và cách xử lý](#11-các-lỗi-thường-gặp-và-cách-xử-lý)
12. [Giới hạn free tier cần biết](#12-giới-hạn-free-tier-cần-biết)

---

## 1. Tổng quan kiến trúc và lý do chọn

| Thành phần | Công nghệ | Vì sao chọn |
|---|---|---|
| Frontend | **Next.js 16** (App Router) + Tailwind CSS | SEO tốt (quan trọng khi bán hàng), render phía server, deploy Vercel miễn phí |
| Hosting FE | **Vercel** | 100GB băng thông/tháng miễn phí, không "ngủ" khi vắng khách, tự deploy khi push code |
| Backend + DB | **Supabase** (PostgreSQL) | Tự sinh REST API từ schema — **không cần tự viết backend**. Free: 500MB DB |
| Đăng nhập | **Supabase Auth** | Có sẵn đăng ký/đăng nhập/quên mật khẩu, không phải code |
| Bảo mật | **Row Level Security (RLS)** | Chặn ngay tại tầng database, không phụ thuộc code frontend |

### Vì sao không tự viết backend (.NET/Node)?

- Phải tự code: đăng nhập, phân quyền, quản lý session, upload file, trang quản trị → mất 4-6 tuần
- Tốn thêm 1 chỗ hosting riêng, mà free tier cho backend thường ngặt hơn (bị "ngủ" khi vắng khách, hoặc giới hạn CPU)
- Supabase làm sẵn tất cả những thứ trên, chỉ cần viết phần giao diện

### Vì sao không dùng Firebase?

Firebase cũng miễn phí và tốt, nhưng Firestore là NoSQL — khó làm truy vấn phức tạp (join nhiều bảng, lọc chéo điều kiện). Supabase dùng PostgreSQL nên viết SQL thoải mái.

---

## 2. Chuẩn bị môi trường

Cần cài sẵn trên máy:

| Công cụ | Kiểm tra bằng lệnh | Ghi chú |
|---|---|---|
| Node.js (>= 18) | `node --version` | Tải ở https://nodejs.org |
| npm | `npm --version` | Đi kèm Node.js |
| Git | `git --version` | Tải ở https://git-scm.com |

Cần có tài khoản (tất cả đều miễn phí, đăng ký bằng email):
- **GitHub** — https://github.com (lưu code)
- **Supabase** — https://supabase.com (database)
- **Vercel** — https://vercel.com (hosting, nên đăng nhập bằng GitHub cho tiện)

---

## 3. Tạo project Next.js

Mở terminal, chạy:

```bash
npx create-next-app@latest showcase --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm
```

Giải thích các tuỳ chọn:
- `--typescript` — dùng TypeScript (bắt lỗi sớm, gợi ý code tốt hơn)
- `--tailwind` — cài sẵn Tailwind CSS để làm giao diện nhanh
- `--app` — dùng App Router (kiến trúc mới của Next.js)
- `--no-src-dir` — không tạo thư mục `src/`, code nằm thẳng ở gốc cho gọn

Sau đó cài thư viện Supabase:

```bash
cd showcase
npm install @supabase/supabase-js @supabase/ssr
```

---

## 4. Thiết lập Supabase (database + auth)

### 4.1. Tạo Organization

1. Vào https://supabase.com → **Sign in** (đăng nhập bằng GitHub cho nhanh)
2. Nếu là lần đầu, Supabase yêu cầu tạo **Organization**:
   - **Name**: tên bất kỳ (ví dụ `My Org`)
   - **Type**: `Personal`
   - **Plan**: **Free - $0/month** ← quan trọng
3. Bấm **Create organization**

### 4.2. Tạo Project

| Trường | Điền gì |
|---|---|
| **Project name** | `showcase` (hoặc tên app của bạn) |
| **Database password** | Đặt mật khẩu mạnh — **tự lưu lại** vào trình quản lý mật khẩu. Nếu quên có thể reset ở Settings → Database |
| **Region** | **Southeast Asia (Singapore)** — gần Việt Nam nhất |
| **Enable Data API** | ✅ Bật (bắt buộc — app dùng thư viện `supabase-js` cần cái này) |
| **Automatically expose new tables** | ✅ Để mặc định cũng được |
| **Enable automatic RLS** | ⬜ Không cần — file schema sẽ tự bật RLS đúng cách cho từng bảng |

Bấm **Create new project**, chờ khoảng 2 phút.

### 4.3. Tạo bảng dữ liệu (chạy schema)

1. Trong Supabase Dashboard, sidebar bên trái chọn **SQL Editor** (icon `>_`)
2. Bấm **+ New query**
3. Mở file `supabase/schema.sql` trong project, copy toàn bộ nội dung
4. Dán vào ô SQL của Supabase → bấm **Run** (hoặc `Ctrl + Enter`)
5. Kết quả đúng: hiện **"Success. No rows returned"**

Kiểm tra lại: sidebar → **Table Editor** → phải thấy 5 bảng:

| Bảng | Chứa gì |
|---|---|
| `profiles` | Thông tin bổ sung của user + phân quyền (`customer` / `admin`) |
| `services` | Danh sách dịch vụ/giải pháp giới thiệu |
| `pricing_plans` | Bảng giá theo từng dịch vụ |
| `clients` | Khách hàng tiêu biểu |
| `leads` | Yêu cầu tư vấn khách gửi qua form |

### 4.4. Hiểu về Row Level Security (RLS)

Đây là phần **quan trọng nhất về bảo mật**. RLS là luật chặn ngay tại database:

- Khách vãng lai: chỉ **đọc** được dịch vụ có `is_published = true`
- Ai cũng **gửi** được yêu cầu tư vấn (insert vào `leads`)
- Chỉ user có `role = 'admin'` mới **sửa/xoá** được nội dung và **đọc** được danh sách leads

Nhờ RLS, dù ai lấy được API key công khai cũng không phá được dữ liệu.

---

## 5. Kết nối app với Supabase

### 5.1. Lấy API keys

1. Supabase Dashboard → **Project Settings** (icon bánh răng) → **API**
2. Copy 2 giá trị:
   - **Project URL** — dạng `https://xxxxxxxx.supabase.co`
   - **anon public** key — chuỗi dài bắt đầu bằng `eyJ...`

### 5.2. Tạo file `.env.local`

Tạo file `.env.local` ở thư mục gốc project (cùng cấp với `package.json`):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Về bảo mật**: `anon key` là **public-by-design** — Supabase thiết kế để lộ ra trình duyệt. An toàn vì bảo mật thật nằm ở RLS. Key thật sự bí mật là `service_role` key — **tuyệt đối không** để vào biến `NEXT_PUBLIC_*`.

File `.env.local` đã nằm trong `.gitignore` sẵn nên sẽ không bị đẩy lên GitHub.

### 5.3. Cấu trúc code kết nối

```
lib/supabase/client.ts    Dùng ở Client Component (form, nút bấm)
lib/supabase/server.ts    Dùng ở Server Component (trang render sẵn phía server)
proxy.ts                  Tự làm mới phiên đăng nhập + chặn /admin nếu chưa login
```

---

## 6. Chạy thử ở máy local

```bash
npm run dev
```

Mở http://localhost:3000

Kiểm tra các trang:

| Đường dẫn | Kỳ vọng |
|---|---|
| `/` | Trang chủ hiện danh sách dịch vụ (lấy từ Supabase) |
| `/dich-vu/giai-phap-dwh` | Chi tiết dịch vụ + bảng giá |
| `/lien-he` | Form gửi yêu cầu tư vấn |
| `/dang-nhap` | Đăng nhập / đăng ký |
| `/admin` | Tự chuyển sang trang đăng nhập nếu chưa login (đúng bảo mật) |

Kiểm tra build không lỗi trước khi deploy:

```bash
npm run build
```

---

## 7. Đưa code lên GitHub

### 7.1. Tạo repo trên GitHub

1. Vào https://github.com/new
2. **Repository name**: `showcase` (hoặc tên khác)
3. Chọn **Private** hoặc **Public** đều được (Vercel free hỗ trợ cả hai)
4. **Không tích** "Add a README", ".gitignore", "license" (vì project đã có sẵn)
5. Bấm **Create repository**

### 7.2. Push code lên

```bash
git add .
git commit -m "Initial: showcase app"
git branch -M main
git remote add origin https://github.com/<username>/<tên-repo>.git
git push -u origin main
```

### 7.3. Kiểm tra không lộ thông tin nhạy cảm

```bash
git ls-tree -r origin/main --name-only | grep -i env
```

Nếu **không in ra gì** là an toàn (file `.env.local` không bị đẩy lên).

---

## 8. Deploy lên Vercel

### 8.1. Import project

1. Vào https://vercel.com → đăng nhập bằng GitHub
2. **Add New...** → **Project**
3. Tìm repo vừa push → bấm **Import**
   - Nếu không thấy repo: bấm **Adjust GitHub App Permissions** để cấp quyền cho Vercel

### 8.2. Cấu hình Environment Variables

Trong màn hình cấu hình, mở mục **Environment Variables** (có thể đang bị thu gọn, bấm mũi tên để mở), thêm 2 biến:

| Type | Key | Value |
|---|---|---|
| **Config** | `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase của bạn |
| **Config** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key của bạn |

> **Lưu ý**: Chọn loại **Config**, KHÔNG chọn **Secret**. Vì biến có prefix `NEXT_PUBLIC_` bắt buộc phải đọc được từ trình duyệt — chọn Secret sẽ không tăng bảo mật mà chỉ gây bất tiện.

Ở phần **Environments**, chọn cả 3: **Production**, **Preview**, **Development**.

### 8.3. Deploy

Bấm **Create Project** / **Deploy**, chờ 1-2 phút.

Nếu project đã tạo mà chưa có deployment nào (báo *"No Production Deployment"*), trigger bằng cách push 1 commit bất kỳ:

```bash
git commit --allow-empty -m "Trigger deploy"
git push origin main
```

Từ giờ, **mỗi lần push code lên GitHub, Vercel tự động deploy lại**.

---

## 9. Cấp quyền admin

Sau khi deploy xong, tài khoản đầu tiên vẫn chỉ là `customer`. Để cấp quyền admin:

1. Vào app (local hoặc URL Vercel) → `/dang-nhap` → **đăng ký** tài khoản bằng email của bạn
2. Supabase Dashboard → **Table Editor** → bảng **`profiles`**
3. Tìm dòng có `id` khớp user vừa đăng ký
4. Sửa cột **`role`** từ `customer` thành `admin` → lưu lại
5. Quay lại app, refresh → menu **Quản trị** xuất hiện, vào được `/admin`

---

## 10. Quản lý nội dung hàng ngày

Hiện tại quản lý qua **Supabase Table Editor** (giao diện giống Excel):

| Muốn làm gì | Vào bảng | Ghi chú |
|---|---|---|
| Thêm/sửa dịch vụ | `services` | Đặt `is_published = true` để hiện ra ngoài |
| Thêm bảng giá | `pricing_plans` | Điền `service_id` để gắn với dịch vụ tương ứng |
| Thêm khách hàng tiêu biểu | `clients` | |
| Xem yêu cầu tư vấn | `leads` | Hoặc xem đẹp hơn ở trang `/admin` trên app |

Các trường dạng danh sách (`benefits`, `features`) dùng định dạng JSON:

```json
["Tiết kiệm 30% chi phí", "Triển khai trong 2 tuần", "Hỗ trợ 24/7"]
```

---

## 11. Các lỗi thường gặp và cách xử lý

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Project "xxx" already exists` khi tạo trên Vercel | Đã có project trùng tên trong tài khoản | Đổi **Project Name** thành tên khác |
| Vercel báo *"No production deployments found"* | Project tạo xong nhưng chưa deploy lần nào | Push 1 commit rỗng: `git commit --allow-empty -m "deploy" && git push` |
| Trang chủ trống, không hiện dịch vụ | Chưa chạy `schema.sql`, hoặc dịch vụ có `is_published = false` | Chạy lại schema, kiểm tra cột `is_published` trong bảng `services` |
| Cảnh báo *"Remove the public framework prefix..."* trên Vercel | Vercel nhắc biến `NEXT_PUBLIC_*` sẽ lộ ra browser | Đây là **cố ý và an toàn** — chọn loại **Config** thay vì Secret |
| `Another next dev server is already running` | Còn dev server cũ đang chạy nền | Windows: `taskkill /F /IM node.exe` rồi chạy lại `npm run dev` |
| Vào `/admin` bị đá về trang đăng nhập dù đã login | Tài khoản chưa được cấp `role = 'admin'` | Làm theo [mục 9](#9-cấp-quyền-admin) |
| Warning *"middleware file convention is deprecated"* | Next.js 16 đổi tên `middleware.ts` → `proxy.ts` | Đổi tên file thành `proxy.ts`, đổi `export async function middleware` thành `export default async function proxy` |

---

## 12. Giới hạn free tier cần biết

### Vercel (Hobby plan — miễn phí)

| Hạng mục | Giới hạn |
|---|---|
| Băng thông | 100 GB/tháng |
| Build | 6.000 phút/tháng |
| Có bị "ngủ" khi vắng khách không? | **Không** — luôn sẵn sàng |

Với vài nghìn lượt xem/tháng thì dùng chưa tới 1% hạn mức.

### Supabase (Free plan)

| Hạng mục | Giới hạn |
|---|---|
| Dung lượng database | 500 MB |
| Băng thông | 5 GB/tháng |
| Người dùng hoạt động hàng tháng | 50.000 |
| Lưu trữ file | 1 GB |

⚠️ **Lưu ý quan trọng**: Supabase free sẽ **tạm dừng project nếu không có hoạt động nào trong 7 ngày liên tiếp**. Chỉ cần vào Dashboard bấm khôi phục là chạy lại được (dữ liệu không mất). Nếu app có khách truy cập đều thì không bao giờ gặp tình trạng này.

### Khi nào cần nâng cấp trả phí?

- Vượt 500MB database (thường là khi có hàng chục nghìn bản ghi + nhiều ảnh)
- Vượt 100GB băng thông Vercel/tháng (khoảng vài trăm nghìn lượt xem)
- Cần domain riêng có SSL nâng cao, hoặc cần backup tự động hàng ngày

Ở quy mô giới thiệu dịch vụ cho khách hàng doanh nghiệp, free tier thường đủ dùng rất lâu.

---

## Phụ lục: Cấu trúc thư mục project

```
showcase/
├── app/
│   ├── page.tsx                    Trang chủ — danh sách dịch vụ + khách hàng
│   ├── layout.tsx                  Bố cục chung (header, footer)
│   ├── Header.tsx                  Thanh điều hướng (hiện menu Quản trị nếu là admin)
│   ├── LogoutButton.tsx            Nút đăng xuất
│   ├── dich-vu/[slug]/page.tsx     Chi tiết dịch vụ + bảng giá
│   ├── lien-he/
│   │   ├── page.tsx                Trang liên hệ
│   │   └── ContactForm.tsx         Form gửi yêu cầu tư vấn
│   ├── dang-nhap/page.tsx          Đăng nhập / đăng ký
│   └── admin/page.tsx              Trang quản trị — xem danh sách leads
├── lib/
│   ├── supabase/client.ts          Kết nối Supabase phía trình duyệt
│   ├── supabase/server.ts          Kết nối Supabase phía server
│   └── types.ts                    Định nghĩa kiểu dữ liệu khớp database
├── supabase/
│   └── schema.sql                  Toàn bộ cấu trúc database + luật bảo mật RLS
├── proxy.ts                        Làm mới phiên đăng nhập, chặn /admin
├── .env.local                      API keys (KHÔNG đẩy lên GitHub)
└── .env.example                    File mẫu để người khác biết cần điền gì
```
