// src/pages/review/CreateProductReview.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import Loading from '../../components/common/Loading';

// TÍCH HỢP ZUSTAND STORES: Quản lý trạng thái và tác vụ tập trung
import { useProductStore } from '../../store/productStore';
import { useReviewStore } from '../../store/reviewStore';

const CreateProductReview = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // SẢN PHẨM: Lấy thông tin sản phẩm cần đánh giá từ productStore
  const { 
    currentProduct: product, 
    detailLoading: productLoading, 
    fetchProductById,
    clearCurrentProduct
  } = useProductStore();

  // ĐÁNH GIÁ: Lấy các trạng thái gửi và action từ reviewStore
  const { 
    submitting, 
    createProductReview 
  } = useReviewStore();
  
  // Local Form States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  // Đồng bộ tải thông tin sản phẩm khi mount component
  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
    
    // CLEANUP: Xóa dữ liệu đệm của sản phẩm khi người dùng rời trang
    return () => {
      clearCurrentProduct();
    };
  }, [productId, fetchProductById, clearCurrentProduct]);

  // Xử lý logic gửi form đánh giá qua Zustand Store
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return setError('Vui lòng viết một vài lời nhận xét về sản phẩm.');
    }

    setError('');
    
    // Gọi action từ reviewStore thay vì gọi trực tiếp apiService
    const result = await createProductReview({
      productId,
      rating,
      comment: comment.trim()
    });
    
    if (result && result.success) {
      // Thành công điều hướng user quay lại trang chi tiết sản phẩm
      navigate(`/shop/product/${productId}`);
    } else {
      // Hiển thị lỗi nếu phản hồi thất bại hoặc dùng thông báo mặc định
      setError(result?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.');
    }
  };

  // Trạng thái Loading khi đang tải dữ liệu sản phẩm lên form
  if (productLoading) return <Loading fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-pet-blue font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <h2 className="text-3xl font-black text-pet-blue mb-2">Viết Đánh Giá Sản Phẩm</h2>
          <p className="text-gray-400 text-sm mb-6">Chia sẻ trải nghiệm thực tế của bạn để giúp các chủ nuôi khác nhé!</p>

          {product ? (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl mb-6 border border-gray-100">
              <img 
                src={product.thumbnail || product.image} 
                alt={product.name} 
                className="w-16 h-16 object-contain bg-white rounded-2xl border p-1" 
              />
              <div>
                <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                <p className="text-xs text-gray-400 mt-1">Mã sản phẩm: {product.sku || product.id}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-semibold">
              Không tìm thấy thông tin sản phẩm cần đánh giá. Bạn vẫn có thể gửi bình luận.
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chọn số sao tương tác */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mức độ hài lòng của bạn *</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-2xl outline-none transition-transform active:scale-95"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={32}
                      className={(hoverRating || rating) >= star ? "text-pet-orange" : "text-gray-200"}
                      fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Nội dung bình luận */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nhận xét chi tiết *</label>
              <textarea
                rows="5"
                className="w-full p-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-pet-blue focus:ring-2 focus:ring-pet-blue/10 resize-none italic text-sm transition-all"
                placeholder="Sản phẩm dùng như thế nào, bé cưng của bạn có thích không? Đóng gói và giao hàng có nhanh không?..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full !py-3.5 font-bold rounded-2xl text-lg">
              {submitting ? 'Đang gửi đánh giá...' : 'Gửi đánh giá sản phẩm'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductReview;