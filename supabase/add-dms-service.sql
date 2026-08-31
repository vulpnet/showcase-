-- =====================================================================
-- Them dich vu "San pham DMS/Logistics" vao danh sach dich vu chinh
-- + 3 goi gia, kem 1 FAQ giai thich cach xem demo
-- Chay trong Supabase Dashboard > SQL Editor > New query
-- =====================================================================

insert into public.services (slug, title, summary, description, benefits, is_published, sort_order)
values
('san-pham-dms-logistics',
 'Sản phẩm DMS &amp; Logistics',
 'Hệ thống quản lý phân phối và vận chuyển: doanh số, tồn kho, công nợ, giao hàng — theo dõi trên cùng một màn hình.',
 E'## Vấn đề bạn đang gặp\n\nDữ liệu bán hàng, tồn kho, công nợ và vận chuyển nằm rời rạc ở nhiều phần mềm khác nhau. Không có cái nhìn tổng thể để ra quyết định kịp thời — tồn kho hết hàng ở 1 nhà phân phối trong khi nơi khác lại tồn dư, công nợ vượt hạn mức không được cảnh báo sớm.\n\n## Chúng tôi làm gì\n\nXây dựng hệ thống DMS (Distribution Management System) tập trung cho doanh nghiệp phân phối:\n\n- **Quản lý đơn hàng** — theo dõi đơn hàng theo nhà phân phối, khu vực, mặt hàng\n- **Quản lý tồn kho** — cảnh báo sớm khi tồn kho dưới định mức an toàn hoặc tồn dư\n- **Quản lý công nợ** — theo dõi hạn mức tín dụng, cảnh báo nợ quá hạn theo từng nhà phân phối\n- **Theo dõi vận chuyển** — tỷ lệ giao đúng hẹn, thời gian giao hàng trung bình theo tuyến\n- **Dashboard tổng hợp** — toàn bộ số liệu trên cùng 1 màn hình, xem được trên điện thoại\n\n## Bạn nhận được gì\n\nMột hệ thống theo dõi toàn bộ chuỗi phân phối — từ lúc tạo đơn hàng đến khi giao hàng thành công và thu hồi công nợ. Có bản demo tương tác để bạn xem trước cách trình bày trước khi quyết định.',
 '["Xem doanh số, tồn kho, công nợ trên cùng 1 màn hình","Cảnh báo sớm khi tồn kho sắp hết hoặc tồn dư","Theo dõi công nợ và hạn mức tín dụng theo từng nhà phân phối","Theo dõi tỷ lệ giao hàng đúng hẹn theo tuyến","Có bản demo tương tác xem trước khi triển khai"]'::jsonb,
 true, 4)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  benefits = excluded.benefits,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Bảng giá — mô hình 3 gói giống các dịch vụ khác
delete from public.pricing_plans
where service_id = (select id from public.services where slug = 'san-pham-dms-logistics');

insert into public.pricing_plans (service_id, name, price_text, features, is_highlighted, sort_order)
select s.id, v.name, v.price_text, v.features, v.is_highlighted, v.sort_order
from public.services s,
(values
  ('Xem demo', 'Miễn phí',
   '["Xem bản demo tương tác với dữ liệu mẫu","Buổi trao đổi 60 phút về nhu cầu cụ thể","Đề xuất phạm vi triển khai phù hợp"]'::jsonb,
   false, 1),
  ('Triển khai', 'Liên hệ báo giá',
   '["Dashboard tổng hợp doanh số/tồn kho/công nợ/vận chuyển","Kết nối dữ liệu từ hệ thống hiện có","Tự động cập nhật hàng ngày","Đào tạo sử dụng cho đội ngũ","Bảo hành 3 tháng"]'::jsonb,
   true, 2),
  ('Đồng hành', 'Liên hệ báo giá',
   '["Theo dõi hệ thống chạy ổn định","Bổ sung chỉ số/màn hình mới theo yêu cầu","Hỗ trợ trong giờ hành chính","Ưu tiên xử lý sự cố"]'::jsonb,
   false, 3)
) as v(name, price_text, features, is_highlighted, sort_order)
where s.slug = 'san-pham-dms-logistics';

-- FAQ riêng cho dịch vụ này
insert into public.faqs (service_id, question, answer, sort_order)
select s.id, v.question, v.answer, v.sort_order
from public.services s,
(values
  ('Làm sao để xem bản demo?',
   'Gửi yêu cầu qua form liên hệ và chọn gói "Xem demo" — chúng tôi sẽ gửi lại đường link demo tương tác qua email trong vòng 1 ngày làm việc.', 1),
  ('Demo có dùng dữ liệu thật của công ty tôi không?',
   'Bản demo ban đầu dùng dữ liệu mẫu để bạn xem cách trình bày và các chỉ số theo dõi. Nếu muốn xem với dữ liệu thật, gửi kèm 1 file dữ liệu mẫu (ẩn danh nếu cần) khi liên hệ.', 2),
  ('Hệ thống có tích hợp được với phần mềm bán hàng hiện có không?',
   'Có. Chúng tôi kết nối trực tiếp với cơ sở dữ liệu của phần mềm bạn đang dùng, không phụ thuộc vào việc phần mềm đó do ai viết.', 3)
) as v(question, answer, sort_order)
where s.slug = 'san-pham-dms-logistics'
on conflict do nothing;
