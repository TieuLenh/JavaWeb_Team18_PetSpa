// src/store/reviewStore.js
import { create } from 'zustand';
// Giả định tên file chứa các hàm xử lý API bạn vừa gửi là ReviewService.js
import ReviewService from '../services/reviewService';

export const useReviewStore = create((set, get) => ({
  // ─── STATES ────────────────────────────────────────────────────────────────
  productReviews: [],       // Danh sách đánh giá của sản phẩm đang xem
  serviceReviews: [],       // Danh sách đánh giá của dịch vụ đang xem
  
  loadingProduct: false,    // Trạng thái load review sản phẩm
  loadingService: false,    // Trạng thái load review dịch vụ
  submitting: false,        // Trạng thái khi tạo, sửa, xóa review (hiệu ứng nút bấm)
  error: null,              // Lưu trữ thông báo lỗi từ hệ thống nếu có

  // ─── ACTIONS: PRODUCT REVIEWS ──────────────────────────────────────────────
  
  // Lấy danh sách đánh giá theo ID sản phẩm
  fetchProductReviews: async (productId) => {
    try {
      set({ loadingProduct: true, error: null });
      const res = await ReviewService.getProductReviews(productId);
      if (res && res.success) {
        set({ productReviews: res.data || [] });
      } else {
        set({ productReviews: [] });
      }
    } catch (err) {
      console.error("Lỗi trong store khi lấy review sản phẩm:", err);
      set({ productReviews: [], error: err.message });
    } finally {
      set({ loadingProduct: false });
    }
  },

  // Tạo đánh giá mới cho sản phẩm
  createProductReview: async (reviewData) => {
    try {
      set({ submitting: true, error: null });
      const res = await ReviewService.createProductReview(reviewData);
      
      if (res && res.success) {
        // Cập nhật local state: Đẩy review mới lên đầu danh sách để người dùng thấy ngay
        set((state) => ({
          productReviews: [res.data, ...state.productReviews]
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi trong store khi tạo review sản phẩm:", err);
      return { success: false, message: "Không thể gửi đánh giá sản phẩm." };
    } finally {
      set({ submitting: false });
    }
  },

  // ─── ACTIONS: SERVICE REVIEWS ──────────────────────────────────────────────
  
  // Lấy danh sách đánh giá theo ID dịch vụ
  fetchServiceReviews: async (serviceId) => {
    try {
      set({ loadingService: true, error: null });
      const res = await ReviewService.getServiceReviews(serviceId);
      if (res && res.success) {
        set({ serviceReviews: res.data || [] });
      } else {
        set({ serviceReviews: [] });
      }
    } catch (err) {
      console.error("Lỗi trong store khi lấy review dịch vụ:", err);
      set({ serviceReviews: [], error: err.message });
    } finally {
      set({ loadingService: false });
    }
  },

  // Tạo đánh giá mới cho dịch vụ Spa
  createServiceReview: async (reviewData) => {
    try {
      set({ submitting: true, error: null });
      const res = await ReviewService.createServiceReview(reviewData);
      
      if (res && res.success) {
        // Cập nhật local state ngay lập tức cho mảng dịch vụ
        set((state) => ({
          serviceReviews: [res.data, ...state.serviceReviews]
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi trong store khi tạo review dịch vụ:", err);
      return { success: false, message: "Không thể gửi đánh giá dịch vụ." };
    } finally {
      set({ submitting: false });
    }
  },

  // ─── ACTIONS: COMMON (DÙNG CHUNG) ──────────────────────────────────────────
  
  // Cập nhật một đánh giá (Tự động tìm và cập nhật đúng mảng Sản phẩm hoặc Dịch vụ)
  updateReview: async (reviewId, reviewData) => {
    try {
      set({ submitting: true, error: null });
      const res = await ReviewService.updateReview(reviewId, reviewData);
      
      if (res && res.success) {
        // Hàm map cập nhật bản ghi có id trùng khớp
        const updateMappedList = (list) => 
          list.map((r) => (r.id === reviewId ? { ...r, ...res.data } : r));

        set((state) => ({
          productReviews: updateMappedList(state.productReviews),
          serviceReviews: updateMappedList(state.serviceReviews),
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi trong store khi cập nhật review:", err);
      return { success: false, message: "Cập nhật đánh giá thất bại." };
    } finally {
      set({ submitting: false });
    }
  },

  // Xóa đánh giá (Tự động lọc bỏ khỏi mảng Sản phẩm hoặc Dịch vụ tương ứng)
  deleteReview: async (reviewId) => {
    try {
      set({ submitting: true, error: null });
      const res = await ReviewService.deleteReview(reviewId);
      
      if (res && res.success) {
        // Hàm filter lọc bỏ bản ghi bị xóa khỏi local state
        const filterDeletedList = (list) => list.filter((r) => r.id !== reviewId);

        set((state) => ({
          productReviews: filterDeletedList(state.productReviews),
          serviceReviews: filterDeletedList(state.serviceReviews),
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi trong store khi xóa review:", err);
      return { success: false, message: "Xóa đánh giá thất bại." };
    } finally {
      set({ submitting: false });
    }
  },

  // Giải phóng dữ liệu review khi unmount/rời trang chi tiết sản phẩm/dịch vụ
  clearReviews: () => set({ productReviews: [], serviceReviews: [], error: null })
}));