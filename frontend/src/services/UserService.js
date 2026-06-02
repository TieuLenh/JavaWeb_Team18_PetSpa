import { userMock } from "../assets/data/mocks/user/userMock.js";

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
|--------------------------------------------------------------------------
| GET USERS
|--------------------------------------------------------------------------
*/

// Lấy tất cả users
const getUsers = async () => {
  await delay(500);

  return userMock;
};

// Lấy user theo id
const getUserById = async (userId) => {
  await delay(500);

  return {
    success: true,

    message: "Get user detail successfully",

    data:
      userMock.data.find(
        (user) => user.id === Number(userId)
      ) || null,
  };
};

// Lấy user theo role
const getUsersByRole = async (roleName) => {
  await delay(500);

  return {
    success: true,

    message:
      "Get users by role successfully",

    data: userMock.data.filter(
      (user) =>
        user.role.name === roleName
    ),
  };
};

/*
|--------------------------------------------------------------------------
| CREATE USER
|--------------------------------------------------------------------------
*/

// Tạo user mới
const createUser = async (userData) => {
  await delay(800);

  return {
    success: true,

    message: "Create user successfully",

    data: {
      id: Date.now(),

      avatar:
        "https://placehold.co/100x100",

      status: "ACTIVE",

      created_at:
        new Date().toISOString(),

      ...userData,
    },
  };
};

/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
*/

// Cập nhật user
const updateUser = async (
  userId,
  userData
) => {
  await delay(700);

  return {
    success: true,

    message: "Update user successfully",

    data: {
      id: Number(userId),

      ...userData,

      updated_at:
        new Date().toISOString(),
    },
  };
};

/*
|--------------------------------------------------------------------------
| UPDATE STATUS
|--------------------------------------------------------------------------
*/

// Cập nhật trạng thái user
const updateUserStatus = async (
  userId,
  status
) => {
  await delay(500);

  return {
    success: true,

    message:
      "Update user status successfully",

    data: {
      id: Number(userId),

      status,

      updated_at:
        new Date().toISOString(),
    },
  };
};

/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
*/

// Xóa user
const deleteUser = async (userId) => {
  await delay(500);

  return {
    success: true,

    message: `Delete user #${userId} successfully`,

    data: null,
  };
};

export default {
  getUsers,

  getUserById,

  getUsersByRole,

  createUser,

  updateUser,

  updateUserStatus,

  deleteUser,
};