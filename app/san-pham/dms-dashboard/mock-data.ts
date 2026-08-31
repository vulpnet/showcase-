/**
 * Dữ liệu mẫu cho demo dashboard DMS/Logistics — bối cảnh ngành hàng tiêu
 * dùng nhanh (nước giải khát/thực phẩm), tên công ty/NPP là hư cấu.
 * Không kết nối database — cố định để demo chạy ổn định, không phụ thuộc
 * gì bên ngoài.
 */

export const REGIONS = ['Miền Bắc', 'Miền Trung', 'Miền Nam'] as const;

export const DISTRIBUTORS = [
  { name: 'NPP Hồng Phát', region: 'Miền Bắc' },
  { name: 'NPP Đại Thành', region: 'Miền Bắc' },
  { name: 'NPP Miền Trung Phát', region: 'Miền Trung' },
  { name: 'NPP Sông Hàn', region: 'Miền Trung' },
  { name: 'NPP Phương Nam', region: 'Miền Nam' },
  { name: 'NPP Cửu Long', region: 'Miền Nam' },
];

export const PRODUCTS = [
  { name: 'Nước ngọt Cola 330ml', category: 'Nước giải khát' },
  { name: 'Nước suối 500ml', category: 'Nước giải khát' },
  { name: 'Trà xanh không đường 450ml', category: 'Nước giải khát' },
  { name: 'Snack khoai tây 65g', category: 'Thực phẩm' },
  { name: 'Bánh quy hộp 200g', category: 'Thực phẩm' },
];

// Doanh số 6 tháng gần nhất — đơn vị: triệu đồng
export const MONTHLY_REVENUE = [
  { month: 'T3', revenue: 4250, target: 4000 },
  { month: 'T4', revenue: 4680, target: 4300 },
  { month: 'T5', revenue: 4120, target: 4500 },
  { month: 'T6', revenue: 5340, target: 4700 },
  { month: 'T7', revenue: 5890, target: 5000 },
  { month: 'T8', revenue: 6210, target: 5500 },
];

// Doanh số theo khu vực tháng hiện tại — đơn vị: triệu đồng
export const REVENUE_BY_REGION = [
  { region: 'Miền Bắc', revenue: 2480 },
  { region: 'Miền Trung', revenue: 1350 },
  { region: 'Miền Nam', revenue: 2380 },
];

// Top sản phẩm bán chạy tháng hiện tại
export const TOP_PRODUCTS = [
  { name: 'Nước ngọt Cola 330ml', units: 48200, revenue: 1820 },
  { name: 'Nước suối 500ml', units: 61500, revenue: 1230 },
  { name: 'Trà xanh không đường 450ml', units: 32100, revenue: 1050 },
  { name: 'Snack khoai tây 65g', units: 21800, revenue: 980 },
  { name: 'Bánh quy hộp 200g', units: 15400, revenue: 890 },
];

// Tồn kho theo NPP — đơn vị: %  so với định mức tồn kho an toàn
export const INVENTORY_STATUS = [
  { distributor: 'NPP Hồng Phát', stockLevel: 82, status: 'ổn định' },
  { distributor: 'NPP Đại Thành', stockLevel: 34, status: 'sắp hết' },
  { distributor: 'NPP Miền Trung Phát', stockLevel: 91, status: 'ổn định' },
  { distributor: 'NPP Sông Hàn', stockLevel: 18, status: 'sắp hết' },
  { distributor: 'NPP Phương Nam', stockLevel: 76, status: 'ổn định' },
  { distributor: 'NPP Cửu Long', stockLevel: 105, status: 'tồn dư' },
];

// Công nợ theo NPP — đơn vị: triệu đồng
export const DEBT_STATUS = [
  { distributor: 'NPP Hồng Phát', creditLimit: 800, currentDebt: 620, overdue: 0 },
  { distributor: 'NPP Đại Thành', creditLimit: 600, currentDebt: 590, overdue: 120 },
  { distributor: 'NPP Miền Trung Phát', creditLimit: 500, currentDebt: 310, overdue: 0 },
  { distributor: 'NPP Sông Hàn', creditLimit: 450, currentDebt: 465, overdue: 85 },
  { distributor: 'NPP Phương Nam', creditLimit: 700, currentDebt: 540, overdue: 0 },
  { distributor: 'NPP Cửu Long', creditLimit: 550, currentDebt: 200, overdue: 0 },
];

// Vận chuyển/giao hàng — 7 ngày gần nhất
export const DELIVERY_STATS = [
  { day: 'T2', onTime: 142, late: 8 },
  { day: 'T3', onTime: 158, late: 5 },
  { day: 'T4', onTime: 134, late: 12 },
  { day: 'T5', onTime: 167, late: 6 },
  { day: 'T6', onTime: 171, late: 9 },
  { day: 'T7', onTime: 98, late: 4 },
  { day: 'CN', onTime: 45, late: 2 },
];

export const DELIVERY_SUMMARY = {
  totalOrders: 1961,
  onTimeRate: 96.3,
  avgDeliveryHours: 18.4,
  activeShipments: 87,
};
