import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  ChevronRight,
  FolderPlus,
  CheckCircle,
  X
} from 'lucide-react';
import Loading from '../../../components/common/Loading';
import ConfirmModal from '../../../components/common/ConfirmModal'; 
import { useCartStore } from '../../../store/cartStore'; 
import { useProductStore } from '../../../store/productStore';

const CategoryManagement = () => {
  // ── Lấy trạng thái và các hành động xử lý từ useProductStore ──
  const {
    categories,
    loading,
    fetchCategories,
    createCategory, // Hành động thêm mới danh mục (được bổ sung ở store dưới)
    updateCategory, // Hành động cập nhật danh mục (được bổ sung ở store dưới)
    deleteCategory  // Hành động xóa danh mục (được bổ sung ở store dưới)
  } = useProductStore();

  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State quản lý Form (Dùng chung cho cả Thêm và Sửa)
  const [formData, setFormData] = useState({ id: null, name: '', code: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');

  // Trạng thái cho Modal Xác nhận
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: '', // 'CONFIRM_SUBMIT', 'CONFIRM_DELETE'
    title: '',
    message: '',
    pendingData: null
  });

  const showToast = useCartStore((state) => state.showToast);

  // Hàm khởi tạo lấy danh sách danh mục từ hệ thống store
  const initCategories = async () => {
    try {
      setError(null);
      await fetchCategories();
    } catch (err) {
      setError("Không thể tải danh sách danh mục hệ thống.");
    }
  };

  useEffect(() => {
    initCategories();
  }, []);

  // Xử lý thay đổi dữ liệu input trong Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'code' ? value.toUpperCase().trim() : value
    });
    if (formError) setFormError('');
  };

  // Chọn một danh mục để tiến hành Sửa
  const handleEditClick = (category) => {
    setIsEditing(true);
    setFormError('');
    setFormData({
      id: category.id,
      name: category.name,
      code: category.code,
      description: category.description || ''
    });
  };

  // Hủy chế độ sửa, đưa form về trạng thái thêm mới trống rỗng
  const resetForm = () => {
    setIsEditing(false);
    setFormError('');
    setFormData({ id: null, name: '', code: '', description: '' });
  };

  // Chặn Submit Form để kiểm tra & mở Modal Xác nhận nếu đang cập nhật
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim()) {
      setFormError('Tên danh mục và Mã danh mục không được để trống!');
      return;
    }

    if (isEditing) {
      setConfirmModal({
        isOpen: true,
        type: 'CONFIRM_SUBMIT',
        title: 'Xác nhận cập nhật',
        message: `Bạn có chắc chắn muốn lưu các thay đổi cho danh mục nhóm "${formData.name}" không?`,
        pendingData: formData
      });
    } else {
      executeSaveCategory(formData);
    }
  };

  // Hàm thực thi lưu / cập nhật thông qua store actions
  const executeSaveCategory = async (dataToSave) => {
    try {
      let res;
      if (isEditing) {
        res = await updateCategory(dataToSave.id, dataToSave);
        if (res && res.success) {
          showToast('Cập nhật danh mục thành công!', 'success');
        } else {
          showToast(res?.message || 'Cập nhật danh mục thất bại.', 'error');
        }
      } else {
        res = await createCategory(dataToSave);
        if (res && res.success) {
          showToast('Thêm danh mục mới thành công!', 'success');
        } else {
          showToast(res?.message || 'Thêm danh mục mới thất bại.', 'error');
        }
      }
      resetForm();
      closeConfirmModal();
    } catch (err) {
      console.error("Lỗi xử lý danh mục:", err);
      setFormError('Đã xảy ra lỗi hệ thống, vui lòng thử lại.');
    }
  };

  // Kích hoạt Modal khi người dùng nhấn nút Xóa
  const handleOpenDeleteModal = (id, name) => {
    setConfirmModal({
      isOpen: true,
      type: 'CONFIRM_DELETE',
      title: 'Xóa danh mục vĩnh viễn',
      message: `Bạn có chắc chắn muốn xóa danh mục "${name}"? Tất cả các sản phẩm thuộc nhóm này có thể bị ảnh hưởng trực tiếp hệ thống.`,
      pendingData: { id, name }
    });
  };

  // Hàm thực thi tác vụ Xóa thông qua store action
  const executeDeleteCategory = async () => {
    const { id, name } = confirmModal.pendingData;
    try {
      const res = await deleteCategory(id);
      if (res && res.success) {
        showToast(`Xóa danh mục "${name}" thành công!`, 'success');
        if (isEditing && formData.id === id) resetForm();
      } else {
        showToast(res?.message || 'Không thể xóa danh mục này (ràng buộc dữ liệu sản phẩm tồn tại).', 'error');
      }
      closeConfirmModal();
    } catch (err) {
      console.error("Lỗi khi xóa danh mục:", err);
      showToast('Đã xảy ra lỗi hệ thống khi xóa danh mục.', 'error');
      closeConfirmModal();
    }
  };

  // Hàm điều hướng phân giải nút "Đồng ý" của ConfirmModal
  const handleConfirmAction = () => {
    switch (confirmModal.type) {
      case 'CONFIRM_SUBMIT':
        executeSaveCategory(confirmModal.pendingData);
        break;
      case 'CONFIRM_DELETE':
        executeDeleteCategory();
        break;
      default:
        closeConfirmModal();
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, type: '', title: '', message: '', pendingData: null });
  };

  // Lọc danh mục theo từ khóa tìm kiếm trực tiếp từ dữ liệu store
  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && categories.length === 0) {
    return <div className="flex h-[60vh] items-center justify-center"><Loading size="large" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center space-y-4 text-center p-6">
        <div className="p-4 bg-red-50 text-red-500 rounded-full"><AlertCircle size={40} /></div>
        <p className="text-gray-600 font-medium">{error}</p>
        <button onClick={initCategories} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-sm hover:bg-opacity-90">
          <RefreshCw size={16} /> Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Tiêu đề & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          <span>Quản lý Shop</span><ChevronRight size={12} /><span className="text-orange-500">Danh mục</span>
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">DANH MỤC SẢN PHẨM</h1>
      </div>

      {/* Grid Layout chia hai khu vực */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* KHÔNG GIAN BÊN TRÁI: FORM TÁC VỤ (Thêm / Sửa) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-6">
          <div className="flex items-center gap-2 text-base font-black text-slate-800 border-b border-gray-100 pb-3 mb-4 uppercase tracking-wide">
            <FolderPlus size={18} className="text-orange-500" />
            {isEditing ? "Cập nhật danh mục" : "Thêm danh mục mới"}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ví dụ: Thức ăn hạt, Đồ chơi..."
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
                Mã danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                disabled={isEditing}
                placeholder="Ví dụ: THUC_AN, DO_CHOI"
                className={`w-full px-3 py-2.5 border rounded-xl text-sm font-mono focus:outline-none transition-all text-gray-700 ${
                  isEditing 
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-50 border-gray-200 focus:border-orange-500 focus:bg-white'
                }`}
              />
              {!isEditing && <p className="text-[10px] text-gray-400 mt-1 font-medium">Mã viết hoa liền, dùng để phân loại logic hệ thống.</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Mô tả chi tiết</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Nhập vài dòng mô tả nhóm sản phẩm này..."
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-700 resize-none"
              ></textarea>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className={`flex-1 py-2.5 text-white font-bold rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm ${
                  isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-500 hover:bg-opacity-90'
                }`}
              >
                <CheckCircle size={16} />
                {isEditing ? "Cập nhật" : "Tạo danh mục"}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-xl text-sm transition-all"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* KHÔNG GIAN BÊN PHẢI: BẢNG DANH SÁCH DANH MỤC ĐANG CÓ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
          
          {/* Thanh tìm kiếm đầu bảng */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Tìm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-slate-700 transition-all text-gray-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-50/70 text-gray-400 text-xs uppercase font-black tracking-wider border-b border-gray-100">
                  <th className="p-4 w-12 text-center">STT</th>
                  <th className="p-4">Tên danh mục</th>
                  <th className="p-4">Mã hệ thống</th>
                  <th className="p-4 hidden md:table-cell">Mô tả</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-400 font-medium">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Layers size={32} className="text-gray-300" />
                        <span>Không tìm thấy danh mục nào phù hợp.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category, index) => {
                    const isRowEditing = formData.id === category.id;
                    return (
                      <tr 
                        key={category.id} 
                        className={`transition-colors group ${isRowEditing ? 'bg-orange-50/40 hover:bg-orange-50/50' : 'hover:bg-gray-50/50'}`}
                      >
                        <td className="p-4 text-center font-mono text-xs text-gray-400">{index + 1}</td>
                        <td className="p-4">
                          <div className={`font-bold text-base transition-colors ${isRowEditing ? 'text-orange-500' : 'text-gray-800'}`}>
                            {category.name}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                            {category.code}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-gray-400 max-w-xs truncate hidden md:table-cell">
                          {category.description || <i className="text-gray-300">Không có mô tả</i>}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              title="Sửa danh mục"
                              onClick={() => handleEditClick(category)}
                              className={`p-2 rounded-xl border transition-all active:scale-90 ${
                                isRowEditing
                                  ? 'text-orange-500 bg-orange-100 border-orange-200'
                                  : 'text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200'
                              }`}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              title="Xóa danh mục"
                              onClick={() => handleOpenDeleteModal(category.id, category.name)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-all active:scale-90"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50/50 px-4 py-2.5 border-t border-gray-100 text-[11px] text-gray-400 font-bold">
            Tổng cộng: {filteredCategories.length} danh mục
          </div>
        </div>

      </div>

      {/* Component điều hướng xử lý xác nhận từ store */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type === 'CONFIRM_DELETE' ? 'danger' : 'warning'}
      />
    </div>
  );
};

export default CategoryManagement;