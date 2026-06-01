// src/assets/data/mocks/auth/authMock.js

const authMock = {
  success: true,
  message: "Login successfully",

  data: [
    {
      access_token: "mock-admin-token",
      refresh_token: "mock-admin-refresh-token",

      user: {
        id: 101,
        full_name: "Nguyễn Văn Admin",
        email: "admin@petspa.vn",
        password: "123456",
        phone: "0909999999",

        avatar: "https://placehold.co/100x100",

        role: {
          id: 1,
          name: "ADMIN",
        },

        status: "ACTIVE",

        created_at: "2026-05-18T08:00:00Z",
      },
    },

    {
      access_token: "mock-groomer-token",
      refresh_token: "mock-groomer-refresh-token",

      user: {
        id: 102,
        full_name: "Trần Minh Groomer",
        email: "groomer@petspa.vn",
        password: "123456",
        phone: "0912345678",

        avatar: "https://placehold.co/100x100",

        role: {
          id: 2,
          name: "GROOMER",
        },

        status: "ACTIVE",

        created_at: "2026-05-18T08:00:00Z",
      },
    },

    {
      access_token: "mock-packer-token",
      refresh_token: "mock-packer-refresh-token",

      user: {
        id: 103,
        full_name: "Phạm Quốc Đóng Hàng",
        email: "packer@petspa.vn",
        password: "123456",
        phone: "0945678901",

        avatar: "https://placehold.co/100x100",

        role: {
          id: 3,
          name: "PACKER",
        },

        status: "ACTIVE",

        created_at: "2026-05-18T08:00:00Z",
      },
    },
  ],
};

export default authMock;