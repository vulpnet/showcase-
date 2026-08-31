-- =====================================================================
-- NỘI DUNG DỊCH VỤ THẬT + 2 BẢNG BỔ SUNG (case_studies, faqs)
-- Chạy file này trong Supabase Dashboard > SQL Editor > New query
-- An toàn khi chạy lại nhiều lần (idempotent)
-- =====================================================================

-- ---------------------------------------------------------------------
-- PHẦN A — 2 BẢNG MỚI
-- ---------------------------------------------------------------------

-- CASE_STUDIES — kể lại dự án đã làm: vấn đề → cách giải → kết quả
create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete set null,
  slug text unique not null,
  title text not null,
  industry text,                            -- ngành: "Hàng tiêu dùng", "Dược phẩm"...
  challenge text,                           -- vấn đề khách gặp phải
  solution text,                            -- cách mình giải quyết
  result text,                              -- kết quả đạt được
  metrics jsonb default '[]'::jsonb,        -- [{"label":"Thời gian chạy báo cáo","value":"-92%"}]
  cover_image_url text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- FAQS — câu hỏi thường gặp, gắn theo dịch vụ hoặc chung
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete cascade, -- null = câu hỏi chung
  question text not null,
  answer text not null,
  is_published boolean not null default true,
  sort_order int not null default 0
);

-- RLS cho 2 bảng mới — cùng nguyên tắc: khách đọc bản publish, admin toàn quyền
alter table public.case_studies enable row level security;
alter table public.faqs enable row level security;

drop policy if exists "case_studies_select_published" on public.case_studies;
create policy "case_studies_select_published" on public.case_studies
  for select using (is_published = true or public.is_admin());

drop policy if exists "case_studies_admin_all" on public.case_studies;
create policy "case_studies_admin_all" on public.case_studies
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "faqs_select_published" on public.faqs;
create policy "faqs_select_published" on public.faqs
  for select using (is_published = true or public.is_admin());

drop policy if exists "faqs_admin_all" on public.faqs;
create policy "faqs_admin_all" on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

create index if not exists idx_case_studies_published on public.case_studies(is_published, sort_order);
create index if not exists idx_faqs_service on public.faqs(service_id, sort_order);

-- ---------------------------------------------------------------------
-- PHẦN B — DỌN DỮ LIỆU MẪU CŨ
-- ---------------------------------------------------------------------
delete from public.services where slug in ('giai-phap-dwh', 'tu-dong-hoa-quy-trinh');

-- ---------------------------------------------------------------------
-- PHẦN C — 3 DỊCH VỤ CHÍNH
-- ---------------------------------------------------------------------

insert into public.services (slug, title, summary, description, benefits, is_published, sort_order)
values
-- === DỊCH VỤ 1 ===
('he-thong-bao-cao-quan-tri',
 'Hệ thống báo cáo quản trị',
 'Toàn bộ số liệu doanh thu, tồn kho, công nợ, KPI gom về một màn hình. Xem được trên máy tính và điện thoại, cập nhật tự động mỗi ngày.',
 E'## Vấn đề bạn đang gặp\n\nMỗi cuối tháng phải chờ kế toán tổng hợp file Excel. Số liệu gửi lên thì đã cũ, muốn xem chi tiết hơn lại phải hỏi lại. Mỗi phòng ban báo một con số khác nhau, không biết tin ai.\n\n## Chúng tôi làm gì\n\nChúng tôi xây dựng hệ thống báo cáo tập trung trên nền Power BI:\n\n- **Khảo sát nhu cầu** — ngồi cùng bạn xác định đúng những chỉ số cần theo dõi, không làm thừa\n- **Kết nối dữ liệu** — lấy số liệu trực tiếp từ phần mềm bán hàng, kho, kế toán bạn đang dùng\n- **Thiết kế màn hình báo cáo** — bố cục dễ nhìn, bấm vào con số là xem được chi tiết bên dưới\n- **Tự động cập nhật** — số liệu tự làm mới hàng ngày, không cần ai thao tác\n- **Đào tạo sử dụng** — hướng dẫn đội ngũ của bạn tự xem và tự lọc dữ liệu\n\n## Bạn nhận được gì\n\nMột đường link duy nhất. Mở ra là thấy tình hình kinh doanh hôm nay, so với hôm qua, so với cùng kỳ năm trước. Xem được trên điện thoại khi đang đi công tác.',
 '["Xem số liệu bất cứ lúc nào, không cần chờ ai gửi file","Một con số thống nhất cho toàn công ty","Xem được trên điện thoại, máy tính bảng","Bấm vào số tổng để xem chi tiết bên dưới","Tự động cập nhật hàng ngày, không tốn nhân công"]'::jsonb,
 true, 1),

