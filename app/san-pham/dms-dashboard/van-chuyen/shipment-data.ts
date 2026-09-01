import { DISTRIBUTORS } from '../mock-data';

export type ShipmentStatus = 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed';

export type TimelineStep = {
  label: string;
  time: string; // giờ:phút, ngày tương đối — vd "08:20 - Hôm nay"
  done: boolean;
  delayed?: boolean;
};

export type Shipment = {
  id: string;
  distributor: string;
  region: string;
  driver: string;
  vehicle: string;
  status: ShipmentStatus;
  etaHours: number; // số giờ còn lại dự kiến, âm nghĩa là đã trễ
  distanceKm: number;
  progressPercent: number; // vị trí hiện tại trên tuyến đường, 0-100
  timeline: TimelineStep[];
};

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  picked_up: 'Đã lấy hàng',
  in_transit: 'Đang vận chuyển',
  out_for_delivery: 'Đang giao hàng',
  delivered: 'Đã giao',
  delayed: 'Trễ hẹn',
};

export const STATUS_COLOR: Record<ShipmentStatus, string> = {
  picked_up: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  in_transit: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  out_for_delivery: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  delayed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
};

export const SHIPMENTS: Shipment[] = [
  {
    id: 'VC-10231',
    distributor: 'NPP Hồng Phát',
    region: 'Miền Bắc',
    driver: 'Trần Văn Long',
    vehicle: '29H-123.45',
    status: 'in_transit',
    etaHours: 3.5,
    distanceKm: 42,
    progressPercent: 55,
    timeline: [
      { label: 'Đã lấy hàng tại kho', time: '06:10 - Hôm nay', done: true },
      { label: 'Đang vận chuyển', time: '06:45 - Hôm nay', done: true },
      { label: 'Đang giao hàng', time: 'Dự kiến 10:30', done: false },
      { label: 'Đã giao', time: 'Dự kiến 11:00', done: false },
    ],
  },
  {
    id: 'VC-10232',
    distributor: 'NPP Đại Thành',
    region: 'Miền Bắc',
    driver: 'Nguyễn Thị Hoa',
    vehicle: '29C-678.90',
    status: 'out_for_delivery',
    etaHours: 0.8,
    distanceKm: 18,
    progressPercent: 88,
    timeline: [
      { label: 'Đã lấy hàng tại kho', time: '07:00 - Hôm nay', done: true },
      { label: 'Đang vận chuyển', time: '07:20 - Hôm nay', done: true },
      { label: 'Đang giao hàng', time: '09:40 - Hôm nay', done: true },
      { label: 'Đã giao', time: 'Dự kiến 10:20', done: false },
    ],
  },
  {
    id: 'VC-10233',
    distributor: 'NPP Miền Trung Phát',
    region: 'Miền Trung',
    driver: 'Lê Văn Sơn',
    vehicle: '43B-111.22',
    status: 'delayed',
    etaHours: -1.2,
    distanceKm: 65,
    progressPercent: 70,
    timeline: [
      { label: 'Đã lấy hàng tại kho', time: '05:30 - Hôm nay', done: true },
      { label: 'Đang vận chuyển', time: '06:00 - Hôm nay', done: true },
      { label: 'Đang giao hàng', time: '09:00 - Hôm nay', done: true, delayed: true },
      { label: 'Đã giao', time: 'Trễ so với dự kiến 08:30', done: false, delayed: true },
    ],
  },
  {
    id: 'VC-10234',
    distributor: 'NPP Sông Hàn',
    region: 'Miền Trung',
    driver: 'Phạm Thị Lan',
    vehicle: '43H-333.44',
    status: 'picked_up',
    etaHours: 6,
    distanceKm: 80,
    progressPercent: 10,
    timeline: [
      { label: 'Đã lấy hàng tại kho', time: '08:15 - Hôm nay', done: true },
      { label: 'Đang vận chuyển', time: 'Dự kiến 08:30', done: false },
      { label: 'Đang giao hàng', time: 'Dự kiến 13:00', done: false },
      { label: 'Đã giao', time: 'Dự kiến 14:15', done: false },
    ],
  },
  {
    id: 'VC-10235',
    distributor: 'NPP Phương Nam',
    region: 'Miền Nam',
    driver: 'Đỗ Văn Khoa',
    vehicle: '51C-555.66',
    status: 'delivered',
    etaHours: 0,
    distanceKm: 35,
    progressPercent: 100,
    timeline: [
      { label: 'Đã lấy hàng tại kho', time: '05:00 - Hôm nay', done: true },
      { label: 'Đang vận chuyển', time: '05:20 - Hôm nay', done: true },
      { label: 'Đang giao hàng', time: '07:45 - Hôm nay', done: true },
      { label: 'Đã giao', time: '08:30 - Hôm nay', done: true },
    ],
  },
  {
    id: 'VC-10236',
    distributor: 'NPP Cửu Long',
    region: 'Miền Nam',
    driver: 'Hoàng Minh Tuấn',
    vehicle: '51D-777.88',
    status: 'in_transit',
    etaHours: 4.2,
    distanceKm: 55,
    progressPercent: 40,
    timeline: [
      { label: 'Đã lấy hàng tại kho', time: '07:30 - Hôm nay', done: true },
      { label: 'Đang vận chuyển', time: '07:50 - Hôm nay', done: true },
      { label: 'Đang giao hàng', time: 'Dự kiến 12:00', done: false },
      { label: 'Đã giao', time: 'Dự kiến 12:30', done: false },
    ],
  },
];

export const REGION_LIST = Array.from(new Set(DISTRIBUTORS.map((d) => d.region)));
