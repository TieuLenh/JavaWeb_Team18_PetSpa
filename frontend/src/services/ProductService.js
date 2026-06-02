import { productMock } from "../assets/data/mocks/product/productMock";
import { categoryMock } from "../assets/data/mocks/product/categoryMock.js";

const delay = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

const getProducts = async () => {
  await delay(500);
  return productMock;
};

const getProductById = async (id) => {
  await delay(500);
  return {
    success: true,
    data: productMock.data.find(
      product => product.id === Number(id)
    ),
  };
};

const getProductCategories = async () => {
  await delay(300);
  return categoryMock;
};

// ─── BỔ SUNG CÁC PHƯƠNG THỨC QUẢN LÝ DANH MỤC CHO ADMIN ───

const createCategory = async (categoryData) => {
  await delay(400);
  console.log("Service nhận yêu cầu TẠO danh mục:", categoryData);
  return {
    success: true,
    data: { ...categoryData, id: Date.now() } // Sinh ID tạm thời
  };
};

const updateCategory = async (id, categoryData) => {
  await delay(400);
  console.log(`Service nhận yêu cầu CẬP NHẬT danh mục [ID: ${id}]:`, categoryData);
  return {
    success: true,
    data: categoryData
  };
};

const deleteCategory = async (id) => {
  await delay(400);
  console.log(`Service nhận yêu cầu XÓA danh mục [ID: ${id}]`);
  return {
    success: true,
    message: "Deleted successfully"
  };
};

export default {
  getProducts,
  getProductById,
  getProductCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};