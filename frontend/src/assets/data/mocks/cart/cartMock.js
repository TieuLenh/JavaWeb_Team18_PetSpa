export const cartMock = {
  success: true,
  message: "Get cart successfully",

  data: {
    id: 1,

    user_id: 101,

    items: [
      {
        id: 1,

        product: {
          id: 11,
          name: "Hạt Royal Canin cho Poodle 1kg",

          thumbnail: "https://placehold.co/300x300",
        },

        quantity: 2,

        price: 185000,

        subtotal: 370000,
      },

      {
        id: 2,

        product: {
          id: 12,
          name: "Vòng cổ chuông sắc màu",

          thumbnail: "https://placehold.co/300x300",
        },

        quantity: 1,

        price: 350000,

        subtotal: 350000,
      },
    ],

    total_items: 3,

    total_amount: 720000,
  },
};