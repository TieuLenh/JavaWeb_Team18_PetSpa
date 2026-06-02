export const petMock = {
  success: true,

  message: "Get pets successfully",

  data: [
    {
      id: 501,

      name: "Corgi Bánh Mì",

      thumbnail:
        "https://placehold.co/300x300",

      species: {
        id: 1,
        name: "Dog",
      },

      breed: "Corgi",

      gender: "Male",

      age: 2,

      weight_kg: 12.5,

      color: "Vàng trắng",

      owner: {
        id: 101,
        full_name: "Nguyễn Văn A",
      },

      vaccination_count: 4,

      booking_count: 12,

      status: "ACTIVE",

      created_at: "2026-05-18T08:00:00Z",
    },

    {
      id: 502,

      name: "Mèo Mochi",

      thumbnail:
        "https://placehold.co/300x300",

      species: {
        id: 2,
        name: "Cat",
      },

      breed: "British Shorthair",

      gender: "Female",

      age: 1,

      weight_kg: 4.2,

      color: "Xám",

      owner: {
        id: 102,
        full_name: "Trần Thị B",
      },

      vaccination_count: 2,

      booking_count: 5,

      status: "ACTIVE",

      created_at: "2026-05-19T09:00:00Z",
    },
  ],
};