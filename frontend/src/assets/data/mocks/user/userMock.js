export const userMock = {
  success: true,
  message: "Get users successfully",

  data: [
    {
      id: 101,

      full_name: "Nguyễn Văn A",

      email: "admin@petspa.vn",

      phone: "0912345678",

      avatar: "https://placehold.co/100x100",

      role: {
        id: 1,
        name: "ADMIN",
      },

      addresses: [
        {
          id: 2001,

          recipient_name: "Nguyễn Văn A",

          phone_number: "0912345678",

          province_city: "Hải Phòng",

          district_ward: "Ngô Quyền",

          detail_address: "123 Lạch Tray",

          is_default: true,
        },
      ],

      status: "ACTIVE",

      created_at: "2026-05-18T08:00:00Z",
    },

    {
      id: 102,

      full_name: "Trần Thị B",

      email: "tranthib@example.com",

      phone: "0987654321",

      avatar: "https://placehold.co/100x100",

      role: {
        id: 2,
        name: "CUSTOMER",
      },

      addresses: [],

      status: "ACTIVE",

      created_at: "2026-05-18T09:00:00Z",
    },
  ],
};