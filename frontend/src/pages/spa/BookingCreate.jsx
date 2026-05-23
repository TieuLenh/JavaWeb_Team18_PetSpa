import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { CalendarClock, CheckCircle, AlertCircle } from "lucide-react";
import Modal from "../../components/common/Modal";
import { Button } from "../../components/common/Button";
import PaymentModal from "../../components/common/PaymentModal";

// Zustand Stores
import { useAuthStore } from "../../store/authStore";
import { useServiceStore } from "../../store/serviceStore";
import { usePetStore } from "../../store/petStore";
import { useBookingStore } from "../../store/bookingStore";

// Components
import BookingForm from "../../components/form/BookingForm";

const BookingCreate = () => {
  const navigate = useNavigate();
  const { id: serviceIdFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const initialServiceId = (serviceIdFromParams || searchParams.get("serviceId") || "").toString();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { services, fetchServices, loading: loadingServices } = useServiceStore();
  const { pets, fetchPets, loading: loadingPets } = usePetStore();
  const { slots, loadingSlots, submitting, fetchAvailableSlots, clearSlots, createBooking } = useBookingStore();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdBookingData, setCreatedBookingData] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    serviceIds: initialServiceId ? [initialServiceId] : [],
    petId: "",
    date: "",
    time: "",
    note: "",
    duration_minutes: 30,
    customerName: "",
    customerPhone: "",
    guestPetName: "",
    guestPetSpecies: "Dog",
  });

  // Derived Values
  const selectedServices = services.filter((s) => formData.serviceIds.includes(s.id.toString()));
  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 30;
  const totalAmount = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const slotsNeeded = Math.ceil(totalDuration / 30);

  // Sync state
  useEffect(() => { setFormData(prev => ({ ...prev, duration_minutes: totalDuration })); }, [totalDuration]);
  useEffect(() => { setFormData(prev => ({ ...prev, time: "" })); }, [slotsNeeded]);

  // Fetch initial data
  useEffect(() => {
    fetchServices();
    if (isAuthenticated) fetchPets();
  }, [isAuthenticated, fetchServices, fetchPets]);

  useEffect(() => {
    if (!formData.date) { clearSlots(); return; }
    setFormData(prev => ({ ...prev, time: "" }));
    fetchAvailableSlots(formData.date);
  }, [formData.date, fetchAvailableSlots, clearSlots]);

  // Slot Logic
  const checkConsecutiveSlots = useCallback((startIndex) => {
    if (startIndex < 0 || startIndex >= slots.length) return { available: false };
    for (let i = 0; i < slotsNeeded; i++) {
      const slot = slots[startIndex + i];
      if (!slot || !slot.available) return { available: false, reason: !slot ? "OVER_WORKING_HOURS" : slot.reason };
    }
    return { available: true };
  }, [slots, slotsNeeded]);

  const handleServiceToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id) ? prev.serviceIds.filter(i => i !== id) : [...prev.serviceIds, id]
    }));
  };

  const handleSelectSlot = (slot, index) => {
    if (checkConsecutiveSlots(index).available) {
      setFormData(prev => ({ ...prev, time: slot.start_time }));
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await createBooking(formData);
      if (response?.success) {
        setCreatedBookingData({ id: response.data?.id, amount: totalAmount });
        setIsPaymentModalOpen(true);
      } else {
        setErrors({ submit: response?.message || "Hệ thống từ chối tạo lịch hẹn." });
      }
    } catch (err) {
      setErrors({ submit: "Đã xảy ra lỗi hệ thống. Xin thử lại sau!" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h1 className="text-2xl font-black text-pet-blue mb-6 flex items-center gap-2">
            <CalendarClock size={28} /> Đặt lịch Spa
          </h1>

          {errors.submit && (
            <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold flex items-center gap-2">
              <AlertCircle size={18} /> {errors.submit}
            </div>
          )}

          <BookingForm
            formData={formData} setFormData={setFormData}
            errors={errors} setErrors={setErrors}
            services={services} pets={isAuthenticated ? pets : []}
            slots={slots} loadingSlots={loadingSlots}
            isAuthenticated={isAuthenticated}
            handleServiceToggle={handleServiceToggle}
            handleSelectSlot={handleSelectSlot}
            checkConsecutiveSlots={checkConsecutiveSlots}
            slotsNeeded={slotsNeeded}
            totalDuration={totalDuration}
            totalAmount={totalAmount}
            onSubmit={handleSubmit}
            submitting={submitting}
            loading={loadingServices || (isAuthenticated && loadingPets)}
          />
        </div>
      </div>

      <Modal isOpen={isSuccessModalOpen} onClose={() => navigate(isAuthenticated ? "/profile" : "/")}>
        <div className="text-center p-4">
          <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Đặt lịch thành công!</h3>
          <Button onClick={() => navigate(isAuthenticated ? "/profile" : "/")} className="w-full">
            {isAuthenticated ? "Xem lịch" : "Trang chủ"}
          </Button>
        </div>
      </Modal>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={createdBookingData}
        onPaymentSuccess={() => { setIsPaymentModalOpen(false); setIsSuccessModalOpen(true); }}
      />
    </div>
  );
};

export default BookingCreate;