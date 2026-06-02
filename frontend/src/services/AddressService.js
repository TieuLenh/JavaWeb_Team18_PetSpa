import addressMock from "../assets/data/mocks/user/addressMock.js";

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
|--------------------------------------------------------------------------
| GET ADDRESSES
|--------------------------------------------------------------------------
*/
const getAddresses = async () => {
  await delay(500);
  return addressMock;
};

const getAddressesByUser = async (userId) => {
  await delay(500);
  return {
    success: true,
    message: "Get user addresses successfully",
    data: addressMock.data.filter(
      (address) => address.user_id === Number(userId)
    ),
  };
};

const getAddressById = async (addressId) => {
  await delay(400);
  return {
    success: true,
    message: "Get address detail successfully",
    data:
      addressMock.data.find(
        (address) => address.id === Number(addressId)
      ) || null,
  };
};

/*
|--------------------------------------------------------------------------
| CREATE ADDRESS
|--------------------------------------------------------------------------
*/
const createAddress = async (addressData) => {
  await delay(800);

  const newAddress = {
    id: Date.now(),
    is_default: false,
    postal_code: "180000",
    created_at: new Date().toISOString(),
    ...addressData, // Nhận toàn bộ key snake_case từ component gửi qua
  };

  // 🔥 ĐỒNG BỘ MOCK: Push vào mảng tĩnh để khi reload danh sách sẽ thấy data mới
  addressMock.data.push(newAddress);

  return {
    success: true,
    message: "Create address successfully",
    data: newAddress,
  };
};

/*
|--------------------------------------------------------------------------
| UPDATE ADDRESS
|--------------------------------------------------------------------------
*/
const updateAddress = async (addressId, addressData) => {
  await delay(700);

  // Cập nhật lại trong mảng tĩnh của Mock nếu có
  const index = addressMock.data.findIndex(item => item.id === Number(addressId));
  let updatedData = {
    id: Number(addressId),
    ...addressData,
    updated_at: new Date().toISOString(),
  };

  if (index !== -1) {
    addressMock.data[index] = { ...addressMock.data[index], ...updatedData };
  }

  return {
    success: true,
    message: "Update address successfully",
    data: updatedData,
  };
};

/*
|--------------------------------------------------------------------------
| DEFAULT ADDRESS
|--------------------------------------------------------------------------
*/
const setDefaultAddress = async (addressId) => {
  await delay(500);

  // Cập nhật trạng thái mặc định trong mảng Mock
  addressMock.data = addressMock.data.map(address => ({
    ...address,
    is_default: address.id === Number(addressId)
  }));

  return {
    success: true,
    message: `Set address #${addressId} as default successfully`,
    data: {
      id: Number(addressId),
      is_default: true,
    },
  };
};

/*
|--------------------------------------------------------------------------
| DELETE ADDRESS
|--------------------------------------------------------------------------
*/
const deleteAddress = async (addressId) => {
  await delay(500);
  
  // Xóa khỏi mảng Mock
  addressMock.data = addressMock.data.filter(item => item.id !== Number(addressId));

  return {
    success: true,
    message: `Delete address #${addressId} successfully`,
    data: null,
  };
};

export default {
  getAddresses,
  getAddressesByUser,
  getAddressById,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
};