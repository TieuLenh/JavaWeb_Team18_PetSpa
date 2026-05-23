// src/pages/spa/ServiceDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, Clock, Tag, ShieldAlert, CheckCircle2, Heart, 
  ArrowLeft, ShoppingBag, MessageSquare, CalendarCheck, User2
} from 'lucide-react';

// Import Zustand Stores thay thế hoàn toàn việc gọi API trực tiếp tại Component
import { useServiceStore } from '../../store/serviceStore';
import { useReviewStore } from '../../store/reviewStore';

// Import UI Components & Utils
import { Button } from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { formatPrice } from '../../utils/formatPrice';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Local state duy nhất giữ nhiệm vụ chuyển đổi ảnh active trong bộ sưu tập (UI state)
  const [activeImage, setActiveImage] = useState('');

  // ─── ZUSTAND STORE STATES & ACTIONS ────────────────────────────────────────
  // Giả định useServiceStore của bạn có cấu trúc tương tự quản lý dữ liệu chi tiết dịch vụ
  const { currentService, loadingServiceDetail, fetchServiceById, clearCurrentService } = useServiceStore();
  // Khớp chính xác với serviceReviews và loadingService từ reviewStore vừa viết
  const { serviceReviews, loadingService, fetchServiceReviews, clearReviews } = useReviewStore();

  // Đồng bộ hóa dữ liệu từ cả 2 store khi component mount hoặc ID thay đổi
  useEffect(() => {
    if (id) {
      fetchServiceById(id)
      fetchServiceReviews(id);
    }
    // Cleanup function: Giải phóng bộ nhớ tạm thời của các store khi người dùng rời trang
    return () => {
      if (clearCurrentService) clearCurrentService();
      clearReviews();
    };
  }, [id, fetchServiceById, fetchServiceReviews, clearCurrentService, clearReviews]);

  // Cập nhật ảnh active ngay khi dữ liệu dịch vụ hiện tại được tải về thành công
  useEffect(() => {
    if (currentService?.thumbnail) {
      setActiveImage(currentService.thumbnail);
    }
  }, [currentService]);

  // Điều hướng sang trang tạo lịch hẹn kèm ID dịch vụ này
  const handleBookingRedirect = () => {
    if (currentService?.id) {
      navigate(`/spa/booking/create?serviceId=${currentService.id}`);
    }
  };

  // Trạng thái loading tổng hợp từ cả hai Store bất đồng bộ
  const isLoadingTotal = loadingServiceDetail || loadingService;

  if (isLoadingTotal) return <Loading fullScreen />;
  
  if (!currentService) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20 text-center">
        <p className="text-gray-500 font-medium mb-4">Không tìm thấy thông tin dịch vụ yêu cầu.</p>
        <Button onClick={() => navigate('/services')}>Xem tất cả dịch vụ</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-10 pb-20 text-left">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Nút quay lại điều hướng mượt mà */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-pet-blue mb-6 font-bold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} className="mr-2" /> Quay lại trang trước
        </button>

        {/* Khung chính: Chia 2 cột chính Hình ảnh & Thông tin đặt đơn */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
          
          {/* CỘT TRÁI: KHU VỰC HÌNH ẢNH */}
          <div className="md:col-span-5 space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
              <img 
                src={activeImage} 
                alt={currentService.name} 
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            
            {/* Danh sách ảnh con sưu tập */}
            {currentService.images && currentService.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                <div 
                  onClick={() => setActiveImage(currentService.thumbnail)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    activeImage === currentService.thumbnail ? 'border-pet-blue scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={currentService.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
                {currentService.images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      activeImage === img ? 'border-pet-blue scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`sub-img-${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: KHU VỰC THÔNG TIN DỊCH VỤ & GIÁ CẢ */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-50 text-pet-blue rounded-xl text-xs font-bold uppercase tracking-wider">
                {currentService.category?.name}
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight">
                {currentService.name}
              </h1>

              {/* Chỉ số Ratings & Số lượt phục vụ */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-gray-800 font-bold">{currentService.average_rating}</span>
                  <span className="text-gray-400">({currentService.review_count} đánh giá)</span>
                </div>
                <div className="h-4 w-px bg-gray-200 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <ShoppingBag size={15} className="text-gray-400" />
                  <span>Đã phục vụ <strong className="text-gray-700">{currentService.booking_count}+</strong> lượt đặt</span>
                </div>
              </div>

              {/* KHỐI GIÁ TIỀN ƯU ĐÃI */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                <span className="text-3xl font-black text-pet-orange">
                  {formatPrice(currentService.final_price)}
                </span>
                {currentService.discount_percent > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 line-through font-medium">
                      {formatPrice(currentService.original_price)}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-500 rounded-lg font-bold flex items-center gap-0.5">
                      <Tag size={12} /> Giảm {currentService.discount_percent}%
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {currentService.description}
              </p>

              {/* Thời gian thực hiện & Đối tượng vật nuôi */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-gray-700 bg-gray-50/60 p-3 rounded-xl border border-gray-100">
                  <Clock size={18} className="text-pet-blue" />
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Thời gian ước tính</p>
                    <p className="font-bold text-gray-800">{currentService.duration_minutes} phút</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700 bg-gray-50/60 p-3 rounded-xl border border-gray-100">
                  <Heart size={18} className="text-red-400 fill-red-100" />
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Thích hợp cho</p>
                    <p className="font-bold text-gray-800">
                      {currentService.suitable_for?.map(item => item === 'Dog' ? 'Chó' : 'Mèo').join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nút đặt lịch chính */}
            <div className="pt-4 border-t border-gray-100">
              <Button 
                onClick={handleBookingRedirect}
                className="w-full !py-4 text-base font-bold rounded-2xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                <CalendarCheck size={18} /> ĐẶT LỊCH HẸN NGAY
              </Button>
            </div>
          </div>
        </div>

        {/* BỐ CỤC PHẦN DƯỚI: CHI TIẾT GÓI DỊCH VỤ & REVIEWS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI (8/12): Gói dịch vụ & Đánh giá từ khách hàng thực tế */}
          <div className="md:col-span-8 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-base font-black text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-50">
                <CheckCircle2 size={18} className="text-green-500" /> Các bước chăm sóc đi kèm trong gói
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentService.included_services?.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50/50 rounded-xl border border-gray-100 text-sm text-gray-700 font-bold">
                    <span className="w-5 h-5 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-xs font-black">
                      {idx + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* KHỐI ĐÁNH GIÁ ĐỒNG BỘ TỪ REVIEWSTORE */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-base font-black text-gray-800 flex items-center gap-2 border-b pb-3 border-gray-50">
                <MessageSquare size={18} className="text-pet-blue" /> Đánh giá từ chủ nuôi ({serviceReviews.length})
              </h2>

              {serviceReviews.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-4">Chưa có đánh giá nào cho gói dịch vụ này.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {serviceReviews.map((review) => (
                    <div key={review.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img 
                            src={review.customer?.avatar} 
                            alt={review.customer?.full_name} 
                            className="w-9 h-9 rounded-full object-cover bg-gray-100 border border-gray-100"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-gray-800">{review.customer?.full_name}</h4>
                            <p className="text-[11px] text-gray-400 font-medium">
                              {new Date(review.created_at).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 font-medium bg-gray-50/50 p-3 rounded-xl border border-gray-50/50">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI (4/12): Groomers & Lưu ý hệ thống */}
          <div className="md:col-span-4 space-y-6">
            {currentService.groomers && currentService.groomers.length > 0 && (
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3.5">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-2.5 border-gray-50">
                  <User2 size={16} className="text-pet-blue" /> Chuyên viên hỗ trợ gói
                </h3>
                <div className="space-y-2">
                  {currentService.groomers.map((groomer) => (
                    <div key={groomer.id} className="flex items-center gap-2 p-2.5 bg-blue-50/40 rounded-xl border border-blue-100/30 text-xs text-blue-700 font-bold">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      {groomer.full_name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentService.notes && currentService.notes.length > 0 && (
              <div className="bg-amber-50/50 p-5 rounded-3xl border border-amber-100/70 space-y-3">
                <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-amber-600" /> Lưu ý quan trọng
                </h3>
                <ul className="space-y-2">
                  {currentService.notes.map((note, idx) => (
                    <li key={idx} className="text-xs text-amber-700 leading-relaxed font-medium list-disc pl-4 ml-1">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;