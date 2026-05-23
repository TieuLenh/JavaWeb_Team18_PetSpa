export const productMock = {
  success: true,
  message: "Get products successfully",

  data: [
    {
      id: 11,

      name: "Hạt Royal Canin cho Poodle 1kg",

      thumbnail: "https://placehold.co/300x300",

      description: "Thức ăn hạt dinh dưỡng dành riêng cho giống chó Poodle.",

      price: 185000,

      stock_quantity: 45,

      category: {
        id: 1,
        name: "Thức ăn Thú cưng",
         code: "FOOD"
      },

      rating: 4.8,

      review_count: 124,

      status: "ACTIVE",

      created_at: "2026-05-18T08:00:00Z",
    },

    {
      id: 12,

      name: "Vòng cổ chuông sắc màu",

      thumbnail: "https://placehold.co/300x300",

      description: "Vòng cổ chất liệu mềm mại dành cho chó mèo.",

      price: 350000,

      stock_quantity: 0,

      category: {
        id: 2,
        name: "Phụ kiện & Đồ chơi",
        code: "ACCESSORY"
      },

      rating: 4.5,

      review_count: 88,

      status: "OUT_OF_STOCK",

      created_at: "2026-05-18T08:10:00Z",
    },
  ],
};
