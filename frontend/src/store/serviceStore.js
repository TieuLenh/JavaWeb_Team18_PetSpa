import { create } from 'zustand';
import ServiceEntityService from '../services/serviceService'; // Đường dẫn tới file Service của bạn

export const useServiceStore = create((set, get) => ({
  // ─── STATES ────────────────────────────────────────────────────────────────
  services: [],           // Danh sách dịch vụ (có thể lọc theo category hoặc lấy hết)
  categories: [],         // Danh sách danh mục dịch vụ (Spa, Hotel, Styling...)
  currentService: null,   // Chi tiết 1 gói dịch vụ cụ thể
  
  loading: false,         // Tải danh sách dịch vụ / chi tiết dịch vụ
  loadingCategories: false,// Tải danh mục dịch vụ
  submitting: false,      // Trạng thái xử lý thêm/sửa/xóa (Admin dashboard)

  // ─── ACTIONS: READ ─────────────────────────────────────────────────────────

  // Lấy toàn bộ danh sách dịch vụ
  fetchServices: async () => {
    try {
      set({ loading: true });
      const res = await ServiceEntityService.getServices();
      const data = res?.success ? res.data : res;
      set({ services: data || [] });
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Lấy dịch vụ được phân loại theo Category ID (Dùng khi user click xem nhóm dịch vụ cụ thể)
  fetchServicesByCategory: async (categoryId) => {
    try {
      set({ loading: true });
      const res = await ServiceEntityService.getServicesByCategory(categoryId);
      if (res && res.success) {
        set({ services: res.data || [] });
      }
    } catch (err) {
      console.error("Error fetching services by category:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Xem chi tiết một gói dịch vụ
  fetchServiceById: async (serviceId) => {
    try {
      set({ loading: true, currentService: null });
      const res = await ServiceEntityService.getServiceById(serviceId);
      if (res && res.success) {
        set({ currentService: res.data });
      }
    } catch (err) {
      console.error("Error fetching service detail:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Lấy tất cả danh mục dịch vụ (Đổ ra trang chủ / Thanh điều hướng / Form chọn)
  fetchServiceCategories: async () => {
    if (get().categories.length > 0) return; // Tránh lặp lại request nếu đã có data
    try {
      set({ loadingCategories: true });
      const res = await ServiceEntityService.getServiceCategories();
      const data = res?.success ? res.data : res;
      set({ categories: data || [] });
      
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      set({ loadingCategories: false });
    }
  },

  // ─── ACTIONS: MUTATIONS FOR SERVICE CATEGORIES ─────────────────────────────
  
  createServiceCategory: async (categoryData) => {
    try {
      set({ submitting: true });
      const res = await ServiceEntityService.createServiceCategory(categoryData);
      if (res && res.success) {
        set((state) => ({ categories: [...state.categories, res.data] }));
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  updateServiceCategory: async (id, categoryData) => {
    try {
      set({ submitting: true });
      const res = await ServiceEntityService.updateServiceCategory(id, categoryData);
      if (res && res.success) {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === Number(id) ? { ...c, ...res.data } : c))
        }));
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  deleteServiceCategory: async (id) => {
    try {
      set({ submitting: true });
      const res = await ServiceEntityService.deleteServiceCategory(id);
      if (res && res.success) {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== Number(id))
        }));
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  // ─── ACTIONS: MUTATIONS FOR SERVICES ───────────────────────────────────────
  
  createService: async (serviceData) => {
    try {
      set({ submitting: true });
      const res = await ServiceEntityService.createService(serviceData);
      if (res && res.success) {
        set((state) => ({ services: [...state.services, res.data] }));
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  updateService: async (serviceId, serviceData) => {
    try {
      set({ submitting: true });
      const res = await ServiceEntityService.updateService(serviceId, serviceData);
      if (res && res.success) {
        set((state) => ({
          services: state.services.map((s) => (s.id === Number(serviceId) ? { ...s, ...res.data } : s)),
          currentService: state.currentService?.id === Number(serviceId) ? { ...state.currentService, ...res.data } : state.currentService
        }));
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  deleteService: async (serviceId) => {
    try {
      set({ submitting: true });
      const res = await ServiceEntityService.deleteService(serviceId);
      if (res && res.success) {
        set((state) => ({
          services: state.services.filter((s) => s.id !== Number(serviceId)),
          currentService: state.currentService?.id === Number(serviceId) ? null : state.currentService
        }));
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },
}));