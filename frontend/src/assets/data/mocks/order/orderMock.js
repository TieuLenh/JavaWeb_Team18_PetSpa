const orderMock = {
  success: true,
  message: "Get orders successfully",

  data: [
    {
      id: 8001,

      order_code: "ORD-20260518-001",

      customer: {
        id: 101,
        full_name: "Nguyễn Văn A",
      },

      items: [
        {
          id: 1,

          product: {
            id: 11,
            name: "Hạt Royal Canin cho Poodle 1kg",
          },

          quantity: 1,

          price: 185000,

          subtotal: 185000,
        },
      ],

      shipping_address:
        "123 Lạch Tray, Ngô Quyền, Hải Phòng",

      payment_method: "COD",

      payment_status: "PAID",

      status: "SHIPPING",

      total_amount: 185000,

      created_at: "2026-05-18T11:00:00Z",
    },

    {
      id: 8002,

      order_code: "ORD-20260518-002",

      customer: {
        id: 102,
        full_name: "Trần Thị B",
      },

      items: [
        {
          id: 2,

          product: {
            id: 12,
            name: "Vòng cổ chuông sắc màu",
          },

          quantity: 2,

          price: 350000,

          subtotal: 700000,
        },
      ],

      shipping_address:
        "20 Trần Thái Tông, Cầu Giấy, Hà Nội",

      payment_method: "BANK_TRANSFER",

      payment_status: "PAID",

      status: "COMPLETED",

      total_amount: 700000,

      created_at: "2026-05-18T12:00:00Z",
    },
  ],
};
export default orderMock;