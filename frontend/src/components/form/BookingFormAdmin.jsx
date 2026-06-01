import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  X,
  Scissors,
  Notebook,
  User,
  UserPlus,
  Search,
  CheckCircle2
} from 'lucide-react';
import BookingService from '../../services/bookingService';
import validateBookingForm from '../../utils/bookingValidator';
 
import { useServiceStore } from '../../store/serviceStore';
import { useUserStore }    from '../../store/userStore';
import { useStaffStore }   from '../../store/staffStore';
import { usePetStore }     from '../../store/petStore';
 
const BookingFormAdmin = ({ initialData, onSubmit, onClose }) => {
  // ─── STORE DATA ──────────────────────────────────────────────────────────────
  const { services, fetchServices }           = useServiceStore();
  const { users: customers, fetchUsers }      = useUserStore();
  const { staffs: groomers, fetchStaffs }     = useStaffStore();
  const {
    pets,
    fetchPetsByUser,
    loading: loadingPets,
  } = usePetStore();
 
  // ─── LOCAL UI STATE ──────────────────────────────────────────────────────────
  const [slots, setSlots]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formErrors, setFormErrors] = useState({});
 
  // Kiểm tra trạng thái dữ liệu ban đầu
  const isEditMode        = !!initialData;
  const isEditWalkIn      = isEditMode && !initialData?.customer?.id && initialData?.customer?.full_name;
  const isEditRegistered  = isEditMode && !!initialData?.customer?.id;
 
  const [isWalkIn, setIsWalkIn] = useState(isEditWalkIn || false);
 
  // Tra cứu SĐT
  const [searchPhone,     setSearchPhone]     = useState(initialData?.customer?.phone || '');
  const [matchedCustomer, setMatchedCustomer] = useState(null);
  const [searchError,     setSearchError]     = useState('');
 
  // Form data
  const [formData, setFormData] = useState({
    customerId:     initialData?.customer?.id    || '',
    walkInName:     isEditWalkIn ? initialData?.customer?.full_name : '',
    walkInPhone:    isEditWalkIn ? initialData?.customer?.phone     : '',
    petId:          initialData?.pet?.id         || '',
    walkInPetName:  (isEditWalkIn || !initialData?.pet?.id) ? (initialData?.pet?.name  || '') : '',
    walkInPetBreed: (isEditWalkIn || !initialData?.pet?.id) ? (initialData?.pet?.breed || '') : '',
    groomerId:      initialData?.groomer?.id     || '',
    date:           initialData?.booking_date    || '',
    time:           initialData?.start_time      || '',
    note:           initialData?.note            || '',
    serviceIds:     initialData?.services?.map(s => s.id.toString()) || [],
  });
 
  // ─── TÍNH TOÁN GIÁ TRỊ PHÁT SINH ────────────────────────────────────────────
  const selectedServices = useMemo(
    () => services.filter(s => formData.serviceIds.includes(s.id.toString())),
    [services, formData.serviceIds]
  );
 
  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 30,
    [selectedServices]
  );
 
  const totalAmount = useMemo(
    () => selectedServices.reduce((sum, s) => sum + (s.price || 0), 0),
    [selectedServices]
  );
 
  const slotsNeeded = Math.ceil(totalDuration / 30);
 
  // ─── FETCH METADATA BAN ĐẦU TỪ STORES ──────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchServices(), fetchUsers(), fetchStaffs()]);
      setLoading(false);
    };
    init();
  }, [fetchServices, fetchUsers, fetchStaffs]);
 
  // Khôi phục matchedCustomer khi ở chế độ sửa khách có tài khoản
  useEffect(() => {
    if (isEditRegistered && initialData?.customer?.id && customers.length > 0) {
      const found = customers.find(
        c => c.id.toString() === initialData.customer.id.toString()
      );
      if (found) setMatchedCustomer(found);
    }
  }, [isEditRegistered, initialData, customers]);
 
  // ─── TRA CỨU KHÁCH HÀNG QUA SĐT ─────────────────────────────────────────────
  const handleSearchCustomer = () => {
    setSearchError('');
    if (!searchPhone.trim()) {
      setSearchError('Vui lòng nhập số điện thoại để tra cứu.');
      return;
    }
    const found = customers.find(c => c.phone === searchPhone.trim());
    if (found) {
      setMatchedCustomer(found);
      setFormData(prev => ({ ...prev, customerId: found.id, petId: '' }));
    } else {
      setMatchedCustomer(null);
      setFormData(prev => ({ ...prev, customerId: '', petId: '' }));
      setSearchError('Không tìm thấy khách hàng nào khớp với số điện thoại này.');
    }
  };
 
  // ─── TỰ ĐỘNG LỌC PET THEO KHÁCH HÀNG ────────────────────────────────────────
  useEffect(() => {
    if (isWalkIn || !formData.customerId) return;
 
    // Reset petId nếu khách hàng thay đổi so với dữ liệu gốc
    if (!initialData || formData.customerId.toString() !== initialData?.customer?.id?.toString()) {
      setFormData(prev => ({ ...prev, petId: '' }));
    }
 
    fetchPetsByUser(formData.customerId);
  }, [formData.customerId, isWalkIn, initialData, fetchPetsByUser]);
 
  // ─── FETCH SLOTS THEO NGÀY VÀ THỢ ───────────────────────────────────────────
  useEffect(() => {
    if (!formData.date || !formData.groomerId) {
      setSlots([]);
      return;
    }
 
    let isCancelled = false;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await BookingService.getAvailableSlots(formData.date, formData.groomerId);
        if (!isCancelled) setSlots(res?.success ? res.data || [] : []);
      } catch (err) {
        if (!isCancelled) {
          console.error('Lỗi lấy danh sách khung giờ trống:', err);
          setSlots([]);
        }
      } finally {
        if (!isCancelled) setLoadingSlots(false);
      }
    };
 
    fetchSlots();
    return () => { isCancelled = true; };
  }, [formData.date, formData.groomerId]);
 
  // ─── THUẬT TOÁN KIỂM TRA N SLOT LIÊN TIẾP ───────────────────────────────────
  const checkConsecutiveSlots = useCallback((startIndex) => {
    if (startIndex < 0 || startIndex >= slots.length)
      return { available: false, reason: 'INVALID_INDEX' };
 
    for (let i = 0; i < slotsNeeded; i++) {
      const slot = slots[startIndex + i];
      if (!slot) return { available: false, reason: 'OVER_WORKING_HOURS' };
 
      const isOwnCurrentSlot =
        initialData &&
        formData.date === initialData.booking_date &&
        formData.groomerId.toString() === initialData.groomer?.id?.toString() &&
        slot.start_time === initialData.start_time;
 
      if (!slot.available && !isOwnCurrentSlot) {
        return {
          available: false,
          reason: i === 0 ? slot.reason : 'INSUFFICIENT_CONSECUTIVE_SLOTS',
        };
      }
    }
    return { available: true };
  }, [slots, slotsNeeded, initialData, formData.date, formData.groomerId]);
 
  const selectedStartIndex = useMemo(
    () => formData.time ? slots.findIndex(s => s.start_time === formData.time) : -1,
    [formData.time, slots]
  );
 
  useEffect(() => {
    if (selectedStartIndex !== -1) {
      const evaluation = checkConsecutiveSlots(selectedStartIndex);
      if (!evaluation.available) setFormData(prev => ({ ...prev, time: '' }));
    }
  }, [slotsNeeded, slots, selectedStartIndex, checkConsecutiveSlots]);
 
  // ─── HANDLERS ────────────────────────────────────────────────────────────────
  const handleServiceToggle = (serviceIdStr) => {
    setFormData(prev => {
      const isExist = prev.serviceIds.includes(serviceIdStr);
      const updatedIds = isExist
        ? prev.serviceIds.filter(id => id !== serviceIdStr)
        : [...prev.serviceIds, serviceIdStr];
      return { ...prev, serviceIds: updatedIds };
    });
  };
 
  const handleSelectSlot = (slot, index) => {
    const evaluation = checkConsecutiveSlots(index);
    if (!evaluation.available) return;
    setFormData(prev => ({ ...prev, time: slot.start_time }));
  };
 
  // ─── SUBMIT VỚI VALIDATE ─────────────────────────────────────────────────────
  const handleFormSubmit = (e) => {
    e.preventDefault();
 
    // Chuẩn bị payload tương thích với validateBookingForm
    const validationPayload = {
      serviceIds: formData.serviceIds,
      groomerId:  formData.groomerId,
      date:       formData.date,
      time:       formData.time,
      // Walk-in fields
      walkInName:  formData.walkInName,
      walkInPhone: formData.walkInPhone,
      // Registered fields
      customerId: formData.customerId,
      petId:      formData.petId,
    };
 
    const errors = validateBookingForm(validationPayload, {
      isWalkIn,
      requireGroomer: true,
    });
 
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
 
    setFormErrors({});
 
    // Xây dựng output payload gửi lên
    let customerPayload = {};
    let petPayload      = {};
 
    if (isWalkIn) {
      customerPayload = {
        id:        null,
        full_name: formData.walkInName.trim(),
        phone:     formData.walkInPhone.trim(),
      };
      petPayload = {
        id:    null,
        name:  formData.walkInPetName.trim()  || 'Chưa rõ tên',
        breed: formData.walkInPetBreed.trim() || 'N/A',
      };
    } else {
      const targetPet = pets.find(p => p.id.toString() === formData.petId.toString());
      customerPayload = {
        id:        matchedCustomer?.id,
        full_name: matchedCustomer?.full_name || '',
        phone:     matchedCustomer?.phone     || '',
      };
      petPayload = {
        id:    formData.petId,
        name:  targetPet?.name  || 'Chưa rõ',
        breed: targetPet?.breed || 'N/A',
      };
    }
 
    const targetGroomer = groomers.find(g => g.id.toString() === formData.groomerId.toString());
 
    onSubmit({
      customer: customerPayload,
      pet:      petPayload,
      groomer: {
        id:        formData.groomerId,
        full_name: targetGroomer?.full_name || 'Chưa phân phối',
      },
      services:         selectedServices.map(s => ({ id: s.id, name: s.name })),
      booking_date:     formData.date,
      start_time:       formData.time,
      end_time:         slots[selectedStartIndex + slotsNeeded - 1]?.end_time || formData.time,
      duration_minutes: totalDuration,
      total_amount:     totalAmount,
      note:             formData.note,
      status:           initialData?.status || 'PENDING',
    });
  };
 
  // ─── BADGE LÝ DO SLOT ────────────────────────────────────────────────────────
  const getReasonBadge = (reason) => {
    switch (reason) {
      case 'BOOKED':                         return { label: 'Kín lịch',     color: 'bg-red-100 text-red-500' };
      case 'GROOMER_BUSY':                   return { label: 'Thợ bận',      color: 'bg-orange-100 text-orange-500' };
      case 'OUTSIDE_SHIFT':                  return { label: 'Hết ca thợ',   color: 'bg-purple-100 text-purple-500' };
      case 'OUTSIDE_WORKING_HOURS':          return { label: 'Ngoài giờ',    color: 'bg-gray-200 text-gray-500' };
      case 'OVER_WORKING_HOURS':             return { label: 'Cuối ca',      color: 'bg-gray-200 text-gray-500' };
      case 'INSUFFICIENT_CONSECUTIVE_SLOTS': return { label: 'Thiếu ô tiếp', color: 'bg-amber-100 text-amber-600' };
      default:                               return { label: 'Hết chỗ',      color: 'bg-gray-200 text-gray-500' };
    }
  };
 
  // ─── LOADING TOÀN TRANG ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="py-12 text-center text-sm font-semibold text-gray-500 animate-pulse">
        Đang tải cấu hình biểu mẫu toàn hệ thống...
      </div>
    );
  }
 
  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-6 text-left max-h-[75vh] overflow-y-auto pr-2"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* 1. CHỌN DỊCH VỤ */}
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
          1. Dịch vụ chăm sóc <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {services.map(s => {
            const isChecked = formData.serviceIds.includes(s.id.toString());
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleServiceToggle(s.id.toString())}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isChecked
                    ? 'bg-orange-50 border-orange-400 text-orange-600 shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {isChecked ? <X size={12} /> : <Plus size={12} />}
                {s.name} ({s.duration_minutes}p)
              </button>
            );
          })}
        </div>
 
        {selectedServices.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 flex justify-between items-center font-medium">
            <span>Đã chọn: {selectedServices.length} dịch vụ</span>
            <span>Tổng thời gian: <strong className="text-orange-500 font-bold">{totalDuration} phút</strong></span>
          </div>
        )}
 
        {formErrors.serviceIds && (
          <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {formErrors.serviceIds}
          </p>
        )}
      </div>
 
      {/* 2. PHÂN LOẠI KHÁCH HÀNG (TABS) */}
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
          2. Loại hình khách hàng <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            disabled={isEditWalkIn}
            onClick={() => setIsWalkIn(false)}
            className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              !isWalkIn
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 disabled:opacity-40'
            }`}
          >
            <User size={14} /> Khách có tài khoản
          </button>
          <button
            type="button"
            disabled={isEditRegistered}
            onClick={() => setIsWalkIn(true)}
            className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isWalkIn
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 disabled:opacity-40'
            }`}
          >
            <UserPlus size={14} /> Khách vãng lai
          </button>
        </div>
      </div>
 
      {/* CHI TIẾT KHÁCH HÀNG */}
      {!isWalkIn ? (
        /* KHÁCH CÓ TÀI KHOẢN */
        <div className="space-y-4 bg-orange-50/30 p-4 rounded-2xl border border-orange-100/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Tra cứu Số điện thoại khách <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập chính xác SĐT..."
                  disabled={isEditRegistered}
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="w-full p-2.5 pr-10 rounded-xl border border-gray-200 outline-none text-sm text-gray-700 focus:border-orange-500 disabled:bg-gray-100"
                />
                {!isEditRegistered && (
                  <button
                    type="button"
                    onClick={handleSearchCustomer}
                    className="absolute right-1.5 top-1.5 p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
                  >
                    <Search size={14} />
                  </button>
                )}
              </div>
            </div>
 
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Kết quả tìm kiếm
              </label>
              {matchedCustomer ? (
                <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <div>
                    <p>{matchedCustomer.full_name}</p>
                    <p className="font-medium text-gray-400 text-[10px]">{matchedCustomer.email || 'Hội viên Spa'}</p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-gray-100 text-gray-400 border border-dashed rounded-xl text-xs font-medium text-center">
                  Chưa có dữ liệu tra cứu
                </div>
              )}
            </div>
          </div>
 
          {searchError && (
            <p className="text-xs font-semibold text-red-500 mt-1">{searchError}</p>
          )}
 
          {/* LỖI VALIDATE customerId */}
          {formErrors.customerId && (
            <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
              <AlertCircle size={12} /> {formErrors.customerId}
            </p>
          )}
 
          {/* CHỌN THÚ CƯNG */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Chọn Thú cưng tương ứng <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full p-2.5 rounded-xl border outline-none bg-white font-medium text-sm text-gray-700 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                formErrors.petId ? 'border-red-400' : 'border-gray-200'
              }`}
              value={formData.petId}
              onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
              disabled={!formData.customerId || loadingPets}
            >
              {!formData.customerId ? (
                <option value="">-- Vui lòng tra cứu số điện thoại trước --</option>
              ) : loadingPets ? (
                <option value="">Đang tải danh sách pet của khách...</option>
              ) : pets.length === 0 ? (
                <option value="">Tài khoản khách này chưa đăng ký Pet nào</option>
              ) : (
                <>
                  <option value="">-- Chọn thú cưng nhận dịch vụ --</option>
                  {pets.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>
                  ))}
                </>
              )}
            </select>
            {formErrors.petId && (
              <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {formErrors.petId}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* KHÁCH VÃNG LAI */
        <div className="space-y-4 bg-blue-50/20 p-4 rounded-2xl border border-blue-100/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Tên khách hàng vãng lai <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập họ tên khách..."
                value={formData.walkInName}
                onChange={(e) => setFormData({ ...formData, walkInName: e.target.value })}
                className={`w-full p-2.5 rounded-xl border outline-none text-sm text-gray-700 focus:border-orange-500 ${
                  formErrors.customerName ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {formErrors.customerName && (
                <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {formErrors.customerName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập số điện thoại..."
                value={formData.walkInPhone}
                onChange={(e) => setFormData({ ...formData, walkInPhone: e.target.value })}
                className={`w-full p-2.5 rounded-xl border outline-none text-sm text-gray-700 focus:border-orange-500 ${
                  formErrors.customerPhone ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {formErrors.customerPhone && (
                <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {formErrors.customerPhone}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Tên thú cưng (Tùy chọn)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Cún, Miu..."
                value={formData.walkInPetName}
                onChange={(e) => setFormData({ ...formData, walkInPetName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none text-sm text-gray-700 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Giống loài (Tùy chọn)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Poodle, Mèo Anh..."
                value={formData.walkInPetBreed}
                onChange={(e) => setFormData({ ...formData, walkInPetBreed: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none text-sm text-gray-700 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      )}
 
      {/* 3. NHÂN VIÊN & NGÀY HẸN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Scissors size={14} /> 3. Chọn Stylist / Groomer thực hiện <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full p-3 rounded-xl border outline-none bg-white font-medium text-sm text-gray-700 focus:border-orange-500 ${
              formErrors.groomerId ? 'border-red-400' : 'border-gray-200'
            }`}
            value={formData.groomerId}
            onChange={(e) => setFormData({ ...formData, groomerId: e.target.value })}
          >
            <option value="">-- Chỉ định nhân viên --</option>
            {groomers.map(g => (
              <option key={g.id} value={g.id}>{g.full_name}</option>
            ))}
          </select>
          {formErrors.groomerId && (
            <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {formErrors.groomerId}
            </p>
          )}
        </div>
 
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Calendar size={14} /> 4. Chọn ngày đặt lịch <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={`w-full p-3 rounded-xl border outline-none bg-white font-medium text-sm text-gray-700 focus:border-orange-500 ${
              formErrors.date ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {formErrors.date && (
            <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {formErrors.date}
            </p>
          )}
        </div>
      </div>
 
      {/* 4. KHUNG GIỜ */}
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Clock size={14} /> 5. Trạng thái ca trống của Stylist <span className="text-red-500">*</span>
        </label>
 
        {(!formData.date || !formData.groomerId) ? (
          <div className="p-4 bg-gray-50 text-gray-400 rounded-xl border border-dashed border-gray-200 text-center text-xs flex items-center justify-center gap-1.5">
            <AlertCircle size={14} /> Vui lòng điền đủ <strong>Nhân viên</strong> và <strong>Ngày đặt lịch</strong> để hiển thị ca trống.
          </div>
        ) : formData.serviceIds.length === 0 ? (
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl border border-dashed border-amber-200 text-center text-xs font-bold">
            Vui lòng chọn dịch vụ ở mục 1 để tính toán thời lượng giữ ô!
          </div>
        ) : loadingSlots ? (
          <div className="grid grid-cols-2 gap-2 animate-pulse">
            {[1, 2, 3, 4].map(n => <div key={n} className="h-14 bg-gray-100 rounded-xl" />)}
          </div>
        ) : slots.length === 0 ? (
          <div className="p-4 bg-red-50 text-red-500 rounded-xl border border-red-100 text-center text-xs font-bold">
            Nhân viên này không có ca làm việc hoặc đã kín lịch vào ngày này!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 bg-gray-50 rounded-xl border">
            {slots.map((slot, index) => {
              const evaluation        = checkConsecutiveSlots(index);
              const isAvailable       = evaluation.available;
              const reason            = isAvailable ? null : (evaluation.reason || slot.reason);
              const isInSelectedBlock =
                selectedStartIndex >= 0 &&
                index >= selectedStartIndex &&
                index < selectedStartIndex + slotsNeeded;
              const isActualStart = formData.time === slot.start_time;
              const badge         = reason ? getReasonBadge(reason) : null;
 
              return (
                <button
                  key={index}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => handleSelectSlot(slot, index)}
                  className={`p-2 rounded-xl border text-left relative transition-all flex flex-col justify-between h-14 ${
                    isInSelectedBlock
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm font-bold scale-[1.01]'
                      : !isAvailable
                      ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white hover:bg-orange-50/40 border-gray-200 text-gray-700 hover:border-orange-300 cursor-pointer font-semibold'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs tracking-wide font-bold">
                      {slot.start_time} – {slot.end_time}
                    </span>
                    {!isAvailable && badge && (
                      <span className={`text-[8px] px-1 py-0.5 rounded font-bold uppercase tracking-wider ${badge.color}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] block font-medium truncate ${
                    isInSelectedBlock ? 'text-orange-100' : 'text-gray-400'
                  }`}>
                    {isInSelectedBlock
                      ? (isActualStart ? `Bắt đầu (${totalDuration}p)` : 'Chuỗi giữ chỗ')
                      : isAvailable
                      ? 'Đủ điều kiện chọn'
                      : reason === 'INSUFFICIENT_CONSECUTIVE_SLOTS'
                      ? 'Thiếu ô liền kề'
                      : 'Không thể chọn'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
 
        {formErrors.time && (
          <p className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {formErrors.time}
          </p>
        )}
      </div>
 
      {/* GHI CHÚ */}
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Notebook size={14} /> Ghi chú lịch hẹn
        </label>
        <textarea
          rows="2"
          placeholder="Yêu cầu đặc biệt về sức khỏe hoặc hành vi của bé..."
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-gray-700"
        />
      </div>
 
      {/* TỔNG TIỀN */}
      {totalAmount > 0 && (
        <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-600">Doanh thu dự kiến:</span>
          <strong className="text-lg font-black text-orange-600">
            {totalAmount.toLocaleString('vi-VN')} đ
          </strong>
        </div>
      )}
 
      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-200 text-gray-500 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={!formData.time}
          className="px-5 py-2 bg-orange-500 text-white text-sm font-black rounded-xl hover:bg-opacity-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
        >
          Xác nhận lịch đặt
        </button>
      </div>
    </form>
  );
};
 
export default BookingFormAdmin;