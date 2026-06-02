const serviceMock = {
  success: true,

  message: "Get services successfully",

  data: [
    {
      id: 1,

      name:
        "Combo Tắm Sấy Khử Mùi Dưỡng Lông",

      slug: "combo-tam-say-duong-long",

      thumbnail:
        "https://placehold.co/300x300",

      description:
        "Quy trình tắm sấy 5 bước giúp sạch sâu và dưỡng lông mềm mượt.",

      duration_minutes: 45,

      price: 200000,

      discount_percent: 10,

      final_price: 180000,

      booking_count: 321,

      average_rating: 4.9,

      review_count: 145,

      category: {
        id: 1,
        name: "Spa & Grooming",
      },

      is_featured: true,

      status: "ACTIVE",

      created_at: "2026-05-18T08:00:00Z",
    },

    {
      id: 2,

      name:
        "Cắt Tỉa Lông Tạo Kiểu Chuyên Sâu",

      slug: "cat-tia-long-tao-kieu",

      thumbnail:
        "https://placehold.co/300x300",

      description:
        "Tạo kiểu theo yêu cầu với groomer chuyên nghiệp.",

      duration_minutes: 60,

      price: 350000,

      discount_percent: 0,

      final_price: 350000,

      booking_count: 187,

      average_rating: 4.8,

      review_count: 98,

      category: {
        id: 1,
        name: "Spa & Grooming",
      },

      is_featured: true,

      status: "ACTIVE",

      created_at: "2026-05-18T09:00:00Z",
    },

    {
      id: 3,

      name: "Khám Sức Khỏe Tổng Quát",

      slug: "kham-suc-khoe-tong-quat",

      thumbnail:
        "https://placehold.co/300x300",

      description:
        "Khám tổng quát và tư vấn sức khỏe thú cưng.",

      duration_minutes: 30,

      price: 150000,

      discount_percent: 0,

      final_price: 150000,

      booking_count: 102,

      average_rating: 4.7,

      review_count: 64,

      category: {
        id: 2,
        name: "Thú Y",
      },

      is_featured: false,

      status: "ACTIVE",

      created_at: "2026-05-18T10:00:00Z",
    },
  ],
};
export default serviceMock;