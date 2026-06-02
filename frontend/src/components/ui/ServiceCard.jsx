import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { formatPrice } from '../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service, onBookingClick }) => {
  const navigate = useNavigate();

  const handleBooking = () => {
    if (typeof onBookingClick === 'function') {
      return onBookingClick();
    }
    navigate(`/spa/booking/create?serviceId=${service.id}`);
  };

  // 🔥 ĐỒNG BỘ LOGIC AN TOÀN: Kiểm tra nếu category là Object thì trỏ tới thuộc tính name, ngược lại dùng chuỗi hoặc fallback mặc định
  const displayCategoryName = service.category && typeof service.category === 'object'
    ? (service.category.name || service.category.title)
    : (service.category || service.serviceCategoryName || 'Dịch vụ Spa');

  return (
    <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden h-64">
        <img
          src={service.image || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800'}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        {/* SỬA TẠI ĐÂY: Render chuỗi chữ an toàn */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-2xl rounded-full px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          {displayCategoryName}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-xs uppercase tracking-[0.18em] font-bold text-pet-orange">
            {service.duration_minutes} phút
          </div>
          <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
            <Star size={16} />
            {service.rating?.toFixed?.(1) || '4.9'}
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 leading-tight mb-3">{service.name}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3">
          {service.description || 'Dịch vụ chăm sóc thú cưng chuyên nghiệp, chuẩn an toàn và yêu thương.'}
        </p>

        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="text-2xl font-black text-pet-orange">
            {formatPrice(service.price)}
          </span>
          {/* SỬA TẠI ĐÂY: Render chuỗi chữ an toàn */}
          <span className="text-sm text-gray-500">{displayCategoryName}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
  className="w-full"
  onClick={() => {
    console.log(service.id);
    navigate(`/spa/service/${service.id}`);
  }}
  variant="outline"
>
  Chi tiết
</Button>
          <Button
            className="w-full"
            onClick={handleBooking}
          >
            Đặt lịch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;