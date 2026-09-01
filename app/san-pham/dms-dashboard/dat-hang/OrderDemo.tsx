'use client';

import { useMemo, useState } from 'react';
import { DISTRIBUTORS } from '../mock-data';
import { ORDER_PRODUCTS } from './order-data';
import { priceOrder, fmtMoney, type CartLine } from './pricing';
import CartSummary from './CartSummary';

type Channel = 'npp' | 'retail';

export default function OrderDemo() {
  const [channel, setChannel] = useState<Channel>('npp');
  const [distributor, setDistributor] = useState(DISTRIBUTORS[0].name);
  const [cart, setCart] = useState<CartLine[]>(ORDER_PRODUCTS.map((p) => ({ productId: p.id, qty: 0 })));
  const [confirming, setConfirming] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; total: number } | null>(null);

  const order = useMemo(() => priceOrder(cart, channel), [cart, channel]);
  const unitLabel = channel === 'npp' ? 'thùng' : 'đơn vị lẻ';

  function setQty(productId: string, qty: number) {
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, qty: Math.max(0, qty) } : c)));
  }

  function handleChannelChange(next: Channel) {
    setChannel(next);
    setCart(ORDER_PRODUCTS.map((p) => ({ productId: p.id, qty: 0 })));
    setConfirmedOrder(null);
  }

  function handleConfirm() {
    setConfirming(true);
    // Mô phỏng thời gian xử lý tạo đơn — demo không có backend thật đứng sau
    setTimeout(() => {
      setConfirmedOrder({
        id: `DH${Math.floor(100000 + (order.total % 900000))}`,
        total: order.total,
      });
      setConfirming(false);
    }, 600);
  }

  function handleNewOrder() {
    setCart(ORDER_PRODUCTS.map((p) => ({ productId: p.id, qty: 0 })));
    setConfirmedOrder(null);
  }

  if (confirmedOrder) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-green-300 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950">
        <div className="text-3xl">✅</div>
        <h3 className="mt-3 text-xl font-bold text-green-800 dark:text-green-200">Đặt hàng thành công</h3>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          Mã đơn hàng <b>{confirmedOrder.id}</b>
        </p>
        <p className="mt-1 text-lg font-bold text-green-800 dark:text-green-200">
          {fmtMoney(confirmedOrder.total)}
        </p>
        <button
          onClick={handleNewOrder}
          className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Tạo đơn khác
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Chọn kênh */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleChannelChange('npp')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            channel === 'npp'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Kênh NPP (nhân viên bán hàng)
        </button>
        <button
          onClick={() => handleChannelChange('retail')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            channel === 'retail'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Kênh bán lẻ (khách tự đặt)
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {channel === 'npp' && (
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tạo đơn cho nhà phân phối
              </label>
              <select
                value={distributor}
                onChange={(e) => setDistributor(e.target.value)}
                className="w-full max-w-sm rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
              >
                {DISTRIBUTORS.map((d) => (
                  <option key={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {ORDER_PRODUCTS.map((p) => {
              const line = cart.find((c) => c.productId === p.id)!;
              const price = channel === 'npp' ? p.pricePerCase : p.pricePerUnit;
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{p.emoji}</div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.category}</div>
                      <div className="mt-1 text-sm font-semibold text-blue-600">
                        {fmtMoney(price)} / {channel === 'npp' ? `thùng (${p.caseSize} ${p.unit})` : p.unit}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setQty(p.id, line.qty - 1)}
                      className="size-8 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={line.qty}
                      onChange={(e) => setQty(p.id, Number(e.target.value) || 0)}
                      className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-center text-sm dark:border-slate-700 dark:bg-slate-900"
                    />
                    <button
                      onClick={() => setQty(p.id, line.qty + 1)}
                      className="size-8 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      +
                    </button>
                    <span className="text-xs text-slate-500">{unitLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
            Khuyến mãi tự động áp dụng: tổng đơn từ 50 {unitLabel} giảm 5%, từ 100 {unitLabel} giảm 10%. Mua từ 2
            sản phẩm, mỗi loại từ 20 {unitLabel} trở lên — tặng kèm mỗi loại 1 {unitLabel}.
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <CartSummary order={order} channel={channel} onConfirm={handleConfirm} confirming={confirming} />
        </div>
      </div>
    </div>
  );
}
