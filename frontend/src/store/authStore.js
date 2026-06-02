import { create } from "zustand";
import AuthService from "../services/authService";

/**
 * Safe parse localStorage user
 */
const getUser = () => {
  try {
    const userStr = localStorage.getItem("petspa_user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const getToken = () => localStorage.getItem("petspa_token");

/**
 * AUTH STORE (Zustand)
 */
export const useAuthStore = create((set, get) => ({
  // =====================
  // STATE
  // =====================
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getUser() && !!getToken(),
  loading: false,
  error: null,

  // =====================
  // ACTIONS
  // =====================

  // Hành động đăng nhập trọn gói
  loginAction: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await AuthService.login(credentials);
      const responseData = res?.data?.data ? res.data.data : res?.data;
      const user = responseData?.user;
      const access_token = responseData?.access_token || responseData?.token;

      if (!access_token || !user) {
        throw new Error("Không nhận được thông tin xác thực từ hệ thống.");
      }

      localStorage.setItem("petspa_user", JSON.stringify(user));
      localStorage.setItem("petspa_token", access_token);

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      const userRole =
        user?.role?.name?.toUpperCase?.() ||
        (typeof user?.role === "string" ? user.role.toUpperCase() : "");

      return { success: true, role: userRole };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  // 🌟 MỚI: Hành động đăng ký trọn gói tự động lưu trạng thái xác thực khi thành công
  registerAction: async (registerData) => {
  console.log("REGISTER ACTION RUNNING");

  set({ loading: true, error: null });

  try {
    const res = await AuthService.register(registerData);

    console.log("RES:", res);

    const responseData = res.data;

    const user = responseData.user;
    const access_token = responseData.access_token;

    if (user && access_token) {
      localStorage.setItem("petspa_user", JSON.stringify(user));
      localStorage.setItem("petspa_token", access_token);

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Đăng ký thất bại";

    set({
      error: msg,
      loading: false,
    });

    return {
      success: false,
      error: msg,
    };
  }
},

  login: (user, token) => {
    if (!user || !token) return;
    localStorage.setItem("petspa_user", JSON.stringify(user));
    localStorage.setItem("petspa_token", token);
    set({ user, token, isAuthenticated: true, error: null });
  },

  register: (user, token) => {
    if (!user || !token) return;
    localStorage.setItem("petspa_user", JSON.stringify(user));
    localStorage.setItem("petspa_token", token);
    set({ user, token, isAuthenticated: true, error: null });
  },

  logout: () => {
    localStorage.removeItem("petspa_user");
    localStorage.removeItem("petspa_token");
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  sync: () => {
    const currentToken = getToken();
    const currentUser = getUser();
    set({
      user: currentUser,
      token: currentToken,
      isAuthenticated: !!currentToken && !!currentUser,
    });
  },

  reset: () => {
    localStorage.clear();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  getCurrentUser: () => get().user,
}));
