import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
// Sửa đường dẫn import để lấy trực tiếp từ store đã cấu hình 'persist'
import { useCartStore } from '../../store/cartStore';
import { Button } from '../../components/common/Button';
import { formatPrice } from '../../utils/formatPrice';

const Cart = () => {
  // Zustand sẽ tự động quản lý việc đọc/ghi vào localStorage
  const { items, removeItem, updateQuantity } = useCartStore();
  
  // Logic tính toán: Luôn dựa trên state 'items' mới nhất
  const totalPrice = items.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    return sum + (price * item.quantity);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
        <Link to="/shop"><Button>Quay lại cửa hàng</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-15 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black text-pet-blue mb-8">Giỏ hàng của bạn</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt={item.name} />
                <div className="flex-grow">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-pet-orange font-bold">{formatPrice(item.price)}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                    className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                    className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="text-red-400 hover:text-red-600 p-2 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Tổng cộng */}
          <div className="bg-white p-6 rounded-3xl h-fit border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Thanh toán</h3>
            <div className="flex justify-between mb-4">
              <span className="text-gray-500">Tạm tính:</span>
              <span className="font-bold">{formatPrice(totalPrice)}</span>
            </div>
            <Link to="/shop/checkout">
              <Button className="w-full !py-3">Tiến hành đặt hàng</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;