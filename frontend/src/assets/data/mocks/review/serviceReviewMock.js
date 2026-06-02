export const serviceReviewMock = {
  success: true,

  message: "Get service reviews successfully",

  data: [
    {
      id: 9501,

      rating: 5,

      comment:
        "Groomer cắt cực đẹp, bé nhà mình nhìn như cục bông.",

      created_at: "2026-05-18T09:00:00Z",

      customer: {
        id: 201,

        full_name: "Phạm Minh Thư",

        avatar:
          "https://i.pravatar.cc/150?img=4",
      },

      service: {
        id: 1,

        name:
          "Combo Tắm Sấy Khử Mùi Dưỡng Lông",

        thumbnail:
          "https://placehold.co/300x300",
      },
    },

    {
      id: 9502,

      rating: 4,

      comment:
        "Nhân viên thân thiện, dịch vụ tốt nhưng cuối tuần hơi đông.",

      created_at: "2026-05-19T13:15:00Z",

      customer: {
        id: 202,

        full_name: "Nguyễn Quốc Khánh",

        avatar:
          "https://i.pravatar.cc/150?img=5",
      },

      service: {
        id: 2,

        name:
          "Cắt Tỉa Lông Tạo Kiểu Chuyên Sâu",

        thumbnail:
          "https://placehold.co/300x300",
      },
    },

    {
      id: 9503,

      rating: 5,

      comment:
        "Spa sạch sẽ, thơm và chăm sóc thú cưng rất nhẹ nhàng.",

      created_at: "2026-05-20T16:45:00Z",

      customer: {
        id: 203,

        full_name: "Trần Hải Yến",

        avatar:
          "https://i.pravatar.cc/150?img=6",
      },

      service: {
        id: 1,

        name:
          "Combo Tắm Sấy Khử Mùi Dưỡng Lông",

        thumbnail:
          "https://placehold.co/300x300",
      },
    },
  ],
};