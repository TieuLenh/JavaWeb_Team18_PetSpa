import authMock from "../assets/data/mocks/auth/authMock";
import registerMock from "../assets/data/mocks/auth/registerMock";

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| LOGIN (Sửa lại để map đúng cấu trúc mảng của authMock)
|--------------------------------------------------------------------------
*/
const login = async (loginData) => {
  await delay(800);

  const { email, password } = loginData;

  // 🚀 TÌM TÀI KHOẢN KHỚP CẢ EMAIL VÀ PASSWORD TRONG MOCK DỰ LIỆU
  const matchedAccount = authMock?.data?.find(
    (account) =>
      account.user?.email === email && account.user?.password === password
  );

  // Nếu sai email hoặc sai mật khẩu, matchedAccount sẽ trả về undefined
  if (!matchedAccount) {
    throw {
      response: {
        data: {
          message: "Email hoặc mật khẩu không chính xác",
        },
      },
    };
  }

  // 3. Trả về đúng cấu trúc chuẩn cấu trúc dữ liệu mà Login.jsx đang chờ
  return {
    success: true,
    message: "Login successfully",
    data: {
      user: matchedAccount.user,
      access_token: matchedAccount.access_token,
      refresh_token: matchedAccount.refresh_token,
    },
  };
};

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/
const register = async (registerData) => {
  await delay(1000);

  return {
    success: true,
    message: "Register successfully",
    data: {
      access_token: "mock-register-access-token",
      refresh_token: "mock-register-refresh-token",
      user: {
        id: Date.now(),
        full_name: registerData.full_name,
        email: registerData.email,
        phone: registerData.phone || "",
        avatar: "https://placehold.co/100x100",
        role: {
          id: 1,
          name: "CUSTOMER",
        },
        status: "ACTIVE",
        created_at: new Date().toISOString(),
      },
    },
  };
};

/*
|--------------------------------------------------------------------------
| PROFILE
|--------------------------------------------------------------------------
*/
const getProfile = async () => {
  await delay(500);

  return {
    success: true,
    data: registerMock.data.user,
  };
};

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/
const updateProfile = async (profileData) => {
  await delay(700);

  return {
    success: true,
    data: {
      ...registerMock.data.user,
      ...profileData,
      updated_at: new Date().toISOString(),
    },
  };
};

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/
const logout = async () => {
  await delay(300);

  return {
    success: true,
  };
};

export default {
  login,
  register,
  getProfile,
  updateProfile,
  logout,
};