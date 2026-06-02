export const notificationMock = {
  success: true,
  message: "Get notifications successfully",

  data: [
    {
      id: 1,

      title: "Lịch grooming sắp tới",

      content:
        "Bạn có lịch grooming cho bé Bánh Mì lúc 15:00 hôm nay.",

      type: "BOOKING",

      is_read: false,

      created_at: "2026-05-18T07:00:00Z",
    },

    {
      id: 2,

      title: "Đơn hàng đang giao",

      content:
        "Đơn hàng ORD-20260518-001 đang được giao.",

      type: "ORDER",

      is_read: true,

      created_at: "2026-05-18T08:30:00Z",
    },

    {
      id: 3,

      title: "Khuyến mãi tháng 5",

      content:
        "Giảm 20% tất cả dịch vụ grooming cho khách hàng thân thiết.",

      type: "PROMOTION",

      is_read: false,

      created_at: "2026-05-18T09:00:00Z",
    },
  ],
};