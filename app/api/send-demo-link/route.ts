import { NextResponse, type NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@/lib/supabase/server';
import type { Lead, Profile } from '@/lib/types';

const DEMO_LINK = 'https://showcase-one-ochre.vercel.app/san-pham/dms-dashboard';

/**
 * Gửi email chứa link demo sản phẩm cho khách trong 1 lead cụ thể.
 * Được gọi từ trang /admin khi admin đổi trạng thái lead sang "Đã liên hệ".
 * Dùng session cookie của admin để xác thực — RLS tự chặn nếu không phải
 * admin, không cần service_role key.
 */
export async function POST(request: NextRequest) {
  const { leadId } = await request.json();
  if (!leadId) {
    return NextResponse.json({ error: 'Thiếu leadId' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if ((profile as Pick<Profile, 'role'> | null)?.role !== 'admin') {
    return NextResponse.json({ error: 'Không có quyền' }, { status: 403 });
  }

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .maybeSingle();

  if (!lead) {
    return NextResponse.json({ error: 'Không tìm thấy yêu cầu' }, { status: 404 });
  }

  const l = lead as Lead;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json(
      { error: 'Chưa cấu hình GMAIL_USER / GMAIL_APP_PASSWORD trên server' },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"DMS & Logistics" <${process.env.GMAIL_USER}>`,
      to: l.email,
      subject: 'Link demo sản phẩm DMS & Logistics',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #1e293b;">Xin chào ${l.name},</h2>
          <p>Cảm ơn bạn đã quan tâm đến sản phẩm <b>DMS &amp; Logistics</b>.</p>
          <p>Bạn có thể xem bản demo tương tác tại đường link bên dưới — bấm vào các tab và bộ lọc để trải nghiệm trực tiếp:</p>
          <p style="text-align: center; margin: 28px 0;">
            <a href="${DEMO_LINK}" style="background: #2563eb; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Xem demo sản phẩm
            </a>
          </p>
          <p>Nếu có bất kỳ câu hỏi nào, cứ trả lời trực tiếp email này, chúng tôi sẽ hỗ trợ ngay.</p>
          <p style="margin-top: 32px; color: #64748b; font-size: 13px;">— Đội ngũ DMS &amp; Logistics</p>
        </div>
      `,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi không xác định';
    return NextResponse.json({ error: `Gửi mail thất bại: ${message}` }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
