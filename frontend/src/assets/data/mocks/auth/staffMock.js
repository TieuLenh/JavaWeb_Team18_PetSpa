// src/assets/data/mocks/auth/staffMock.js

export const staffMock = {
  success: true,
  message: "Get staff successfully",

  data: [
    {
      id: 101,

      account: {
        id: 101,
        email: "admin@petspa.vn",

        role: {
          id: 1,
          name: "ADMIN",
        },

        status: "ACTIVE",
      },

      full_name: "Nguyễn Văn Admin",
      phone: "0909999999",
      avatar: "https://placehold.co/100x100",

      gender: "MALE",

      date_of_birth: "1995-05-10",
      address: "Quận 1, TP.HCM",

      hire_date: "2024-01-15",
      salary: 30000000,

      working_hours: {
        start: "08:00",
        end: "17:00",
      },

      created_at: "2026-05-01T09:00:00Z",
      updated_at: "2026-05-18T10:00:00Z",
    },

    {
      id: 102,

      account: {
        id: 102,
        email: "groomer@petspa.vn",

        role: {
          id: 2,
          name: "GROOMER",
        },

        status: "ACTIVE",
      },

      full_name: "Trần Minh Groomer",
      phone: "0912345678",
      avatar: "https://placehold.co/100x100",

      gender: "MALE",

      date_of_birth: "1998-07-21",
      address: "Thủ Đức, TP.HCM",

      hire_date: "2025-02-15",
      salary: 18000000,

      experience_years: 4,

      specialties: [
        "Cắt tỉa Poodle",
        "Spa chó lớn",
        "Tắm trị liệu",
      ],

      rating: 4.9,
      total_reviews: 128,

      working_hours: {
        start: "08:00",
        end: "17:00",
      },

      created_at: "2026-05-02T09:00:00Z",
      updated_at: "2026-05-18T10:00:00Z",
    },

    {
      id: 103,

      account: {
        id: 103,
        email: "packer@petspa.vn",

        role: {
          id: 3,
          name: "PACKER",
        },

        status: "ACTIVE",
      },

      full_name: "Phạm Quốc Đóng Hàng",
      phone: "0945678901",
      avatar: "https://placehold.co/100x100",

      gender: "MALE",

      date_of_birth: "1999-01-18",
      address: "Bình Thạnh, TP.HCM",

      hire_date: "2024-08-12",
      salary: 11000000,

      working_hours: {
        start: "08:30",
        end: "17:30",
      },

      created_at: "2026-05-04T07:45:00Z",
      updated_at: "2026-05-18T13:00:00Z",
    },
  ],
};