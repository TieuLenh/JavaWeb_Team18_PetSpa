// src/store/bookingStore.js
import { create } from 'zustand';
import BookingService from '../services/BookingService';

export const useBookingStore = create((set, get) => ({
  // ─── STATES ────────────────────────────────────────────────────────────────
  bookings: [],             // Danh sách lịch hẹn (BookingList)
  currentBooking: null,     // Chi tiết lịch hẹn đang xem (BookingDetail)
  slots: [],                // Khung giờ trống theo ngày (BookingCreate)
  
  loading: false,           // Trạng thái load danh sách tổng hợp
  loadingDetail: false,     // Trạng thái load chi tiết (Khớp chính xác với BookingDetail.jsx)
  loadingSlots: false,      // Trạng thái load khung giờ trống
  submitting: false,        // Trạng thái khi bấm submit tạo hoặc hủy đơn đặt
  error: null,              // Lưu trữ thông báo lỗi hệ thống nếu có

  // ─── ACTIONS: FETCH DATA ───────────────────────────────────────────────────
  
  // Lấy danh sách lịch sử đặt lịch (Dùng cho BookingList)
  fetchBookings: async () => {
    try {
      set({ loading: true, error: null });
      const res = await BookingService.getBookings();
      if (res && res.success) {
        set({ bookings: res.data || [] });
      } else {
        set({ bookings: [] });
      }
    } catch (err) {
      console.error("Lỗi trong store khi lấy danh sách booking:", err);
      set({ bookings: [], error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Đổi tên từ fetchBookingById thành fetchBookingDetail để khớp với BookingDetail.jsx
  // Sử dụng state loadingDetail tách biệt để không ảnh hưởng tới loading danh sách
  fetchBookingDetail: async (id) => {
    try {
      set({ loadingDetail: true, currentBooking: null, error: null });
      const res = await BookingService.getBookingById(id);
      if (res && res.success && res.data && Object.keys(res.data).length > 0) {
        set({ currentBooking: res.data });
      } else {
        set({ currentBooking: null });
      }
    } catch (err) {
      console.error("Lỗi trong store khi lấy chi tiết booking:", err);
      set({ currentBooking: null, error: err.message });
    } finally {
      set({ loadingDetail: false });
    }
  },

  // Giải phóng dữ liệu booking hiện tại khi đóng/rời trang chi tiết
  clearCurrentBooking: () => set({ currentBooking: null }),

  // Lấy danh sách khung giờ trống dựa trên ngày được chọn (Dùng cho BookingCreate)
  fetchAvailableSlots: async (date) => {
    if (!date) {
      set({ slots: [] });
      return;
    }
    try {
      set({ loadingSlots: true, error: null });
      const res = await BookingService.getAvailableSlots(date);
      if (res && res.success) {
        set({ slots: res.data || [] });
      } else {
        set({ slots: [] });
      }
    } catch (err) {
      console.error("Lỗi trong store khi lấy danh sách slot trống:", err);
      set({ slots: [] });
    } finally {
      set({ loadingSlots: false });
    }
  },

  // Đặt lại (reset) danh sách khung giờ về rỗng khi cần thiết
  clearSlots: () => set({ slots: [] }),

  // ─── ACTIONS: MUTATIONS (TẠO/HỦY) ──────────────────────────────────────────
  
  // Tạo mới một lịch hẹn dịch vụ Spa (Dùng cho BookingCreate)
  createBooking: async (formData) => {
    try {
      set({ submitting: true, error: null });
      const res = await BookingService.createBooking(formData);
      
      // Nếu thành công, có thể làm mới lại danh sách booking chạy ngầm
      if (res && res.success) {
        get().fetchBookings(); 
      }
      return res; // Trả về response nguyên bản để component handle Modal/Errors tiếp
    } catch (err) {
      console.error("Lỗi trong store khi gọi API tạo booking:", err);
      return { success: false, message: "Đã xảy ra lỗi hệ thống khi xử lý. Xin thử lại sau!" };
    } finally {
      set({ submitting: false });
    }
  },

  // Hủy lịch hẹn hiện tại (Dùng cho BookingDetail)
  cancelBooking: async (bookingId) => {
    try {
      // Sử dụng lại biến cờ trạng thái "submitting" đã cấu trúc sẵn cho các hiệu ứng Button Disabled
      set({ submitting: true, error: null });
      await BookingService.cancelBooking(bookingId);

      // Cập nhật ngay trạng thái Client-side cho `currentBooking` mà không cần refetch
      set((state) => {
        const updatedBooking = state.currentBooking && state.currentBooking.id === bookingId
          ? { ...state.currentBooking, status: 'CANCELLED' }
          : state.currentBooking;

        // Đồng thời cập nhật luôn trạng thái trong danh sách tổng `bookings` nếu có dữ liệu ở đó
        const updatedBookings = state.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
        );

        return {
          currentBooking: updatedBooking,
          bookings: updatedBookings
        };
      });

      return { success: true };
    } catch (err) {
      console.error("Lỗi trong store khi hủy đơn lịch hẹn:", err);
      return { success: false, message: "Hủy lịch thất bại, vui lòng thử lại sau." };
    } finally {
      set({ submitting: false });
    }
  },
}));