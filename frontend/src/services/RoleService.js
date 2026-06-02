import mockRoles from "../assets/data/mocks/auth/mockRole";

const RoleService = {
  /**
   * Lấy toàn bộ danh sách chức vụ hệ thống hỗ trợ định biên lương
   * @returns {Promise<{ data: Array }>}
   */
  getRoles: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockRoles });
      }, 300); // Giả lập độ trễ mạng mạng 300ms
    });
  }
};

export default RoleService;