-- === DỊCH VỤ 2 ===
('kiem-tra-lam-sach-du-lieu',
 'Kiểm tra & làm sạch dữ liệu',
 'Rà soát toàn bộ dữ liệu để tìm chỗ thiếu, trùng, lệch giữa các hệ thống. Trả về báo cáo đối soát rõ ràng và phương án khắc phục.',
 E'## Vấn đề bạn đang gặp\n\nBáo cáo bán hàng ra một con số, kế toán ra một con số khác. Tổng doanh thu tháng này thấp bất thường nhưng không ai biết vì sao. Nghi ngờ số liệu sai nhưng không biết bắt đầu tìm từ đâu.\n\n## Chúng tôi làm gì\n\n- **Đối soát chéo** — so sánh số liệu giữa hệ thống gốc và hệ thống báo cáo, chỉ ra chính xác chênh lệch nằm ở đâu\n- **Tìm dữ liệu thiếu** — phát hiện đơn hàng, dòng hàng bị mất trong quá trình đồng bộ\n- **Tìm dữ liệu trùng** — phát hiện bản ghi bị nhân đôi làm doanh số bị thổi phồng\n- **Kiểm tra tính hợp lý** — tồn kho âm, giá bằng 0, ngày tháng bất thường\n- **Báo cáo đối soát** — bảng kê chi tiết từng chênh lệch kèm nguyên nhân\n- **Phương án khắc phục** — chỉ rõ cần sửa ở đâu và sửa thế nào\n\n## Bạn nhận được gì\n\nMột bộ hồ sơ đối soát cho biết dữ liệu của bạn đang sai ở đâu, sai bao nhiêu, vì sao sai. Kèm theo bộ kiểm tra tự động để lần sau phát hiện sớm thay vì đợi đến lúc phát hiện ra hậu quả.',
 '["Biết chính xác số liệu sai ở đâu và sai bao nhiêu","Xác định nguyên nhân gốc, không chỉ sửa phần ngọn","Bộ kiểm tra tự động chạy hàng ngày để phát hiện sớm","Số liệu thống nhất giữa các phòng ban","Yên tâm khi trình số liệu cho lãnh đạo hoặc đối tác"]'::jsonb,
 true, 2),

-- === DỊCH VỤ 3 ===
('tu-dong-hoa-bao-cao',
 'Tự động hoá báo cáo định kỳ',
 'Báo cáo tự chạy và tự gửi vào hộp thư hoặc nhóm chat theo lịch. Kèm cảnh báo tự động khi có số liệu bất thường.',
 E'## Vấn đề bạn đang gặp\n\nSáng nào cũng có người phải mở phần mềm, xuất file, sửa lại định dạng, rồi gửi mail cho sếp. Mỗi tháng mất vài ngày công chỉ để làm báo cáo. Người làm nghỉ phép là không ai làm được.\n\n## Chúng tôi làm gì\n\n- **Tự động chạy báo cáo** — đặt lịch chạy hàng ngày, hàng tuần hoặc hàng tháng\n- **Tự động gửi** — gửi thẳng vào email, nhóm Zalo hoặc Telegram của những người cần nhận\n- **Cảnh báo bất thường** — tự phát hiện đơn hàng lỗi, tồn kho âm, doanh số tụt bất thường và báo ngay lập tức\n- **Kết nối các phần mềm** — dữ liệu tự chảy giữa bán hàng, kho, kế toán, hết cảnh copy Excel qua lại\n- **Ghi nhận lỗi** — nếu quy trình chạy hỏng, hệ thống báo cho bạn biết ngay chứ không im lặng\n\n## Bạn nhận được gì\n\nCông việc lặp đi lặp lại được máy làm thay. Nhân sự của bạn quay lại làm việc cần đầu óc. Và quan trọng nhất: khi có sự cố, bạn biết ngay trong ngày thay vì phát hiện vào cuối tháng.',
 '["Tiết kiệm nhiều ngày công mỗi tháng","Báo cáo đến đúng giờ, không phụ thuộc vào ai","Phát hiện sự cố ngay trong ngày thay vì cuối tháng","Hết cảnh copy dữ liệu thủ công giữa các phần mềm","Có ghi nhận lỗi rõ ràng khi quy trình gặp trục trặc"]'::jsonb,
 true, 3)

