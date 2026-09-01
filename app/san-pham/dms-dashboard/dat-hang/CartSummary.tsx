import { fmtMoney, type PricedOrder } from './pricing';

export default function CartSummary({
  order,
  channel,
  onConfirm,
  confirming,
}: {
  order: PricedOrder;
  channel: 'npp' | 'retail';
  onConfirm: () => void;
  confirming: boolean;
}) {
  const unitLabel = channel === 'npp' ? 'thùng' : 'đơn vị';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="font-semibold text-slate-900 dark:text-white">Giỏ hàng</h3>

      {order.lines.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Chưa chọn sản phẩm nào.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {order.lines.map((l) => (
            <div key={l.product.id} className="flex items-start justify-between text-sm">
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-200">
                  {l.product.emoji} {l.product.name}
                </div>
                <div className="text-xs text-slate-500">
                  {l.qty} {unitLabel} × {fmtMoney(l.unitPrice)}
                  {l.freeUnits > 0 && (
                    <span className="ml-1 font-medium text-green-600">
                      + tặng {l.freeUnits} {unitLabel}
                    </span>
                  )}
                </div>
              </div>
              <div className="font-medium text-slate-800 dark:text-slate-200">{fmtMoney(l.lineTotal)}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Tổng số lượng</span>
          <span>
            {order.totalQty} {unitLabel}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Tạm tính</span>
          <span>{fmtMoney(order.subtotal)}</span>
        </div>
        {order.discountPercent > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Chiết khấu {order.discountPercent}%</span>
            <span>-{fmtMoney(order.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900 dark:border-slate-800 dark:text-white">
          <span>Thành tiền</span>
          <span>{fmtMoney(order.total)}</span>
        </div>
      </div>

      {(order.appliedTier || order.comboBonusApplied) && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-xs text-green-800 dark:bg-green-950 dark:text-green-200">
          {order.appliedTier === 'tier1' && <div>✓ Đạt mốc {50}+ {unitLabel} — chiết khấu 5%</div>}
          {order.appliedTier === 'tier2' && <div>✓ Đạt mốc {100}+ {unitLabel} — chiết khấu 10%</div>}
          {order.comboBonusApplied && <div>✓ Mua combo từ 2 sản phẩm — tặng kèm mỗi loại</div>}
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={order.lines.length === 0 || confirming}
        className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
      >
        {confirming ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
      </button>
    </div>
  );
}
