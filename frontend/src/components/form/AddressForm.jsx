import React, { useState } from 'react';
import {Input} from '../common/Input';
import { Button } from '../common/Button';
import addressService from '../../services/AddressService';

// 1. ĐỊNH NGHĨA DỮ LIỆU KHU VỰC HỆ THỐNG HỖ TRỢ (Đồng bộ text hiển thị trực tiếp với Mock)
const LOCATION_DATA = {
  "Hải Phòng": [
    "Ngô Quyền", "Hồng Bàng", "Lê Chân", "Hải An", 
    "Kiến An", "Đồ Sơn", "Dương Kinh", "An Dương", 
    "An Lão", "Thủy Nguyên", "Vĩnh Bảo", "Tiên Lãng"
  ],
  "Hà Nội": [
    "Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Long Biên", 
    "Cầu Giấy", "Đống Đa", "Hai Bà Trưng", "Hoàng Mai", 
    "Thanh Xuân", "Đông Anh", "Gia Lâm", "Nam Từ Liêm", "Bắc Từ Liêm"
  ],
  "Hồ Chí Minh": [
    "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", 
    "Quận 10", "Quận 11", "Quận 12", "Bình Thạnh", "Tân Bình", 
    "Tân Phú", "Gò Vấp", "Phú Nhuận", "Thành phố Thủ Đức", "Bình Chánh"
  ]
};

/**
 * Component Form tạo địa chỉ giao hàng mới (Hỗ trợ chọn Quận/Huyện theo Thành phố)
 */