on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  benefits = excluded.benefits,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------
-- PHẦN D — BẢNG GIÁ (3 gói cho mỗi dịch vụ)
-- Mô hình: Khảo sát (mồi) → Triển khai (gói chính) → Đồng hành (thu định kỳ)
-- ---------------------------------------------------------------------

-- Xoá giá cũ của 3 dịch vụ này rồi nạp lại, tránh trùng khi chạy lại file
delete from public.pricing_plans
where service_id in (
  select id from public.services
  where slug in ('he-thong-bao-cao-quan-tri','kiem-tra-lam-sach-du-lieu','tu-dong-hoa-bao-cao')
);

-- === Giá cho: Hệ thống báo cáo quản trị ===
insert into public.pricing_plans (service_id, name, price_text, features, is_highlighted, sort_order)
select s.id, v.name, v.price_text, v.features, v.is_highlighted, v.sort_order
from public.services s,
(values
  ('Khảo sát', 'Miễn phí',
   '["Buổi trao đổi 60 phút","Đánh giá hiện trạng dữ liệu","Đề xuất danh mục báo cáo cần làm","Báo giá chi tiết"]'::jsonb,
   false, 1),
  ('Triển khai', 'Từ 25.000.000đ',
   '["Kết nối tối đa 3 nguồn dữ liệu","Thiết kế 5-10 màn hình báo cáo","Tự động cập nhật hàng ngày","Đào tạo sử dụng cho đội ngũ","Bảo hành 3 tháng"]'::jsonb,
   true, 2),
  ('Đồng hành', 'Từ 5.000.000đ/tháng',
   '["Theo dõi hệ thống chạy ổn định","Chỉnh sửa báo cáo theo yêu cầu","Bổ sung chỉ số mới","Hỗ trợ trong giờ hành chính","Ưu tiên xử lý sự cố"]'::jsonb,
   false, 3)
) as v(name, price_text, features, is_highlighted, sort_order)
where s.slug = 'he-thong-bao-cao-quan-tri';

-- === Giá cho: Kiểm tra & làm sạch dữ liệu ===
insert into public.pricing_plans (service_id, name, price_text, features, is_highlighted, sort_order)
select s.id, v.name, v.price_text, v.features, v.is_highlighted, v.sort_order
from public.services s,
(values
  ('Rà soát nhanh', 'Miễn phí',
   '["Kiểm tra mẫu trên 1 nhóm dữ liệu","Báo cáo sơ bộ các vấn đề phát hiện","Tư vấn hướng xử lý"]'::jsonb,
   false, 1),
  ('Đối soát toàn diện', 'Từ 18.000.000đ',
   '["Đối soát toàn bộ dữ liệu 12 tháng gần nhất","Báo cáo chi tiết từng chênh lệch","Phân tích nguyên nhân gốc","Phương án khắc phục cụ thể","Bộ kiểm tra tự động bàn giao lại"]'::jsonb,
   true, 2),
  ('Giám sát định kỳ', 'Từ 4.000.000đ/tháng',
   '["Chạy kiểm tra tự động hàng ngày","Cảnh báo ngay khi phát hiện sai lệch","Báo cáo tổng hợp hàng tháng","Hỗ trợ xử lý khi có sự cố"]'::jsonb,
   false, 3)
) as v(name, price_text, features, is_highlighted, sort_order)
where s.slug = 'kiem-tra-lam-sach-du-lieu';

-- === Giá cho: Tự động hoá báo cáo định kỳ ===
insert into public.pricing_plans (service_id, name, price_text, features, is_highlighted, sort_order)
select s.id, v.name, v.price_text, v.features, v.is_highlighted, v.sort_order
from public.services s,
(values
  ('Thử nghiệm', 'Miễn phí',
   '["Tự động hoá 1 báo cáo mẫu","Chạy thử trong 2 tuần","Đánh giá hiệu quả trước khi mở rộng"]'::jsonb,
   false, 1),
  ('Trọn gói', 'Từ 15.000.000đ',
   '["Tự động hoá tối đa 10 báo cáo","Gửi qua email hoặc Zalo/Telegram","Cảnh báo bất thường tự động","Ghi nhận lỗi và thông báo khi hỏng","Bảo hành 3 tháng"]'::jsonb,
   true, 2),
  ('Vận hành', 'Từ 3.000.000đ/tháng',
   '["Theo dõi các quy trình chạy đúng lịch","Xử lý khi quy trình gặp lỗi","Thêm báo cáo mới theo yêu cầu","Điều chỉnh ngưỡng cảnh báo"]'::jsonb,
   false, 3)
) as v(name, price_text, features, is_highlighted, sort_order)
where s.slug = 'tu-dong-hoa-bao-cao';

