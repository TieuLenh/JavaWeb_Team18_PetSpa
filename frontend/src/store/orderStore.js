import { create } from 'zustand';
import OrderService from '../services/orderService'; // Đường dẫn tới file Order Service của bạn

export const useOrderStore = create((set, get) => ({
  // ─── STATES ────────────────────────────────────────────────────────────────
  orders: [],            // Danh sách đơn hàng (tất cả hoặc theo khách hàng cá nhân)
  currentOrder: null,    // Chi tiết đơn hàng đang kiểm tra hoặc thanh toán
  
  loading: false,         // Trạng thái load danh sách / chi tiết đơn hàng
  submitting: false,      // Trạng thái xử lý đặt hàng / thanh toán

  // ─── ACTIONS: READ ─────────────────────────────────────────────────────────
  
  // Lấy toàn bộ đơn hàng hệ thống (Dành cho Quản lý cửa hàng / Admin)
  fetchOrders: async () => {
    try {
      set({ loading: true });
      const res = await OrderService.getOrders();
      const data = res?.success ? res.data : res;
      set({ orders: data || [] });
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Lấy chi tiết đơn hàng bằng mã ID
  fetchOrderById: async (orderId) => {
    try {
      set({ loading: true, currentOrder: null });
      const res = await OrderService.getOrderById(orderId);
      if (res && res.success) {
        set({ currentOrder: res.data });
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Lấy lịch sử mua hàng của riêng một khách hàng (Dùng ở trang quản lý đơn cá nhân)
  fetchOrdersByUser: async (userId) => {
    try {
      set({ loading: true });
      const res = await OrderService.getOrdersByUser(userId);
      if (res && res.success) {
        set({ orders: res.data || [] });
      }
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử mua hàng cá nhân:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ─── ACTIONS: MUTATIONS (TẠO/SỬA/THANH TOÁN) ────────────────────────────────
  
  // Tiến hành đặt mua giỏ hàng mới
  createOrder: async (orderData) => {
    try {
      set({ submitting: true });
      const res = await OrderService.createOrder(orderData);
      if (res && res.success) {
        set((state) => ({ orders: [res.data, ...state.orders] }));
      }
      return res; // Trả data về để giao diện chuyển hướng qua trang Checkout/Cảm ơn
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng mới:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  // Cập nhật trạng thái đơn (PENDING -> CONFIRMED -> DELIVERING -> SUCCESS)
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      set({ submitting: true });
      const res = await OrderService.updateOrderStatus(orderId, newStatus);
      if (res && res.success) {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === Number(orderId) ? { ...o, status: newStatus } : o)),
          currentOrder: state.currentOrder?.id === Number(orderId) ? { ...state.currentOrder, status: newStatus } : state.currentOrder
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  // Khách hàng hoặc Admin tự hủy đơn hàng
  cancelOrder: async (orderId) => {
    try {
      set({ submitting: true });
      const res = await OrderService.cancelOrder(orderId);
      if (res && res.success) {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === Number(orderId) ? { ...o, status: 'CANCELLED' } : o)),
          currentOrder: state.currentOrder?.id === Number(orderId) ? { ...state.currentOrder, status: 'CANCELLED' } : state.currentOrder
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  // Thực hiện tích hợp cổng hoặc lưu trạng thái thanh toán đơn
  payOrder: async (orderId, paymentMethod) => {
    try {
      set({ submitting: true });
      const res = await OrderService.payOrder(orderId, paymentMethod);
      if (res && res.success) {
        // Đồng bộ dữ liệu thanh toán bao gồm: trạng thái PAID và thời gian thanh toán
        const updateFields = { payment_status: 'PAID', payment_method: paymentMethod };
        
        set((state) => ({
          orders: state.orders.map((o) => (o.id === Number(orderId) ? { ...o, ...updateFields } : o)),
          currentOrder: state.currentOrder?.id === Number(orderId) ? { ...state.currentOrder, ...updateFields } : state.currentOrder
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi khi xử lý thanh toán đơn hàng:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },
}));