const productReviewMock = {
  success: true,

  message: "Get product reviews successfully",

  data: [
    {
      id: 9001,

      rating: 5,

      comment:
        "Hạt thơm, bé Poodle nhà mình ăn rất hợp và không bị đi ngoài.",

      created_at: "2026-05-18T08:00:00Z",

      customer: {
        id: 101,

        full_name: "Nguyễn Văn A",

        avatar:
          "https://i.pravatar.cc/150?img=1",
      },

      product: {
        id: 11,

        name: "Hạt Royal Canin cho Poodle 1kg",

        thumbnail:
          "https://placehold.co/300x300",
      },
    },

    {
      id: 9002,

      rating: 4,

      comment:
        "Đóng gói cẩn thận, giao hàng nhanh. Hạt hơi cứng với cún nhỏ.",

      created_at: "2026-05-19T10:30:00Z",

      customer: {
        id: 102,

        full_name: "Trần Thị B",

        avatar:
          "https://i.pravatar.cc/150?img=2",
      },

      product: {
        id: 11,

        name: "Hạt Royal Canin cho Poodle 1kg",

        thumbnail:
          "https://placehold.co/300x300",
      },
    },

    {
      id: 9003,

      rating: 5,

      comment:
        "Shop tư vấn nhiệt tình, sản phẩm đúng mô tả.",

      created_at: "2026-05-20T14:20:00Z",

      customer: {
        id: 103,

        full_name: "Lê Hoàng Long",

        avatar:
          "https://i.pravatar.cc/150?img=3",
      },

      product: {
        id: 12,

        name: "Vòng cổ chuông sắc màu",

        thumbnail:
          "https://placehold.co/300x300",
      },
    },
  ],
};
export default productReviewMock;