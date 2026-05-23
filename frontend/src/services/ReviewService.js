import productReviewMock from "../assets/data/mocks/review/productReviewMock";
import { serviceReviewMock } from "../assets/data/mocks/review/serviceReviewMock.js";

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
|--------------------------------------------------------------------------
| PRODUCT REVIEW
|--------------------------------------------------------------------------
*/

// Lấy review theo sản phẩm
const getProductReviews = async (productId) => {
  await delay(500);

  return {
    success: true,

    message: "Get product reviews successfully",

    data: productReviewMock.data.filter(
      (review) => review.product.id === Number(productId)
    ),
  };
};

// Tạo review sản phẩm
const createProductReview = async (reviewData) => {
  await delay(800);

  return {
    success: true,

    message: "Create product review successfully",

    data: {
      id: Date.now(),

      ...reviewData,

      created_at: new Date().toISOString(),
    },
  };
};

/*
|--------------------------------------------------------------------------
| SERVICE REVIEW
|--------------------------------------------------------------------------
*/

// Lấy review theo dịch vụ
const getServiceReviews = async (serviceId) => {
  await delay(500);

  return {
    success: true,

    message: "Get service reviews successfully",

    data: serviceReviewMock.data.filter(
      (review) => review.service.id === Number(serviceId)
    ),
  };
};

// Tạo review dịch vụ
const createServiceReview = async (reviewData) => {
  await delay(800);

  return {
    success: true,

    message: "Create service review successfully",

    data: {
      id: Date.now(),

      ...reviewData,

      created_at: new Date().toISOString(),
    },
  };
};

/*
|--------------------------------------------------------------------------
| COMMON REVIEW
|--------------------------------------------------------------------------
*/

// Xóa review
const deleteReview = async (reviewId) => {
  await delay(500);

  return {
    success: true,

    message: `Delete review #${reviewId} successfully`,
  };
};

// Cập nhật review
const updateReview = async (reviewId, reviewData) => {
  await delay(700);

  return {
    success: true,

    message: "Update review successfully",

    data: {
      id: reviewId,

      ...reviewData,

      updated_at: new Date().toISOString(),
    },
  };
};

export default {
  getProductReviews,

  createProductReview,

  getServiceReviews,

  createServiceReview,

  deleteReview,

  updateReview,
};