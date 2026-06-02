import { staffMock } from "../assets/data/mocks/auth/staffMock";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Khởi tạo bộ nhớ tạm thời từ mock data của bạn để thực hiện CRUD tĩnh
let localStaffs = [];

const initializeData = () => {
  if (localStaffs.length === 0 && staffMock?.data) {
    localStaffs = [...staffMock.data];
  }
};

const getStaffs = async () => {
  await delay(500);
  initializeData();
  // Trả về bọc trong object tương thích cấu trúc component của bạn
  return { data: localStaffs };
};

const getStaffById = async (id) => {
  await delay(500);
  initializeData();
  const staff = localStaffs.find(s => s.id === Number(id));
  return {
    success: !!staff,
    data: staff,
  };
};

const getStaffByRole = async (role) => {
  await delay(300);
  initializeData();
  return {
    success: true,
    data: localStaffs.filter(s => s.account?.role?.name === role),
  };
};

// Bổ sung các hàm tương ứng với luồng xử lý trên giao diện của bạn
const createStaff = async (staffData) => {
  await delay(400);
  initializeData();
  const newStaff = {
    ...staffData,
    id: Date.now(),
    staff_code: staffData.staff_code || `STF-${Date.now()}`
  };
  localStaffs = [newStaff, ...localStaffs];
  return { data: newStaff };
};

const updateStaff = async (id, staffData) => {
  await delay(400);
  initializeData();
  const index = localStaffs.findIndex(s => s.id === Number(id));
  if (index !== -1) {
    localStaffs[index] = { ...localStaffs[index], ...staffData };
    return { data: localStaffs[index] };
  }
  throw new Error("Không tìm thấy nhân sự");
};

const deleteStaff = async (id) => {
  await delay(300);
  initializeData();
  localStaffs = localStaffs.filter(s => s.id !== Number(id));
  return { success: true };
};

export default {
  getStaffs,
  getStaffById,
  getStaffByRole,
  createStaff,
  updateStaff,
  deleteStaff
};