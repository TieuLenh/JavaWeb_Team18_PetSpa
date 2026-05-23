const registerMock = {
  success: true,
  message: "Register successfully",
  data: {
    access_token: "mock-register-access-token-123456",
    refresh_token: "mock-register-refresh-token-123456",

    user: {
      id: 999,
      full_name: "New User",
      email: "newuser@petspa.com",
      phone: "0123456789",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NewUser",
      role: {
        id: 2,
        name: "CUSTOMER"
      },
      status: "ACTIVE",
      created_at: new Date().toISOString()
    }
  }
};

export default registerMock;