-- ---------------------------------------------------------------------
-- PHẦN E — CÂU HỎI THƯỜNG GẶP
-- ---------------------------------------------------------------------

delete from public.faqs;

-- Câu hỏi chung (service_id = null)
insert into public.faqs (service_id, question, answer, sort_order) values
(null, 'Chi phí được tính như thế nào?',
 'Chi phí phụ thuộc vào số lượng nguồn dữ liệu cần kết nối và độ phức tạp của báo cáo. Sau buổi khảo sát miễn phí, chúng tôi gửi báo giá cố định cho toàn bộ dự án — không phát sinh thêm trong quá trình triển khai.', 1),
(null, 'Dự án mất bao lâu?',
 'Thông thường từ 3 đến 6 tuần tính từ lúc chốt yêu cầu. Với dự án đơn giản có thể xong trong 2 tuần. Chúng tôi bàn giao theo từng đợt để bạn dùng được sớm, không phải chờ đến khi hoàn tất mới thấy kết quả.', 2),
(null, 'Dữ liệu của tôi có an toàn không?',
 'Có. Chúng tôi ký thoả thuận bảo mật trước khi bắt đầu. Dữ liệu luôn nằm trên hệ thống của bạn — chúng tôi không sao chép ra ngoài. Quyền truy cập được cấp ở mức tối thiểu cần thiết và thu hồi ngay khi kết thúc dự án.', 3),
(null, 'Chúng tôi đang dùng phần mềm riêng, có kết nối được không?',
 'Được. Chúng tôi làm việc trực tiếp với cơ sở dữ liệu của phần mềm bạn đang dùng, không phụ thuộc vào việc phần mềm đó do ai viết. Nếu phần mềm có sẵn giao diện kết nối thì càng thuận lợi.', 4),
(null, 'Sau khi bàn giao, chúng tôi tự vận hành được không?',
 'Được. Chúng tôi bàn giao đầy đủ tài liệu và đào tạo đội ngũ của bạn. Gói Đồng hành là tuỳ chọn dành cho nơi muốn có người hỗ trợ thường trực, không bắt buộc.', 5),
(null, 'Nếu chúng tôi chưa có hệ thống dữ liệu thì sao?',
 'Vẫn làm được. Nhiều khách hàng bắt đầu từ file Excel rời rạc. Chúng tôi giúp gom về một mối trước, sau đó mới xây báo cáo bên trên.', 6);

-- Câu hỏi riêng cho từng dịch vụ
insert into public.faqs (service_id, question, answer, sort_order)
select s.id, v.question, v.answer, v.sort_order
from public.services s,
(values
  ('Báo cáo cập nhật nhanh đến mức nào?',
   'Mặc định cập nhật hàng ngày vào sáng sớm. Nếu cần cập nhật nhiều lần trong ngày hoặc gần thời gian thực, chúng tôi tư vấn phương án phù hợp — điều này phụ thuộc vào khả năng chịu tải của hệ thống nguồn.', 10),
  ('Có xem được trên điện thoại không?',
   'Có. Báo cáo hiển thị tốt trên điện thoại và máy tính bảng qua ứng dụng Power BI hoặc trình duyệt, không cần cài thêm gì phức tạp.', 11),
  ('Chúng tôi có cần mua bản quyền Power BI không?',
   'Tuỳ số người xem. Nếu chỉ vài người xem, có phương án chi phí rất thấp. Nếu nhiều người, chúng tôi tính toán và tư vấn phương án tiết kiệm nhất trong buổi khảo sát.', 12)
) as v(question, answer, sort_order)
where s.slug = 'he-thong-bao-cao-quan-tri';

insert into public.faqs (service_id, question, answer, sort_order)
select s.id, v.question, v.answer, v.sort_order
from public.services s,
(values
  ('Việc kiểm tra có ảnh hưởng đến hệ thống đang chạy không?',
   'Không. Chúng tôi chỉ đọc dữ liệu, không sửa gì trên hệ thống của bạn. Các truy vấn được thiết kế để chạy nhẹ và ngoài giờ cao điểm.', 10),
  ('Nếu phát hiện sai, ai là người sửa?',
   'Chúng tôi chỉ rõ chỗ sai và cách sửa. Việc sửa trực tiếp trên hệ thống gốc do bạn quyết định — có thể tự làm, hoặc yêu cầu chúng tôi hỗ trợ.', 11)
) as v(question, answer, sort_order)
where s.slug = 'kiem-tra-lam-sach-du-lieu';

