/**
 * Dữ liệu mẫu cho demo quy trình đặt hàng — dùng chung bối cảnh FMCG với
 * dashboard ở trang cha, mở rộng thêm giá bán để tính tiền/khuyến mãi.
 */

export type OrderProduct = {
  id: string;
  name: string;
  category: string;
  unit: string; // đơn vị bán lẻ, vd "lon", "chai"
  caseSize: number; // số đơn vị lẻ trong 1 thùng
  pricePerCase: number; // giá 1 thùng (kênh NPP) — đơn vị: nghìn đồng
  pricePerUnit: number; // giá 1 đơn vị lẻ (kênh bán lẻ) — đơn vị: nghìn đồng
  emoji: string; // thay ảnh sản phẩm bằng emoji cho gọn, không cần asset
};

export const ORDER_PRODUCTS: OrderProduct[] = [
  {
    id: 'cola-330',
    name: 'Nước ngọt Cola 330ml',
    category: 'Nước giải khát',
    unit: 'lon',
    caseSize: 24,
    pricePerCase: 168,
    pricePerUnit: 8,
    emoji: '🥤',
  },
  {
    id: 'suoi-500',
    name: 'Nước suối 500ml',
    category: 'Nước giải khát',
    unit: 'chai',
    caseSize: 24,
    pricePerCase: 96,
    pricePerUnit: 5,
    emoji: '💧',
  },
  {
    id: 'tra-xanh-450',
    name: 'Trà xanh không đường 450ml',
    category: 'Nước giải khát',
    unit: 'chai',
    caseSize: 24,
    pricePerCase: 144,
    pricePerUnit: 7,
    emoji: '🍵',
  },
  {
    id: 'snack-65',
    name: 'Snack khoai tây 65g',
    category: 'Thực phẩm',
    unit: 'gói',
    caseSize: 40,
    pricePerCase: 280,
    pricePerUnit: 8,
    emoji: '🥔',
  },
  {
    id: 'banh-quy-200',
    name: 'Bánh quy hộp 200g',
    category: 'Thực phẩm',
    unit: 'hộp',
    caseSize: 20,
    pricePerCase: 240,
    pricePerUnit: 13,
    emoji: '🍪',
  },
];

// Quy tắc khuyến mãi áp cho TỔNG số lượng thùng/đơn vị trong 1 đơn hàng
export const PROMOTION_RULES = {
  tier1: { threshold: 50, discountPercent: 5 },
  tier2: { threshold: 100, discountPercent: 10 },
  comboBonus: { minPerProduct: 20, freeUnits: 1 }, // mua >=2 sản phẩm, mỗi loại >=20 -> tặng thêm
};
