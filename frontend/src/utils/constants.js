export const BOOKING_STATUS = {
  ALL: 'ALL',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};
export const BOOKING_CONFIG = {
  PENDING: { label: 'Chờ xử lý', variant: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'info' },
  COMPLETED: { label: 'Đã hoàn thành', variant: 'success' },
  CANCELLED: { label: 'Đã hủy', variant: 'danger' }
}

export const STATUS_FILTERS = [
    { value: 'ALL', label: 'Tất cả trạng thái', color: 'bg-gray-100 text-gray-600' },
    { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-600 border border-amber-200' },
    { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-600 border border-blue-200' },
    { value: 'SHIPPING', label: 'Đang giao hàng', color: 'bg-purple-50 text-purple-600 border border-purple-200' },
    { value: 'COMPLETED', label: 'Đã hoàn thành', color: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
    { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-rose-50 text-rose-600 border border-rose-200' }
  ];

import { Clock, CheckCircle, AlertCircle, Truck } from 'lucide-react';
import React from 'react';

export const STATUS_CONFIG = {
  PENDING: { 
    text: "Chờ xác nhận", 
    className: "bg-amber-50 text-amber-600 border-amber-100", 
    iconName: "Clock" 
  },
  CONFIRMED: { 
    text: "Đã xác nhận", 
    className: "bg-blue-50 text-blue-600 border-blue-100", 
    iconName: "CheckCircle" 
  },
  SHIPPING: { 
    text: "Đang giao hàng", 
    className: "bg-indigo-50 text-indigo-600 border-indigo-100", 
    iconName: "Truck" 
  },
  DELIVERED: { 
    text: "Đã giao thành công", 
    className: "bg-green-50 text-green-600 border-green-100", 
    iconName: "CheckCircle" 
  },
  COMPLETED: { 
    text: "Hoàn thành", 
    className: "bg-green-50 text-green-600 border-green-100", 
    iconName: "CheckCircle" 
  },
  CANCELLED: { 
    text: "Đã hủy đơn", 
    className: "bg-rose-50 text-rose-600 border-rose-100", 
    iconName: "AlertCircle" 
  },
  PAID: { 
    text: "Đã thanh toán", 
    className: "bg-emerald-50 text-emerald-600 border-emerald-100", 
    iconName: "CheckCircle" 
  },
  UNPAID: { 
    text: "Chưa thanh toán", 
    className: "bg-orange-50 text-orange-600 border-orange-100", 
    iconName: "Clock" 
  },
};

// 1. Định nghĩa các Enum (Để tránh magic strings)
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  PROBATION: 'PROBATION',
  SUSPENDED: 'SUSPENDED',
  TERMINATED: 'TERMINATED',
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
};

// 2. Cấu hình hiển thị (Dữ liệu tĩnh)
export const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái', color: 'bg-gray-100 text-gray-600' },
  { value: USER_STATUS.ACTIVE, label: 'Đang làm việc', color: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  { value: USER_STATUS.PROBATION, label: 'Thử việc', color: 'bg-blue-50 text-blue-600 border border-blue-200' },
  { value: USER_STATUS.SUSPENDED, label: 'Tạm đình chỉ', color: 'bg-amber-50 text-amber-600 border border-amber-200' },
  { value: USER_STATUS.TERMINATED, label: 'Đã nghỉ việc', color: 'bg-rose-50 text-rose-600 border border-rose-200' }
];

export const ROLE_OPTIONS = [
  { value: 'ALL', label: 'Tất cả vai trò' },
  { value: USER_ROLES.ADMIN, label: 'Quản trị viên' },
  { value: USER_ROLES.STAFF, label: 'Nhân viên' },
  { value: USER_ROLES.CUSTOMER, label: 'Khách hàng' }
];

//bo sung comment rac