import React from 'react';
import { Star, User } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const ReviewProduct = ({ reviews = [] }) => {
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-black text-pet-blue mb-8">Đánh giá từ khách hàng</h3>
      <div className="grid gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div 
              key={review.id || review._id} 
              className="bg-gray-50 p-6 rounded-3xl border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar mặc định đồng bộ style */}
                  <div className="w-10 h-10 bg-pet-blue/10 rounded-full flex items-center justify-center text-pet-blue">
                    <User size={20} />
                  </div>
                  <div>
                    {/* Tận dụng linh hoạt giữa review.userName hoặc từ object user */}
                    <p className="font-bold text-gray-800">
                      { review.customer?.full_name || "Khách hàng PetSpa"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate( review.created_at)}
                    </p>
                  </div>
                </div>
                {/* Số sao đánh giá dạng màu cam pet-orange đặc trưng */}
                <div className="flex text-pet-orange gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < review.rating ? "currentColor" : "none"} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                "{review.comment || "Sản phẩm rất tốt, dịch vụ chu đáo!"}"
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic bg-gray-50 p-6 rounded-3xl text-center border border-dashed">
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewProduct;