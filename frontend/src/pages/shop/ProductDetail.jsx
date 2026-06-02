// src/pages/shop/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Minus, Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/ui/Badge';
import Loading from '../../components/common/Loading';
import { formatPrice } from '../../utils/formatPrice';
import { useCartStore } from '../../store/cartStore';

// TÍCH HỢP ZUSTAND STORES: Đồng bộ quản lý trạng thái tập trung
import { useProductStore } from '../../store/productStore';
import { useReviewStore } from '../../store/reviewStore';

import ReviewProduct from '../review/ReviewProduct'; 

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // GIỎ HÀNG: Zustand global state & actions
  const { updateQuantity, showToastNotification, items } = useCartStore();

  // SẢN PHẨM: Lấy dữ liệu và trạng thái từ useProductStore
  const { 
    currentProduct: product, 
    detailLoading: productLoading, 
    fetchProductById, 
    clearCurrentProduct 
  } = useProductStore();

  // ĐÁNH GIÁ: Lấy dữ liệu và trạng thái từ useReviewStore
  const { 
    productReviews: reviews, 
    loadingProduct: reviewsLoading, 
    fetchProductReviews, 
    clearReviews 
  } = useReviewStore();

  // Đồng bộ tải thông tin chi tiết sản phẩm và các đánh giá liên quan
  useEffect(() => {
    if (id) {
      fetchProductById(id);
      fetchProductReviews(id);
    }

    // CLEANUP: Xóa dữ liệu cũ trong store khi người dùng unmount/rời khỏi trang này
    return () => {
      clearCurrentProduct();
      clearReviews();
    };
  }, [id, fetchProductById, fetchProductReviews, clearCurrentProduct, clearReviews]);

  // Xử lý logic đưa sản phẩm vào giỏ hàng toàn cục
  const handleAddToCart = () => {
    if (!product) return;
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      useCartStore.setState((state) => ({
        items: [...state.items, { ...product, image: product.thumbnail, quantity: quantity }]
      }));
    }

    showToastNotification?.(`Đã thêm ${quantity} x ${product.name} vào giỏ!`);
  };

  // Trạng thái Loading tổng hợp từ cả hai Store (Ưu tiên hiển thị khi sản phẩm đang tải)
  if (productLoading) return <Loading fullScreen />;
  if (!product) return <div className="pt-32 text-center font-bold">Sản phẩm không tồn tại.</div>;

  return (
    <div className="min-h-screen bg-white pt-10 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        
        <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-pet-blue font-bold mb-8 transition-colors">
          <ArrowLeft size={20} /> Quay lại cửa hàng
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Khối hình ảnh hiển thị */}
          <div className="bg-gray-50 rounded-[40px] p-8 flex items-center justify-center">
            <img src={product.thumbnail || product.image} alt={product.name} className="w-full max-w-md object-contain" />
          </div>

          {/* Khối thông tin chi tiết sản phẩm */}
          <div className="flex flex-col">
            <Badge variant="primary" className="w-fit mb-4">Mã SKU: {product.sku || product.id}</Badge>
            <h1 className="text-4xl font-black text-pet-blue mb-4">{product.name}</h1>
            <p className="text-3xl font-black text-pet-orange mb-6">{formatPrice(product.price)}</p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Bộ chọn số lượng và nút Thêm vào giỏ */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 font-bold select-none">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                className="flex-1 !py-3 !text-lg flex items-center justify-center gap-2 shadow-lg shadow-pet-blue/10"
              >
                <ShoppingCart size={20} /> Thêm vào giỏ
              </Button>
            </div>

            {/* Trạng thái tồn kho */}
            <div className="flex items-center gap-3 text-green-600 font-bold">
              <ShieldCheck size={20} />
              <span>Còn {product.stock_quantity ?? product.stock ?? 0} sản phẩm trong kho</span>
            </div>
          </div>
        </div>

        {/* Khu vực hiển thị danh sách đánh giá của khách hàng */}
        {reviewsLoading ? (
          <div className="text-center py-10 font-medium text-gray-400">Đang tải các đánh giá...</div>
        ) : (
          <ReviewProduct reviews={reviews} />
        )}

      </div>
    </div>
  );
};

export default ProductDetail;