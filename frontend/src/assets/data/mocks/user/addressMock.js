const addressMock = {
  success: true,

  message: "Get addresses successfully",

  data: [
    {
      id: 2001,

      user_id: 101,

      recipient_name: "Nguyễn Văn A",

      phone_number: "0912345678",

      province_city: "Hải Phòng",

      district_ward: "Ngô Quyền",

      detail_address: "123 Lạch Tray",

      postal_code: "180000",

      address_type: "HOME",

      is_default: true,

      created_at: "2026-05-18T08:30:00Z",
    },

    {
      id: 2002,

      user_id: 101,

      recipient_name: "Nguyễn Văn A",

      phone_number: "0912345678",

      province_city: "Hà Nội",

      district_ward: "Cầu Giấy",

      detail_address: "45 Xuân Thủy",

      postal_code: "100000",

      address_type: "OFFICE",

      is_default: false,

      created_at: "2026-05-18T08:45:00Z",
    },

    {
      id: 2003,

      user_id: 102,

      recipient_name: "Trần Thị B",

      phone_number: "0987654321",

      province_city: "Đà Nẵng",

      district_ward: "Hải Châu",

      detail_address: "78 Nguyễn Văn Linh",

      postal_code: "550000",

      address_type: "HOME",

      is_default: true,

      created_at: "2026-05-18T09:15:00Z",
    },
  ],
}; export default addressMock;