const AddressForm = ({ onSubmitSuccess, onCancel, userId = 101 }) => {
  const [formData, setFormData] = useState({
    receiverName: '',
    phone: '',
    city: '',        // Lưu Tỉnh/Thành phố
    district: '',    // Lưu Quận/Huyện
    detailAddress: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý thay đổi các ô Input text thông thường
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // XỬ LÝ RIÊNG KHI THAY ĐỔI THÀNH PHỐ
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData(prev => ({
      ...prev,
      city: selectedCity,
      district: '' // 🔥 Reset ngay quận huyện về rỗng khi đổi thành phố
    }));

    if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
    if (errors.district) setErrors(prev => ({ ...prev, district: '' }));
  };

  // Xử lý khi thay đổi Quận/Huyện
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData(prev => ({ ...prev, district: selectedDistrict }));
    if (errors.district) setErrors(prev => ({ ...prev, district: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dữ liệu đầu vào
    const newErrors = {};
    if (!formData.receiverName.trim()) newErrors.receiverName = 'Vui lòng nhập tên người nhận';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})\b$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không đúng định dạng Việt Nam';
    }
    
    if (!formData.city) newErrors.city = 'Vui lòng chọn Tỉnh/Thành phố';
    if (!formData.district) newErrors.district = 'Vui lòng chọn Quận/Huyện';
    if (!formData.detailAddress.trim()) newErrors.detailAddress = 'Vui lòng nhập số nhà, tên đường';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      // ĐỒNG BỘ: Payload gửi lên API bọc chuẩn 100% key snake_case của file mock
      const apiPayload = {
        user_id: Number(userId),
        recipient_name: formData.receiverName.trim(),
        phone_number: formData.phone.trim(),
        province_city: formData.city, // Giữ nguyên map trực tiếp với tên tỉnh/thành của addressMock
        district_ward: formData.district,
        detail_address: formData.detailAddress.trim(),
        address_type: "HOME"
      };

      const response = await addressService.createAddress(apiPayload);
      const savedAddress = response.data; // Lấy object data từ cấu trúc phản hồi của service

      // ĐỒNG BỘ: Trả ngược dữ liệu chuẩn hóa về cho Component cha hiển thị
      if (onSubmitSuccess && response.success) {
        onSubmitSuccess({
          id: savedAddress.id,
          receiverName: savedAddress.recipient_name,
          phone: savedAddress.phone_number,
          detailAddress: savedAddress.detail_address,
          // Chuẩn hóa ghép chuỗi hiển thị gọn gàng: "Ngô Quyền, Hải Phòng"
          city: `${savedAddress.district_ward}, ${savedAddress.province_city}`, 
          isDefault: savedAddress.is_default
        });
      }

    } catch (err) {
      console.error("Lỗi khi thêm địa chỉ:", err);
      alert("Không thể lưu địa chỉ, vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Class style chung theo chuẩn bo tròn nhạt của ảnh thiết kế
  const inputBaseStyle = "w-full !px-5 !py-3.5 bg-[#f8f9fa] border border-transparent rounded-[20px] text-sm font-medium text-gray-800 transition-all placeholder-gray-400 focus:bg-white focus:border-blue-500/50 outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-2 text-left">
      {/* Tên người nhận */}
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-2">Tên người nhận *</label>
        <Input 
          type="text"
          name="receiverName"
          value={formData.receiverName}
          onChange={handleInputChange}
          placeholder="Nhập họ và tên người nhận hàng"
          className={`${inputBaseStyle} ${errors.receiverName ? '!border-red-500 focus:!border-red-500 bg-white' : ''}`}
        />
        {errors.receiverName && <p className="text-xs text-red-500 font-bold mt-1.5 pl-2">{errors.receiverName}</p>}
      </div>
      
      {/* Số điện thoại */}
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-2">Số điện thoại *</label>
        <Input 
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Nhập số điện thoại liên hệ"
          className={`${inputBaseStyle} ${errors.phone ? '!border-red-500 focus:!border-red-500 bg-white' : ''}`}
        />
        {errors.phone && <p className="text-xs text-red-500 font-bold mt-1.5 pl-2">{errors.phone}</p>}
      </div>

      {/* Grid chia đôi hàng: Thành phố & Quận huyện */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dropdown chọn Thành phố */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">Tỉnh / Thành phố *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleCityChange}
            className={`${inputBaseStyle} appearance-none h-[50px] cursor-pointer ${
              errors.city ? '!border-red-500 bg-white' : ''
            }`}
            style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
          >
            <option value="" className="text-gray-400">-- Chọn Thành phố --</option>
            {Object.keys(LOCATION_DATA).map(cityName => (
              <option key={cityName} value={cityName} className="text-gray-800">{cityName}</option>
            ))}
          </select>
          {errors.city && <p className="text-xs text-red-500 font-bold mt-1.5 pl-2">{errors.city}</p>}
        </div>

        {/* Dropdown chọn Quận / Huyện */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">Quận / Huyện *</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleDistrictChange}
            disabled={!formData.city}
            className={`${inputBaseStyle} appearance-none h-[50px] ${
              !formData.city 
                ? 'bg-[#f1f3f5] text-gray-400 cursor-not-allowed' 
                : 'cursor-pointer'
            } ${errors.district ? '!border-red-500 bg-white' : ''}`}
            style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
          >
            <option value="">-- Chọn Quận/Huyện --</option>
            {formData.city && LOCATION_DATA[formData.city].map(districtName => (
              <option key={districtName} value={districtName}>{districtName}</option>
            ))}
          </select>
          {errors.district && <p className="text-xs text-red-500 font-bold mt-1.5 pl-2">{errors.district}</p>}
        </div>
      </div>

      {/* Địa chỉ chi tiết */}
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-2">Địa chỉ chi tiết (Số nhà, tên đường) *</label>
        <Input 
          type="text"
          name="detailAddress"
          value={formData.detailAddress}
          onChange={handleInputChange}
          placeholder="Ví dụ: Số 25 ngõ 102 Lê Lợi..."
          className={`${inputBaseStyle} ${errors.detailAddress ? '!border-red-500 focus:!border-red-500 bg-white' : ''}`}
        />
        {errors.detailAddress && <p className="text-xs text-red-500 font-bold mt-1.5 pl-2">{errors.detailAddress}</p>}
      </div>

      {/* Khối nút bấm */}
      <div className="flex gap-4 justify-end pt-5 mt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-[18px] border-[#1d3557] text-[#1d3557] hover:bg-slate-50 !py-3.5 !px-8 font-bold text-sm min-w-[120px] shadow-sm transition-all"
        >
          Hủy bỏ
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="rounded-[18px] bg-[#1d3557] hover:bg-[#14263f] text-white !py-3.5 !px-8 font-bold text-sm min-w-[140px] shadow-sm transition-all border-none"
        >
          {isSubmitting ? "Đang xử lý..." : "Lưu địa chỉ"}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;