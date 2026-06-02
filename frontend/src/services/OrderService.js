import  orderMock  from "../assets/data/mocks/order/orderMock";

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
|--------------------------------------------------------------------------
| GET ORDERS
|--------------------------------------------------------------------------
*/

// Lấy tất cả đơn hàng
const getOrders = async () => {
  await delay(500);

  return orderMock;
};

// Lấy đơn hàng theo id
const getOrderById = async (orderId) => {
  await delay(500);

  return {
    success: true,

    message: "Get order detail successfully",

    data: orderMock.data.find(
      (order) => order.id === Number(orderId)
    ),
  };
};

// Lấy đơn hàng theo user
const getOrdersByUser = async (userId) => {
  await delay(500);

  return {
    success: true,

    message: "Get user orders successfully",

    data: orderMock.data.filter(
      (order) => order.customer.id === Number(userId)
    ),
  };
};

/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
*/

// Tạo đơn hàng mới
const createOrder = async (orderData) => {
  await delay(800);

  return {
    success: true,

    message: "Create order successfully",

    data: {
      id: Date.now(),

      order_code: `ORD-${Date.now()}`,

      ...orderData,

      status: "PENDING",

      payment_status: "UNPAID",

      created_at: new Date().toISOString(),
    },
  };
};

/*
|--------------------------------------------------------------------------
| UPDATE ORDER
|--------------------------------------------------------------------------
*/

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (
  orderId,
  newStatus
) => {
  await delay(600);

  return {
    success: true,

    message: "Update order status successfully",

    data: {
      id: orderId,

      status: newStatus,

      updated_at: new Date().toISOString(),
    },
  };
};

// Hủy đơn hàng
const cancelOrder = async (orderId) => {
  await delay(600);

  return {
    success: true,

    message: "Cancel order successfully",

    data: {
      id: orderId,

      status: "CANCELLED",

      updated_at: new Date().toISOString(),
    },
  };
};

/*
|--------------------------------------------------------------------------
| PAYMENT
|--------------------------------------------------------------------------
*/

// Thanh toán đơn hàng
const payOrder = async (
  orderId,
  paymentMethod
) => {
  await delay(1000);

  return {
    success: true,

    message: "Payment successfully",

    data: {
      order_id: orderId,

      payment_method: paymentMethod,

      payment_status: "PAID",

      paid_at: new Date().toISOString(),
    },
  };
};

export default {
  getOrders,

  getOrderById,

  getOrdersByUser,

  createOrder,

  updateOrderStatus,

  cancelOrder,

  payOrder,
};