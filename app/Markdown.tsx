import { Fragment, type ReactNode } from 'react';

/**
 * Render Markdown tối giản — chỉ hỗ trợ cú pháp dùng trong nội dung dịch vụ:
 * ## Tiêu đề, ### Tiêu đề phụ, - danh sách, **đậm**, đoạn văn.
 * Tự viết thay vì thêm thư viện để giữ bundle nhẹ và tránh rủi ro XSS
 * (không dùng dangerouslySetInnerHTML — mọi thứ đều qua React element).
 */

// Tách **đậm** thành các đoạn text/strong xen kẽ
function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];

  // Đẩy danh sách đang gom vào output rồi xoá bộ đệm
  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-4 space-y-2.5">
        {listBuffer.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-500" />
            <span className="text-slate-700 dark:text-slate-300">{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (line === '') {
      flushList();
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      blocks.push(
        <h4
          key={`h4-${blocks.length}`}
          className="mt-6 mb-2 text-base font-semibold text-slate-900 dark:text-white"
        >
          {renderInline(line.slice(4))}
        </h4>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      blocks.push(
        <h3
          key={`h3-${blocks.length}`}
          className="mt-8 mb-3 text-xl font-bold text-slate-900 first:mt-0 dark:text-white"
        >
          {renderInline(line.slice(3))}
        </h3>
      );
      continue;
    }

    if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2));
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="my-3 leading-relaxed text-slate-700 dark:text-slate-300">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return <div>{blocks}</div>;
}
