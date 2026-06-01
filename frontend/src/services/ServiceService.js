import serviceMock from "../assets/data/mocks/service/serviceMock";
import { serviceCategoryMock } from "../assets/data/mocks/service/serviceCategoryMock";
import { serviceDetailMock } from "../assets/data/mocks/service/serviceDetailMock";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
|--------------------------------------------------------------------------
| GET SERVICES
|--------------------------------------------------------------------------
*/
const getServices = async () => {
  await delay(500);
  return serviceMock;
};

const getServicesByCategory = async (categoryId) => {
  await delay(500);
  return {
    success: true,
    message: "Get services by category successfully",
    data: serviceMock.data.filter((service) => service.category.id === Number(categoryId)),
  };
};

const getServiceById = async (serviceId) => {
  await delay(500);
  return {
    success: true,
    message: "Get service detail successfully",
    data: serviceDetailMock.data.id === Number(serviceId) ? serviceDetailMock.data : null,
  };
};

/*
|--------------------------------------------------------------------------
| SERVICE CATEGORY
|--------------------------------------------------------------------------
*/
const getServiceCategories = async () => {
  await delay(300);
  return serviceCategoryMock;
};

// BỔ SUNG: Tạo danh mục dịch vụ mới
const createServiceCategory = async (categoryData) => {
  await delay(500);
  return {
    success: true,
    message: "Create service category successfully",
    data: {
      id: Date.now(),
      service_count: 0,
      status: "ACTIVE",
      thumbnail: categoryData.thumbnail || "https://placehold.co/300x300",
      ...categoryData,
    }
  };
};

// BỔ SUNG: Cập nhật danh mục dịch vụ
const updateServiceCategory = async (id, categoryData) => {
  await delay(500);
  return {
    success: true,
    message: "Update service category successfully",
    data: { id, ...categoryData }
  };
};

// BỔ SUNG: Xóa danh mục dịch vụ
const deleteServiceCategory = async (id) => {
  await delay(400);
  return {
    success: true,
    message: `Delete service category #${id} successfully`,
    data: null
  };
};

/*
|--------------------------------------------------------------------------
| CREATE / UPDATE / DELETE SERVICE
|--------------------------------------------------------------------------
*/
const createService = async (serviceData) => {
  await delay(800);
  return {
    success: true,
    message: "Create service successfully",
    data: {
      id: Date.now(),
      thumbnail: "https://placehold.co/300x300",
      average_rating: 0,
      review_count: 0,
      booking_count: 0,
      status: "ACTIVE",
      created_at: new Date().toISOString(),
      ...serviceData,
    },
  };
};

const updateService = async (serviceId, serviceData) => {
  await delay(700);
  return {
    success: true,
    message: "Update service successfully",
    data: {
      id: serviceId,
      ...serviceData,
      updated_at: new Date().toISOString(),
    },
  };
};

const deleteService = async (serviceId) => {
  await delay(500);
  return {
    success: true,
    message: `Delete service #${serviceId} successfully`,
    data: null,
  };
};

export default {
  getServices,
  getServicesByCategory,
  getServiceById,
  getServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  createService,
  updateService,
  deleteService,
};