insert into public.faqs (service_id, question, answer, sort_order)
select s.id, v.question, v.answer, v.sort_order
from public.services s,
(values
  ('Gửi báo cáo qua Zalo được không?',
   'Được. Chúng tôi hỗ trợ gửi qua email, Zalo nhóm và Telegram. Mỗi nhóm người nhận có thể nhận báo cáo khác nhau tuỳ quyền hạn.', 10),
  ('Nếu quy trình tự động bị lỗi thì sao?',
   'Hệ thống tự thông báo cho người phụ trách ngay khi có lỗi, kèm mô tả lỗi. Không có chuyện quy trình hỏng âm thầm mà không ai biết.', 11)
) as v(question, answer, sort_order)
where s.slug = 'tu-dong-hoa-bao-cao';

-- ---------------------------------------------------------------------
-- PHẦN F — DỰ ÁN TIÊU BIỂU (mẫu — sửa lại theo dự án thật của bạn)
-- ---------------------------------------------------------------------

insert into public.case_studies (service_id, slug, title, industry, challenge, solution, result, metrics, is_published, sort_order)
select s.id, v.slug, v.title, v.industry, v.challenge, v.solution, v.result, v.metrics, v.is_published, v.sort_order
from public.services s,
(values
  ('bao-cao-nganh-hang-tieu-dung',
   'Hệ thống báo cáo cho doanh nghiệp phân phối hàng tiêu dùng',
   'Hàng tiêu dùng',
   'Doanh nghiệp có hàng chục nhà phân phối trên toàn quốc, mỗi nơi gửi số liệu bằng file Excel theo định dạng khác nhau. Ban lãnh đạo phải chờ đến giữa tháng sau mới có số liệu tháng trước, và các con số thường không khớp giữa phòng bán hàng và phòng kế toán.',
   'Xây dựng kho dữ liệu tập trung gom số liệu từ tất cả nhà phân phối về một mối, chuẩn hoá danh mục sản phẩm và khách hàng. Trên đó dựng bộ báo cáo theo dõi doanh số, độ phủ, tồn kho và hiệu quả chương trình khuyến mãi.',
   'Ban lãnh đạo xem được số liệu của ngày hôm qua ngay từ sáng hôm sau. Số liệu thống nhất một nguồn cho toàn bộ các phòng ban. Thời gian tổng hợp báo cáo tháng giảm từ nhiều ngày xuống còn tức thời.',
   '[{"label":"Thời gian có số liệu","value":"Từ 15 ngày còn 1 ngày"},{"label":"Công sức tổng hợp thủ công","value":"Giảm hơn 90%"},{"label":"Nguồn số liệu","value":"Thống nhất 1 nguồn"}]'::jsonb,
   true, 1)
) as v(slug, title, industry, challenge, solution, result, metrics, is_published, sort_order)
where s.slug = 'he-thong-bao-cao-quan-tri'
on conflict (slug) do nothing;

insert into public.case_studies (service_id, slug, title, industry, challenge, solution, result, metrics, is_published, sort_order)
select s.id, v.slug, v.title, v.industry, v.challenge, v.solution, v.result, v.metrics, v.is_published, v.sort_order
from public.services s,
(values
  ('doi-soat-du-lieu-nganh-duoc',
   'Đối soát dữ liệu bán hàng ngành dược phẩm',
   'Dược phẩm',
   'Báo cáo doanh số trên hệ thống quản trị thấp hơn số liệu thực tế mà không rõ nguyên nhân. Nghi ngờ có đơn hàng bị thất lạc trong quá trình đồng bộ giữa hệ thống bán hàng và hệ thống báo cáo nhưng không xác định được ở đâu.',
   'Đối soát chéo toàn bộ dữ liệu 12 tháng giữa hệ thống gốc và hệ thống báo cáo theo từng tháng, từng nhóm khách hàng. Khoanh vùng dần đến khi xác định chính xác nhóm giao dịch bị mất và nguyên nhân trong quy trình đồng bộ.',
   'Xác định được nguyên nhân gốc và khôi phục đầy đủ số liệu thiếu. Bàn giao bộ kiểm tra tự động chạy hàng ngày để phát hiện ngay nếu tình trạng tương tự tái diễn.',
   '[{"label":"Phạm vi đối soát","value":"12 tháng dữ liệu"},{"label":"Chênh lệch còn lại","value":"0"},{"label":"Cơ chế phòng ngừa","value":"Kiểm tra tự động hàng ngày"}]'::jsonb,
   true, 2)
) as v(slug, title, industry, challenge, solution, result, metrics, is_published, sort_order)
where s.slug = 'kiem-tra-lam-sach-du-lieu'
on conflict (slug) do nothing;
