import { create } from 'zustand';
import UserService from '../services/userService'; // Đường dẫn tới file User Service của bạn

export const useUserStore = create((set, get) => ({
  // ─── STATES ────────────────────────────────────────────────────────────────
  users: [],             // Danh sách người dùng hệ thống (tất cả hoặc theo role)
  currentUser: null,     // Chi tiết 1 người dùng cụ thể đang xem/sửa
  
  loading: false,         // Trạng thái tải dữ liệu
  submitting: false,      // Trạng thái khi tạo, cập nhật hoặc xóa

  // ─── ACTIONS: READ ─────────────────────────────────────────────────────────
  
  // Lấy tất cả danh sách người dùng (Admin Dashboard)
  fetchUsers: async () => {
    try {
      set({ loading: true });
      const res = await UserService.getUsers();
      const data = res?.success ? res.data : res;
      set({ users: data || [] });
    } catch (err) {
      console.error("Lỗi khi lấy danh sách users:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Lấy chi tiết thông tin một user theo ID
  fetchUserById: async (userId) => {
    try {
      set({ loading: true, currentUser: null });
      const res = await UserService.getUserById(userId);
      if (res && res.success) {
        set({ currentUser: res.data });
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết user:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Lọc danh sách user theo vai trò (Ví dụ: 'CUSTOMER', 'STAFF')
  fetchUsersByRole: async (roleName) => {
    try {
      set({ loading: true });
      const res = await UserService.getUsersByRole(roleName);
      if (res && res.success) {
        set({ users: res.data || [] });
      }
    } catch (err) {
      console.error("Lỗi khi lọc user theo role:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ─── ACTIONS: MUTATIONS (CUD) ──────────────────────────────────────────────
  
  // Tạo tài khoản người dùng mới
  createUser: async (userData) => {
    try {
      set({ submitting: true });
      const res = await UserService.createUser(userData);
      if (res && res.success) {
        // Cập nhật ngay vào danh sách local
        set((state) => ({ users: [...state.users, res.data] }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi khi tạo user:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  // Cập nhật thông tin profile chi tiết của user
  updateUser: async (userId, userData) => {
    try {
      set({ submitting: true });
      const res = await UserService.updateUser(userId, userData);
      if (res && res.success) {
        set((state) => ({
          // Thay đổi phần tử trong mảng tổng
          users: state.users.map((u) => (u.id === Number(userId) ? { ...u, ...res.data } : u)),
          // Nếu user đang chỉnh sửa trùng với chi tiết đang xem thì cập nhật luôn
          currentUser: state.currentUser?.id === Number(userId) ? { ...state.currentUser, ...res.data } : state.currentUser
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi khi cập nhật user:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  // Thay đổi trạng thái tài khoản nhanh (ACTIVE / INACTIVE / BANNED)
  updateUserStatus: async (userId, status) => {
    try {
      set({ submitting: true });
      const res = await UserService.updateUserStatus(userId, status);
      if (res && res.success) {
        set((state) => ({
          users: state.users.map((u) => (u.id === Number(userId) ? { ...u, status: res.data.status } : u)),
          currentUser: state.currentUser?.id === Number(userId) ? { ...state.currentUser, status: res.data.status } : state.currentUser
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái user:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },

  // Xóa người dùng ra khỏi hệ thống
  deleteUser: async (userId) => {
    try {
      set({ submitting: true });
      const res = await UserService.deleteUser(userId);
      if (res && res.success) {
        set((state) => ({
          users: state.users.filter((u) => u.id !== Number(userId)),
          currentUser: state.currentUser?.id === Number(userId) ? null : state.currentUser
        }));
      }
      return res;
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
      return { success: false, message: err.message };
    } finally {
      set({ submitting: false });
    }
  },
}));