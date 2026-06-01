// src/pages/spa/components/CustomerBookingForm.jsx

import React from "react";
import {
  Calendar,
  Clock,
  PawPrint,
  AlertCircle,
  Plus,
  X,
  User,
  Phone,
} from "lucide-react";
import {Input} from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import validateBookingForm from "../../utils/bookingValidator";

const BookingForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  services,
  pets,
  slots,
  loadingSlots,
  isAuthenticated,
  handleServiceToggle,
  handleSelectSlot,
  checkConsecutiveSlots,
  slotsNeeded,
  totalDuration,
  totalAmount,
  onSubmit,
  submitting,
  loading,
}) => {
  // isWalkIn là nghịch đảo của isAuthenticated — đồng bộ với validateBookingForm
  const isWalkIn = !isAuthenticated;

  // Lấy badge thông tin lý do khi slot bị khóa
  const getReasonBadge = (reason) => {
    switch (reason) {
      case "BOOKED":
        return { label: "Kín lịch", color: "bg-red-100 text-red-500" };
      case "GROOMER_BUSY":
        return { label: "Thợ bận", color: "bg-orange-100 text-orange-500" };
      case "OUTSIDE_WORKING_HOURS":
        return { label: "Ngoài giờ", color: "bg-gray-200 text-gray-500" };
      case "OVER_WORKING_HOURS":
        return { label: "Cuối ca", color: "bg-gray-200 text-gray-500" };
      case "INSUFFICIENT_CONSECUTIVE_SLOTS":
        return { label: "Thiếu ô tiếp", color: "bg-amber-100 text-amber-600" };
      default:
        return { label: "Hết chỗ", color: "bg-gray-200 text-gray-500" };
    }
  };

  const selectedStartIndex = formData.time
    ? slots.findIndex((s) => s.start_time === formData.time)
    : -1;

  // ── Validate + submit ──
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateBookingForm(formData, { isWalkIn });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Cuộn đến lỗi đầu tiên để UX tốt hơn
      const firstErrorEl = document.querySelector(".validation-error-text");
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Không có lỗi → gọi handler từ parent
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Chọn dịch vụ ── */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Chọn dịch vụ chăm sóc (Có thể chọn nhiều)
        </label>

        <div className="flex flex-wrap gap-2 mb-3">
          {services.map((s) => {
            const isChecked = formData.serviceIds.includes(s.id.toString());
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  handleServiceToggle(s.id.toString());
                  // Reset time khi đổi service vì slotsNeeded thay đổi
                  if (formData.time) {
                    setFormData((prev) => ({ ...prev, time: "" }));
                  }
                  if (errors.serviceIds) {
                    setErrors((prev) => ({ ...prev, serviceIds: "" }));
                  }
                }}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                  isChecked
                    ? "bg-blue-50 border-pet-blue text-pet-blue shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {isChecked ? <X size={14} /> : <Plus size={14} />}
                {s.name} ({s.duration_minutes}p)
              </button>
            );
          })}
        </div>

        {errors.serviceIds && (
          <p className="validation-error-text text-red-500 text-xs font-bold mt-1 mb-2 flex items-center gap-1">
            <AlertCircle size={12} /> {errors.serviceIds}
          </p>
        )}

        {formData.serviceIds.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 flex justify-between items-center font-semibold">
            <span>Đã chọn: {formData.serviceIds.length} dịch vụ</span>
            <span>
              Tổng thời gian:{" "}
              <strong className="text-pet-blue text-sm font-black">
                {totalDuration} phút
              </strong>{" "}
              · cần{" "}
              <strong className="text-pet-blue">
                {slotsNeeded} ô liên tiếp
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* ── Luồng hiển thị thông tin Khách hàng (Đã Login / Vãng lai) ── */}
      {isAuthenticated ? (
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
            <PawPrint size={16} className="text-pet-blue" /> Chọn bé cưng chăm
            sóc
          </label>

          <select
            className={`w-full p-3.5 rounded-xl border outline-none bg-white font-medium text-sm transition-all ${
              errors.petId
                ? "border-red-400 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-pet-blue"
            }`}
            value={formData.petId}
            onChange={(e) => {
              setFormData({ ...formData, petId: e.target.value });
              if (errors.petId) setErrors((prev) => ({ ...prev, petId: "" }));
            }}
          >
            <option value="">-- Chọn một bé trong danh sách hồ sơ --</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species === "Dog" ? "Chó" : "Mèo"} - {p.breed})
              </option>
            ))}
          </select>

          {errors.petId && (
            <p className="validation-error-text text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.petId}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            ⚡ Chế độ đặt lịch vãng lai
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Họ và tên khách hàng"
                placeholder="Nhập tên của bạn"
                icon={User}
                value={formData.customerName}
                onChange={(e) => {
                  setFormData({ ...formData, customerName: e.target.value });
                  if (errors.customerName)
                    setErrors((prev) => ({ ...prev, customerName: "" }));
                }}
              />
              {errors.customerName && (
                <p className="validation-error-text text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.customerName}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Số điện thoại liên hệ"
                placeholder="Nhập số điện thoại"
                icon={Phone}
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => {
                  setFormData({ ...formData, customerPhone: e.target.value });
                  if (errors.customerPhone)
                    setErrors((prev) => ({ ...prev, customerPhone: "" }));
                }}
              />
              {errors.customerPhone && (
                <p className="validation-error-text text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.customerPhone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Tên bé cặng"
                placeholder="Ví dụ: Đậu Đậu"
                icon={PawPrint}
                value={formData.guestPetName}
                onChange={(e) => {
                  setFormData({ ...formData, guestPetName: e.target.value });
                  if (errors.guestPetName)
                    setErrors((prev) => ({ ...prev, guestPetName: "" }));
                }}
              />
              {errors.guestPetName && (
                <p className="validation-error-text text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.guestPetName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Loài vật nuôi
              </label>
              <select
                className="w-full p-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pet-blue outline-none bg-white font-medium text-sm"
                value={formData.guestPetSpecies}
                onChange={(e) =>
                  setFormData({ ...formData, guestPetSpecies: e.target.value })
                }
              >
                <option value="Dog">Chó (Dog)</option>
                <option value="Cat">Mèo (Cat)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Chọn ngày ── */}
      <div>
        <Input
          label="Chọn ngày hẹn"
          type="date"
          icon={Calendar}
          min={new Date().toISOString().split("T")[0]}
          value={formData.date}
          onChange={(e) => {
            // Reset time khi đổi ngày vì slot grid sẽ thay đổi hoàn toàn
            setFormData({ ...formData, date: e.target.value, time: "" });
            if (errors.date) setErrors((prev) => ({ ...prev, date: "", time: "" }));
          }}
        />
        {errors.date && (
          <p className="validation-error-text text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {errors.date}
          </p>
        )}
      </div>

      {/* ── Chọn khung giờ ── */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
          <Clock size={16} className="text-pet-blue" /> Chọn khung giờ bắt đầu
        </label>

        {errors.time && (
          <div className="validation-error-text p-3 mb-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <AlertCircle size={14} /> {errors.time}
          </div>
        )}

        {/* Thứ tự ưu tiên: chưa chọn ngày → chưa chọn dịch vụ → loading → rỗng → grid */}
        {!formData.date ? (
          <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl border border-dashed border-gray-200 text-center text-xs flex items-center justify-center gap-2">
            <AlertCircle size={14} /> Vui lòng chọn ngày hẹn để hiển thị khung
            giờ trống.
          </div>
        ) : formData.serviceIds.length === 0 ? (
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl border border-dashed border-amber-200 text-center text-xs font-bold">
            Vui lòng chọn ít nhất một dịch vụ để tính khung giờ phù hợp!
          </div>
        ) : loadingSlots ? (
          <div className="grid grid-cols-2 gap-3 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="p-4 bg-red-50/50 text-red-500 rounded-2xl border border-red-100 text-center text-xs font-bold">
            Hôm nay Spa đã hết lịch hoặc đóng cửa, vui lòng chọn ngày khác!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {slots.map((slot, index) => {
              const evaluation = checkConsecutiveSlots(index);
              const isAvailable = evaluation.available;
              const reason = isAvailable
                ? null
                : evaluation.reason || slot.reason;

              const isInSelectedBlock =
                selectedStartIndex >= 0 &&
                index >= selectedStartIndex &&
                index < selectedStartIndex + slotsNeeded;

              const isActualStart = formData.time === slot.start_time;
              const badge = reason ? getReasonBadge(reason) : null;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => {
                    handleSelectSlot(slot, index);
                    // Xoá lỗi time ngay khi người dùng chọn slot
                    if (errors.time) {
                      setErrors((prev) => ({ ...prev, time: "" }));
                    }
                  }}
                  className={`p-3 rounded-xl border text-left relative overflow-hidden transition-all duration-200 flex flex-col justify-between h-16 ${
                    isInSelectedBlock
                      ? "bg-pet-blue text-white border-pet-blue shadow-md shadow-blue-500/10 font-bold scale-[1.01]"
                      : !isAvailable
                        ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-blue-50/40 border-gray-200 text-gray-700 hover:border-blue-300 cursor-pointer font-semibold"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm tracking-wide font-bold">
                      {slot.start_time} – {slot.end_time}
                    </span>

                    {!isAvailable && badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider scale-90 ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    )}

                    {isInSelectedBlock && isActualStart && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-white text-pet-blue rounded-md font-bold uppercase tracking-wider">
                        Bắt đầu
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] block font-medium ${
                      isInSelectedBlock
                        ? "text-blue-100"
                        : isAvailable
                          ? "text-gray-400"
                          : "text-gray-300"
                    }`}
                  >
                    {isInSelectedBlock
                      ? isActualStart
                        ? `Giữ ${slotsNeeded} ô (${totalDuration} phút)`
                        : "Nằm trong ca đặt"
                      : isAvailable
                        ? `Bấm để giữ ${slotsNeeded} ô (${totalDuration} phút)`
                        : reason === "INSUFFICIENT_CONSECUTIVE_SLOTS"
                          ? "Không đủ ô trống liên tiếp"
                          : reason === "OVER_WORKING_HOURS"
                            ? "Spa đóng trước khi xong"
                            : "Không khả dụng"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Input
        label="Ghi chú thêm cho thợ làm lông"
        placeholder="Ví dụ: Cún bị nhát máy sấy, vui lòng sấy gió nhẹ..."
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
      />

      {/* Tổng chi phí */}
      {totalAmount > 0 && (
        <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-700">
            Tổng chi phí thanh toán trước:
          </span>
          <strong className="text-xl font-black text-pet-orange">
            {totalAmount.toLocaleString("vi-VN")} đ
          </strong>
        </div>
      )}

      <Button
        type="submit"
        className="w-full !py-4 text-base font-bold rounded-2xl shadow-lg shadow-blue-500/10"
        disabled={loading || submitting || !formData.time}
      >
        {submitting
          ? "ĐANG XỬ LÝ..."
          : loading
            ? "ĐANG TẢI DỮ LIỆU..."
            : "TIẾN HÀNH THANH TOÁN & ĐẶT LỊCH"}
      </Button>
    </form>
  );
};

export default BookingForm;