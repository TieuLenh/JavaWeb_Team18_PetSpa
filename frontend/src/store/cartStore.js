import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // --- STATE GIỎ HÀNG ---
      items: [],

      // Thêm/Cập nhật phần này trong store của bạn
toast: { show: false, message: '', type: 'success' },

showToast: (message, type = 'success') => {
  set({ toast: { show: true, message, type } });
  
  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    set({ toast: { show: false, message: '', type: 'success' } });
  }, 3000);
},
      
      // --- CÁC ACTIONS GIỎ HÀNG ---
      
      // Thêm sản phẩm + tự động bật Toast thông báo
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map(item => 
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              )
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });

        // Gọi hàm hiển thị toast ngay sau khi cập nhật state giỏ hàng thành công
        get().showToast(`Đã thêm ${product.name} vào giỏ!`);
      },

      // Xóa sản phẩm
      removeItem: (id) => set((state) => ({ 
        items: state.items.filter(item => item.id !== id) 
      })),

      // Cập nhật số lượng
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),

      // Xóa sạch giỏ hàng
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // Tên khóa trong localStorage
      
      // BỔ SUNG QUAN TRỌNG: Lọc bộ nhớ, CHỈ cho phép 'items' lọt vào LocalStorage.
      // Tránh lưu các trạng thái rác hoặc trạng thái tạm thời như toast hay timeoutId.
      partialize: (state) => ({ items: state.items }), 
    }
  )
);