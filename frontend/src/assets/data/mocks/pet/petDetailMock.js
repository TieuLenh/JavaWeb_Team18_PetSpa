export const petDetailMock = {
  success: true,

  message: "Get pet detail successfully",

  data: {
    id: 501,

    name: "Corgi Bánh Mì",

    thumbnail:
      "https://placehold.co/500x500",

    images: [
      "https://placehold.co/500x500",
      "https://placehold.co/500x500",
      "https://placehold.co/500x500",
    ],

    species: {
      id: 1,
      name: "Dog",
    },

    breed: "Corgi",

    gender: "Male",

    age: 2,

    birthday: "2024-03-10",

    weight_kg: 12.5,

    color: "Vàng trắng",

    microchip_code: "PET-000501",

    personality:
      "Thân thiện, hơi nhát máy sấy.",

    allergies: "Không có",

    medical_note:
      "Từng bị viêm da nhẹ.",

    owner: {
      id: 101,

      full_name: "Nguyễn Văn A",

      phone: "0912345678",
    },

    vaccinations: [
      {
        id: 1,

        vaccine_name: "Dại",

        injected_at: "2026-01-10",
      },

      {
        id: 2,

        vaccine_name: "7 bệnh",

        injected_at: "2026-03-15",
      },
    ],

    recent_bookings: [
      {
        id: 7001,

        service_name:
          "Combo Tắm Sấy Dưỡng Lông",

        booking_date: "2026-05-10",

        status: "COMPLETED",
      },

      {
        id: 7002,

        service_name:
          "Cắt Tỉa Lông Tạo Kiểu",

        booking_date: "2026-05-15",

        status: "CONFIRMED",
      },
    ],

    status: "ACTIVE",

    created_at: "2026-05-18T08:00:00Z",

    updated_at: "2026-05-20T10:00:00Z",
  },
};