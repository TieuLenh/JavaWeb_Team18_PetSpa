export const bookingMock = {
  success: true,
  message: "Get bookings successfully",
  data: [
    {
      id: 6001,
      customer: {
        id: 101,
        full_name: "Nguyễn Văn A",
      },
      pet: {
        id: 501,
        name: "Bánh Mì",
        species: "Dog",
        breed: "Corgi",
      },
      groomer: {
        id: 3,
        full_name: "Trần Minh Groomer",
      },
      services: [
        {
          id: 1,
          name: "Combo Tắm Sấy",
          duration_minutes: 45,
          price: 200000,
        },
        {
          id: 2,
          name: "Cắt Tỉa Lông",
          duration_minutes: 60,
          price: 350000,
        },
      ],
      booking_date: "2026-05-20",
      start_time: "15:00",
      // Tổng 105 phút: 15:00 -> 16:45 (Chiếm dụng slot 15:00-16:00 và 16:00-17:00)
      end_time: "16:45",
      duration_minutes: 105, 
      total_amount: 550000,
      payment_status: "PAID",
      status: "CONFIRMED",
      note: "Bé hơi nhát máy sấy",
      created_at: "2026-05-18T09:00:00Z",
    },
    {
      id: 6002,
      customer: {
        id: 102,
        full_name: "Trần Thị B",
      },
      pet: {
        id: 502,
        name: "Milu",
        species: "Cat",
        breed: "British Shorthair",
      },
      groomer: {
        id: 3,
        full_name: "Trần Minh Groomer",
      },
      services: [
        {
          id: 1,
          name: "Combo Tắm Sấy",
          duration_minutes: 45,
          price: 200000,
        },
      ],
      booking_date: "2026-05-21",
      start_time: "10:00",
      // Dưới 60 phút: Chỉ chiếm dụng gọn trong 1 slot duy nhất (10:00 - 11:00)
      end_time: "10:45",
      duration_minutes: 45,
      total_amount: 200000,
      payment_status: "PAID",
      status: "COMPLETED",
      note: "",
      created_at: "2026-05-18T10:00:00Z",
    },
  ],
};