// src/pages/review/CreateServiceReview.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import Loading from '../../components/common/Loading';

// TÍCH HỢP ZUSTAND STORES: Quản lý trạng thái dịch vụ và đánh giá tập trung
import { useServiceStore } from '../../store/serviceStore';
import { useReviewStore } from '../../store/reviewStore';

const CreateServiceReview = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  // DỊCH VỤ SPA: Lấy thông tin dịch vụ cần đánh giá từ serviceStore
  const {
    currentService: service,
    loading: serviceLoading,
    fetchServiceById
  } = useServiceStore();

  // ĐÁNH GIÁ: Lấy các trạng thái gửi và action từ reviewStore
  const {
    submitting,
    createServiceReview
  } = useReviewStore();
  
  // Local Form States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  // Đồng bộ tải thông tin dịch vụ khi mount component
  useEffect(() => {
    if (serviceId) {
      fetchServiceById(serviceId);
    }
  }, [serviceId, fetchServiceById]);

  // Xử lý logic gửi form đánh giá dịch vụ qua Zustand Store
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return setError('Vui lòng để lại ý kiến đóng góp về dịch vụ.');
    }

    setError('');
    
    // Gọi action từ reviewStore thay vì gọi dịch vụ thô trực tiếp tại UI
    const result = await createServiceReview({
      serviceId,
      rating,
      comment: comment.trim()
    });
    
    if (result && result.success) {
      // Thành công điều hướng user quay lại trang chi tiết dịch vụ
      navigate(`/spa/service/${serviceId}`);
    } else {
      // Hiển thị thông báo lỗi từ hệ thống nếu có
      setError(result?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.');
    }
  };

  // Trạng thái Loading khi đang tải dữ liệu dịch vụ lên form
  if (serviceLoading) return <Loading fullScreen />;

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
          <h2 className="text-3xl font-black text-pet-blue mb-2">Đánh Giá Dịch Vụ Spa</h2>
          <p className="text-gray-400 text-sm mb-6">Ý kiến của bạn giúp nâng cao chất lượng chăm sóc các bé cưng tốt hơn!</p>

          {service ? (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl mb-6 border border-gray-100">
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-16 h-16 object-cover bg-white rounded-2xl border p-0.5" 
              />
              <div>
                <h4 className="font-bold text-gray-800 line-clamp-1">{service.name}</h4>
                <p className="text-xs text-pet-orange font-bold mt-1">Thời gian: {service.duration} phút</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-semibold">
              Không thể tìm thấy thông tin gói dịch vụ này. Bạn vẫn có thể tiếp tục gửi ý kiến đóng góp.
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chọn số sao */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Bạn chấm mấy sao cho tay nghề tư vấn và phục vụ? *</label>
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
              <label className="block text-sm font-bold text-gray-700 mb-2">Cảm nhận thực tế của bạn *</label>
              <textarea
                rows="5"
                className="w-full p-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-pet-blue focus:ring-2 focus:ring-pet-blue/10 resize-none italic text-sm transition-all"
                placeholder="Nhân viên cắt tỉa/tắm sấy có nhẹ nhàng với bé không? Cơ sở vật chất của tiệm có sạch sẽ không?..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full !py-3.5 font-bold rounded-2xl text-lg">
              {submitting ? 'Đang gửi đánh giá...' : 'Gửi đánh giá dịch vụ'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateServiceReview;