import { bookingMock } from "../assets/data/mocks/booking/bookingMock.js";
import { slotMock } from "../assets/data/mocks/booking/slotMock.js";

// Hàm giả lập độ trễ mạng
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lấy danh sách tất cả các lượt đặt lịch (bookings)
 */
const getBookings = async () => {
  await delay(500);
  return bookingMock;
};

/**
 * Lấy thông tin chi tiết của một booking theo ID (Có fallback chống crash giao diện test)
 * @param {number|string} id - ID của booking cần tìm
 */
const getBookingById = async (id) => {
  await delay(500);
  
  // Tìm kiếm theo ID ép kiểu số
  let foundBooking = bookingMock.data.find((booking) => booking.id === Number(id));
  
  // FALLBACK: Nếu chạy môi trường test/gõ URL bừa mà không tìm thấy ID khớp, 
  // tự động lấy phần tử đầu tiên để giao diện không bị N/A trắng xóa.
  if (!foundBooking && bookingMock.data.length > 0) {
    foundBooking = bookingMock.data[0];
  }

  return {
    success: !!foundBooking,
    data: foundBooking,
  };
};

/**
 * Lấy danh sách các khung giờ (slots) còn trống hoặc trạng thái của chúng
 */
const getAvailableSlots = async (date, groomerId) => {
  await delay(400); 
  return slotMock;
};

/**
 * Giả lập tính năng tạo mới một booking
 */
const createBooking = async (bookingData) => {
  await delay(600);
  return {
    success: true,
    message: "Create booking successfully",
    data: {
      id: Math.floor(Math.random() * 1000) + 7000,
      ...bookingData,
      status: "PENDING",
      payment_status: "UNPAID",
      created_at: new Date().toISOString(),
    },
  };
};

/**
 * Giả lập tính năng hủy một booking
 * @param {number|string} id - ID của booking cần hủy
 */
const cancelBooking = async (id) => {
  await delay(500);
  return {
    success: true,
    message: "Cancel booking successfully"
  };
};

export default {
  getBookings,
  getBookingById,
  getAvailableSlots,
  createBooking,
  cancelBooking, // Thêm dòng này để component gọi không bị crash
};