import React, { useState, useEffect } from 'react';
import { ShoppingBag, Inbox } from 'lucide-react';
import OrderItem from './OrderItem'; 
import { useOrderStore } from '../../store/orderStore'; 
import { useCartStore } from '../../store/cartStore'; 
import { STATUS_FILTERS, STATUS_CONFIG } from '../../utils/constants';

const TABS = STATUS_FILTERS;

const OrderList = () => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  
  // Lấy dữ liệu và các hành động xử lý đơn từ useOrderStore
  const { orders, loading, fetchOrders, cancelOrder } = useOrderStore();
  const { showToastNotification } = useCartStore();

  useEffect(() => {
    // Gọi hành động fetch từ store tập trung
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    // Lọc đơn hàng dựa trên danh sách orders từ Store toàn cục
    if (activeTab === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => (order.status || '').toUpperCase() === activeTab));
    }
  }, [activeTab, orders]);

  const handleCancelOrder = async (orderId) => {
    try {
      // Gọi action hủy đơn từ Zustand Store để tự động đồng bộ UI toàn hệ thống
      const res = await cancelOrder(orderId);
      
      if (res && res.success) {
        if (showToastNotification) {
          showToastNotification("Hủy đơn hàng thành công!");
        } else {
          alert("Hủy đơn hàng thành công!");
        }
      } else {
        alert(res?.message || "Không thể hủy đơn hàng vào lúc này.");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý hủy đơn hàng:", error);
      alert("Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="w-full text-left space-y-6">
      {/* Tiêu đề góc phải */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600">
          <ShoppingBag size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Đơn hàng đã mua</h2>
          <p className="text-xs text-slate-400 font-medium">Theo dõi lịch sử mua sắm vật phẩm cho thú cưng</p>
        </div>
      </div>

      {/* Thanh Tabs phân loại trạng thái */}
      <div className="flex border-b border-slate-100 overflow-x-auto custom-scrollbar bg-white rounded-2xl p-1.5 shadow-sm">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all flex-1 text-center ${
              activeTab === tab.id
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER NỘI DUNG CHÍNH */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white h-36 rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        
        /* Trạng thái trống chuẩn chỉnh */
        <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4 animate-bounce">
            <Inbox size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">Lịch sử đơn hàng trống</h3>
          <p className="text-sm text-slate-400 font-medium max-w-sm">
            Bạn hiện chưa có đơn hàng nào trong mục "{TABS.find(t => t.id === activeTab)?.label}". Hãy sắm ngay vài món đồ cho bé cưng nhé!
          </p>
        </div>

      ) : (
        
        /* DANH SÁCH ĐƠN HÀNG THỰC TẾ */
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <OrderItem 
              key={order.id} 
              order={order} 
              onCancelOrder={handleCancelOrder} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;