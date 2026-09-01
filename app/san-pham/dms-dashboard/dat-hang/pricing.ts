import { ORDER_PRODUCTS, PROMOTION_RULES, type OrderProduct } from './order-data';

export type CartLine = {
  productId: string;
  qty: number; // số lượng theo đơn vị của kênh (thùng cho NPP, đơn vị lẻ cho bán lẻ)
};

export type PricedOrder = {
  lines: {
    product: OrderProduct;
    qty: number;
    unitPrice: number;
    lineTotal: number;
    freeUnits: number;
  }[];
  totalQty: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  appliedTier: 'tier1' | 'tier2' | null;
  comboBonusApplied: boolean;
};

/**
 * Tính giá đơn hàng + áp khuyến mãi. Dùng chung cho cả 2 kênh — chỉ khác
 * đơn giá truyền vào (giá thùng cho NPP, giá đơn vị lẻ cho bán lẻ).
 */
export function priceOrder(cart: CartLine[], channel: 'npp' | 'retail'): PricedOrder {
  const lines = cart
    .filter((c) => c.qty > 0)
    .map((c) => {
      const product = ORDER_PRODUCTS.find((p) => p.id === c.productId)!;
      const unitPrice = channel === 'npp' ? product.pricePerCase : product.pricePerUnit;
      return { product, qty: c.qty, unitPrice, lineTotal: c.qty * unitPrice, freeUnits: 0 };
    });

  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  // Bậc chiết khấu theo tổng số lượng toàn đơn
  let discountPercent = 0;
  let appliedTier: 'tier1' | 'tier2' | null = null;
  if (totalQty >= PROMOTION_RULES.tier2.threshold) {
    discountPercent = PROMOTION_RULES.tier2.discountPercent;
    appliedTier = 'tier2';
  } else if (totalQty >= PROMOTION_RULES.tier1.threshold) {
    discountPercent = PROMOTION_RULES.tier1.discountPercent;
    appliedTier = 'tier1';
  }

  // Combo: từ 2 sản phẩm khác nhau trở lên, mỗi loại đạt ngưỡng -> tặng 1 đơn vị/sản phẩm đó
  const qualifyingLines = lines.filter((l) => l.qty >= PROMOTION_RULES.comboBonus.minPerProduct);
  const comboBonusApplied = qualifyingLines.length >= 2;
  if (comboBonusApplied) {
    qualifyingLines.forEach((l) => {
      l.freeUnits = PROMOTION_RULES.comboBonus.freeUnits;
    });
  }

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discountAmount;

  return { lines, totalQty, subtotal, discountPercent, discountAmount, total, appliedTier, comboBonusApplied };
}

export function fmtMoney(thousandVnd: number) {
  return `${thousandVnd.toLocaleString('vi-VN')}.000đ`;
}
