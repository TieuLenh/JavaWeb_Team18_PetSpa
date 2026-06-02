// src/store/staffStore.js
import { create } from "zustand";
import staffService from "../services/staffService";

export const useStaffStore = create((set, get) => ({
  // ─────────────────────────────────────────
  // STATES
  // ─────────────────────────────────────────
  staffs: [],
  currentStaff: null,

  loading: false,
  detailLoading: false,

  selectedRole: "ALL",

  // ─────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────

  // Lấy toàn bộ danh sách nhân sự
  fetchStaffs: async () => {
    // Tránh gọi lại nếu đã có dữ liệu
    if (get().staffs.length > 0) return;

    try {
      set({ loading: true });

      const res = await staffService.getStaffs();

      const data = res?.data || [];

      set({
        staffs: data,
      });
    } catch (err) {
      console.error("Lỗi tải danh sách nhân sự:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Lấy chi tiết nhân sự theo ID
  fetchStaffById: async (id) => {
    // Tránh reload nếu đã đúng staff hiện tại
    if (get().currentStaff?.id === Number(id)) return;

    try {
      set({
        detailLoading: true,
        currentStaff: null,
      });

      const res = await staffService.getStaffById(id);

      set({
        currentStaff: res?.data || null,
      });
    } catch (err) {
      console.error(`Lỗi tải nhân sự ID ${id}:`, err);
    } finally {
      set({ detailLoading: false });
    }
  },

  // Lọc nhân sự theo role
  fetchStaffByRole: async (role) => {
    try {
      set({
        loading: true,
        selectedRole: role,
      });

      // Nếu ALL → lấy toàn bộ
      if (role === "ALL") {
        const res = await staffService.getStaffs();

        set({
          staffs: res?.data || [],
        });

        return;
      }

      const res = await staffService.getStaffByRole(role);

      set({
        staffs: res?.data || [],
      });
    } catch (err) {
      console.error("Lỗi lọc nhân sự theo role:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Tạo nhân sự mới
  createStaff: async (staffData) => {
    try {
      set({ loading: true });

      const res = await staffService.createStaff(staffData);

      const newStaff = res?.data;

      if (newStaff) {
        set({
          staffs: [newStaff, ...get().staffs],
        });
      }

      return {
        success: true,
        data: newStaff,
      };
    } catch (err) {
      console.error("Lỗi tạo nhân sự:", err);

      return {
        success: false,
        error: err?.message || "Không thể tạo nhân sự",
      };
    } finally {
      set({ loading: false });
    }
  },

  // Cập nhật nhân sự
  updateStaff: async (id, staffData) => {
    try {
      set({ loading: true });

      const res = await staffService.updateStaff(id, staffData);

      const updatedStaff = res?.data;

      set({
        staffs: get().staffs.map((staff) =>
          staff.id === Number(id)
            ? updatedStaff
            : staff
        ),

        currentStaff:
          get().currentStaff?.id === Number(id)
            ? updatedStaff
            : get().currentStaff,
      });

      return {
        success: true,
        data: updatedStaff,
      };
    } catch (err) {
      console.error("Lỗi cập nhật nhân sự:", err);

      return {
        success: false,
        error: err?.message || "Không thể cập nhật nhân sự",
      };
    } finally {
      set({ loading: false });
    }
  },

  // Xóa nhân sự
  deleteStaff: async (id) => {
    try {
      set({ loading: true });

      await staffService.deleteStaff(id);

      set({
        staffs: get().staffs.filter(
          (staff) => staff.id !== Number(id)
        ),
      });

      return {
        success: true,
      };
    } catch (err) {
      console.error("Lỗi xóa nhân sự:", err);

      return {
        success: false,
        error: err?.message || "Không thể xóa nhân sự",
      };
    } finally {
      set({ loading: false });
    }
  },

  // Chọn role filter
  setSelectedRole: (role) => {
    set({ selectedRole: role });
  },

  // Xóa current staff khi unmount
  clearCurrentStaff: () => {
    set({ currentStaff: null });
  },
}));