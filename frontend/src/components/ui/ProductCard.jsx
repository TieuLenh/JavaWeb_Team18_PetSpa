import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../common/Button';
import { formatPrice } from '../../utils/formatPrice';
import { useCartStore } from '../../store/cartStore';

const ProductCard = ({ product }) => {
  // Lấy hàm addItem từ store. Hàm này đã tích hợp sẵn showToastNotification bên trong.
  const addItem = useCartStore((state) => state.addItem);

  // 🔥 ĐỒNG BỘ LOGIC: Xử lý an toàn cho Category phòng trường hợp là Object {id, name}
  const displayCategoryName = typeof product.category === 'object' && product.category !== null
    ? product.category.name 
    : (product.categoryName || product.category_name || 'Sản phẩm');

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-4 hover:shadow-xl hover:shadow-pet-blue/5 transition-all group flex flex-col">
      
      {/* Hình ảnh sản phẩm */}
      <Link to={`/shop/product/${product.id}`} className="block relative h-52 mb-4 overflow-hidden rounded-2xl">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      {/* Thông tin sản phẩm */}
      <div className="flex-grow">
        {/* SỬA TẠI ĐÂY: Sử dụng biến đã chuẩn hóa text thay vì render trực tiếp object */}
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
          {displayCategoryName}
        </p>
        
        <Link to={`/shop/product/${product.id}`}>
          <h3 className="font-bold text-gray-800 mb-2 hover:text-pet-blue transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-pet-orange font-black text-lg mb-4">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Nút thêm vào giỏ hàng */}
      <Button 
        onClick={() => addItem(product)} // Click vào đây, sản phẩm tự vào giỏ và Toast tự bật toàn cục
        variant="primary" 
        className="w-full flex items-center justify-center gap-2 rounded-xl"
      >
        <ShoppingCart size={18} /> Thêm vào giỏ
      </Button>
      
    </div>
  );
};

export default ProductCard;