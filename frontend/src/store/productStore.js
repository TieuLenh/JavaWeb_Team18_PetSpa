import { create } from 'zustand';
import ProductService from '../services/ProductService'; // <-- Import file service bạn vừa bổ sung ở trên

export const useProductStore = create((set, get) => ({
  // ─── STATES (TRẠNG THÁI) ──────────────────────────────────────────────────
  products: [],          // Danh sách toàn bộ sản phẩm
  categories: [],        // Danh sách danh mục sản phẩm
  currentProduct: null,  // Chi tiết một sản phẩm đang xem
  selectedCategory: 0,   // Danh mục đang được chọn để lọc (Mặc định = 0 là Tất cả)
  loading: false,        // Trạng thái chờ khi tải danh sách tổng thể
  detailLoading: false,  // Trạng thái chờ riêng khi tải chi tiết một sản phẩm

  // ─── ACTIONS (HÀNH ĐỘNG) ──────────────────────────────────────────────────

  // Thiết lập danh mục đang chọn từ bộ lọc UI
  setSelectedCategory: (id) => set({ selectedCategory: id }),

  // Xóa nhanh dữ liệu sản phẩm đang xem khi Unmount giao diện
  clearCurrentProduct: () => set({ currentProduct: null }),

  // ==========================================
  // 1. QUẢN LÝ SẢN PHẨM (PRODUCT TẬN DỤNG SERVICE)
  // ==========================================

  // 1.1 Lấy danh sách toàn bộ sản phẩm
  fetchProducts: async () => {
    if (get().products.length > 0) return;
    try {
      set({ loading: true });
      
      const res = await ProductService.getProducts(); // <-- Tận dụng Service
      const data = res?.success ? res.data : (res?.data || res);
      
      set({ products: data || [] });
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm qua Service:", err);
    } finally {
      set({ loading: false });
    }
  },

  // 1.2 Lấy chi tiết một sản phẩm dựa trên ID
  fetchProductById: async (id) => {
    if (get().currentProduct?.id === Number(id)) return;
    try {
      set({ detailLoading: true, currentProduct: null });
      
      const res = await ProductService.getProductById(id); // <-- Tận dụng Service
      const foundProduct = res?.success ? res.data : null;

      set({ currentProduct: foundProduct });
    } catch (err) {
      console.error(`Lỗi khi tải chi tiết sản phẩm ID ${id} qua Service:`, err);
    } finally {
      set({ detailLoading: false });
    }
  },

  // ==========================================
  // 2. QUẢN LÝ DANH MỤC (CATEGORY TẬN DỤNG SERVICE)
  // ==========================================

  // 2.1 Lấy danh sách danh mục (categories) cho bộ lọc và quản trị UI
  fetchCategories: async () => {
    if (get().categories.length > 0) return;
    try {
      set({ loading: true });
      
      const res = await ProductService.getProductCategories(); // <-- Tận dụng Service
      const data = res?.success ? res.data : (res?.data || res);

      set({ categories: data || [] });
    } catch (err) {
      console.error("Lỗi khi tải danh mục sản phẩm qua Service:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // 2.2 Thêm mới một danh mục
  createCategory: async (newCategoryData) => {
    try {
      set({ loading: true });
      
      const res = await ProductService.createCategory(newCategoryData); // <-- Tận dụng Service
      
      if (res?.success) {
        set((state) => ({
          categories: [...state.categories, res.data] // Cập nhật trực tiếp state nội bộ
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi khi tạo danh mục qua Service:", err);
      return { success: false, message: "Lỗi hệ thống không thể tạo." };
    } finally {
      set({ loading: false });
    }
  },

  // 2.3 Cập nhật thông tin danh mục theo ID
  updateCategory: async (id, updatedData) => {
    try {
      set({ loading: true });
      
      const res = await ProductService.updateCategory(id, updatedData); // <-- Tận dụng Service
      
      if (res?.success) {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updatedData } : cat
          )
        }));
      }
      return res;
    } catch (err) {
      console.error(`Lỗi khi sửa danh mục ID ${id} qua Service:`, err);
      return { success: false, message: "Lỗi hệ thống không thể cập nhật." };
    } finally {
      set({ loading: false });
    }
  },

  // 2.4 Xóa danh mục khỏi hệ thống
  deleteCategory: async (id) => {
    try {
      set({ loading: true });
      
      const res = await ProductService.deleteCategory(id); // <-- Tận dụng Service
      
      if (res?.success) {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id)
        }));
      }
      return res;
    } catch (err) {
      console.error(`Lỗi khi xóa danh mục ID ${id} qua Service:`, err);
      return { success: false, message: "Lỗi hệ thống không thể xóa danh mục." };
    } finally {
      set({ loading: false });
    }
  }
}));