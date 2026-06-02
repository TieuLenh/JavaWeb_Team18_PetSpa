import { create } from 'zustand';
import PetService from '../services/petService'; // Đường dẫn tới file Pet Service của bạn

export const usePetStore = create((set, get) => ({
  // ─── STATES ────────────────────────────────────────────────────────────────
  pets: [],               // Danh sách tất cả thú cưng hoặc theo user công khai
  currentPet: null,       // Chi tiết 1 thú cưng đang xem/sửa
  species: [],            // Bảng danh mục các loài (Chó, mèo, chim...)
  
  loading: false,         // Tải danh sách/chi tiết chung
  loadingSpecies: false,  // Tải danh mục loài
  submitting: false,      // Đang xử lý Tạo/Sửa/Xóa

  // ─── ACTIONS: READ ─────────────────────────────────────────────────────────
  
  // Lấy tất cả thú cưng hệ thống
  fetchPets: async () => {
    try {
      set({ loading: true });
      const res = await PetService.getPets();
      if (res && res.success) {
        set({ pets: res.data || [] });
      } else {
        // Dự phòng nếu mock trả thẳng mảng/đối tượng không bọc success
        set({ pets: res?.data || res || [] });
      }
    } catch (err) {
      console.error("Error fetching all pets:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Lấy thú cưng theo mã người dùng (Dùng cho trang quản lý pet của khách hàng)
  fetchPetsByUser: async (userId) => {
    try {
      set({ loading: true });
      const res = await PetService.getPetsByUser(userId);
      if (res && res.success) {
        set({ pets: res.data || [] });
      }
    } catch (err) {
      console.error("Error fetching user pets:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Lấy chi tiết một bé thú cưng
  fetchPetById: async (petId) => {
    try {
      set({ loading: true, currentPet: null });
      const res = await PetService.getPetById(petId);
      if (res && res.success) {
        set({ currentPet: res.data });
      }
    } catch (err) {
      console.error("Error fetching pet detail:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Lấy danh sách các giống loài (Species) đổ vào form Create/Update Pet
  fetchSpecies: async () => {
    // Tối ưu: Nếu có sẵn danh mục loài rồi thì không gọi lại API nữa
    if (get().species.length > 0) return;
    
    try {
      set({ loadingSpecies: true });
      const res = await PetService.getSpecies();
      // Linh hoạt kiểm tra bọc cấu trúc success hay mảng thô
      const data = res?.success ? res.data : res;
      set({ species: data || [] });
    } catch (err) {
      console.error("Error fetching species:", err);
    } finally {
      set({ loadingSpecies: false });
    }
  },

  // ─── ACTIONS: MUTATIONS (CUD) ──────────────────────────────────────────────
  
  // Tạo thú cưng mới
  createPet: async (petData) => {
    try {
      set({ submitting: true });
      const res = await PetService.createPet(petData);
      if (res && res.success) {
        // Cập nhật local state ngay lập tức giúp UI render realtime
        set((state) => ({ pets: [...state.pets, res.data] }));
      }
      return res;
    } catch (err) {
      console.error("Error creating pet:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  // Cập nhật thông tin thú cưng
  updatePet: async (petId, petData) => {
    try {
      set({ submitting: true });
      const res = await PetService.updatePet(petId, petData);
      if (res && res.success) {
        // Cập nhật đồng thời trong mảng danh sách và object chi tiết
        set((state) => ({
          pets: state.pets.map((p) => (p.id === Number(petId) ? { ...p, ...res.data } : p)),
          currentPet: state.currentPet?.id === Number(petId) ? { ...state.currentPet, ...res.data } : state.currentPet
        }));
      }
      return res;
    } catch (err) {
      console.error("Error updating pet:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  // Xóa thú cưng khỏi danh sách
  deletePet: async (petId) => {
    try {
      set({ submitting: true });
      const res = await PetService.deletePet(petId);
      if (res && res.success) {
        // Loại bỏ phần tử khỏi danh sách local state
        set((state) => ({
          pets: state.pets.filter((p) => p.id !== Number(petId)),
          currentPet: state.currentPet?.id === Number(petId) ? null : state.currentPet
        }));
      }
      return res;
    } catch (err) {
      console.error("Error deleting pet:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },
}));