-- =====================================================================
-- Cap nhat mo ta goi mien phi thanh quy trinh cu the co gioi han ro rang
-- + them FAQ giai thich cach dung thu
-- Chay trong Supabase Dashboard > SQL Editor > New query
-- =====================================================================

-- === Goi "Khao sat" cho Bao cao quan tri ===
update public.pricing_plans set features = '[
  "Gửi 1 file Excel/CSV dữ liệu mẫu (tối đa 5.000 dòng)",
  "Chúng tôi dựng 1 màn hình Power BI mẫu từ đúng dữ liệu đó",
  "Nhận kết quả trong 2-3 ngày làm việc",
  "Không ràng buộc — xem thử rồi quyết định sau"
]'::jsonb
where name = 'Khảo sát' and service_id = (select id from public.services where slug = 'he-thong-bao-cao-quan-tri');

-- === Goi "Ra soat nhanh" cho Kiem tra & lam sach du lieu ===
update public.pricing_plans set features = '[
  "Gửi 2 file cùng kỳ báo cáo (vd: file bán hàng + file kế toán 1 tháng)",
  "Chúng tôi đối chiếu và chỉ ra 3-5 điểm lệch cụ thể kèm số liệu",
  "Nhận báo cáo trong 2-3 ngày làm việc",
  "Chỉ dừng lại ở phát hiện — chưa bao gồm sửa lỗi"
]'::jsonb
where name = 'Rà soát nhanh' and service_id = (select id from public.services where slug = 'kiem-tra-lam-sach-du-lieu');

-- === Goi "Thu nghiem" cho Tu dong hoa bao cao ===
update public.pricing_plans set features = '[
  "Mô tả 1 báo cáo bạn đang làm thủ công (tần suất, các bước hiện tại)",
  "Chúng tôi gửi lại bản thiết kế quy trình tự động hoá cho đúng báo cáo đó",
  "Kèm ước tính thời gian tiết kiệm được mỗi tháng",
  "Nhận trong 2-3 ngày làm việc — chưa bao gồm triển khai thật"
]'::jsonb
where name = 'Thử nghiệm' and service_id = (select id from public.services where slug = 'tu-dong-hoa-bao-cao');

-- === FAQ chung: giai thich quy trinh dung thu mien phi ===
insert into public.faqs (service_id, question, answer, sort_order) values
(null, 'Tôi cần chuẩn bị gì để dùng gói miễn phí?',
 'Chỉ cần 1-2 file Excel/CSV dữ liệu bạn đang có (báo cáo bán hàng, tồn kho...). Có thể ẩn tên khách hàng hoặc đổi số liệu tỷ lệ nếu cần bảo mật — chúng tôi chỉ cần đúng cấu trúc dữ liệu để làm mẫu. Sau khi gửi form liên hệ, trang sẽ hiện địa chỉ email để bạn gửi file kèm theo.', 7),
(null, 'Gói miễn phí có giới hạn gì không?',
 'Có, để đảm bảo công bằng cho mọi khách hàng: giới hạn 1 file mẫu, tối đa khoảng 5.000 dòng, và kết quả chỉ dừng ở mức "bản mẫu xem trước" — chưa bao gồm triển khai đầy đủ hay sửa lỗi trực tiếp trên hệ thống của bạn. Nếu ưng ý, bước tiếp theo là chuyển sang gói Triển khai.', 8)
on conflict do nothing;
