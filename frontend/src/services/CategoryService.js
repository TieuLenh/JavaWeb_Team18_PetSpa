import axios from 'axios';

// Dữ liệu Mock do bạn cung cấp (bổ sung trường code/description để tương thích tốt với UI quản trị)
import { categoryMock } from '../assets/data/mocks/product/categoryMock';

const API_BASE_URL = 'http://localhost:8080/api/v1/categories'; // Thay đổi URL endpoint Backend của bạn tại đây

const CategoryService = {
  
  // 1. Lấy toàn bộ danh sách danh mục
  getCategories: async () => {
    // KHI CHƯA CÓ BACKEND: Trả về dữ liệu mock ngay lập tức để test giao diện
    return Promise.resolve(categoryMock);

    // KHI ĐÃ CÓ BACKEND: Mở comment đoạn code dưới đây và xóa dòng Promise.resolve ở trên
    // const response = await axios.get(`${API_BASE_URL}`);
    // return response.data;
  },

  // 2. Thêm mới một danh mục
  createCategory: async (categoryData) => {
    // Mock xử lý lưu tạm thời (hiển thị log ra console để kiểm tra luồng dữ liệu)
    console.log("Gửi yêu cầu TẠO danh mục lên hệ thống:", categoryData);
    return Promise.resolve({ success: true, data: categoryData });

    // Kết nối thực tế:
    // const response = await axios.post(`${API_BASE_URL}`, categoryData);
    // return response.data;
  },

  // 3. Cập nhật thông tin danh mục theo ID
  updateCategory: async (id, categoryData) => {
    console.log(`Gửi yêu cầu CẬP NHẬT danh mục [ID: ${id}]:`, categoryData);
    return Promise.resolve({ success: true, data: categoryData });

    // Kết nối thực tế:
    // const response = await axios.put(`${API_BASE_URL}/${id}`, categoryData);
    // return response.data;
  },

  // 4. Xóa danh mục khỏi hệ thống
  deleteCategory: async (id) => {
    console.log(`Gửi yêu cầu XÓA danh mục [ID: ${id}]`);
    return Promise.resolve({ success: true, message: "Deleted successfully" });

    // Kết nối thực tế:
    // const response = await axios.delete(`${API_BASE_URL}/${id}`);
    // return response.data;
  }
};

export default CategoryService;