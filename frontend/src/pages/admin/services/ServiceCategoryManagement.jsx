import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, AlertCircle, RefreshCw, Layers, ChevronRight, FolderPlus, CheckCircle, X 
} from 'lucide-react';
import Loading from '../../../components/common/Loading';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { useCartStore } from '../../../store/cartStore';
import { useServiceStore } from '../../../store/serviceStore'; // ◄ Import Zustand Store thay thế Service cũ

const ServiceCategoryManagement = () => {
  // Lấy toàn bộ State và Actions cần thiết từ useServiceStore
  const categories = useServiceStore((state) => state.categories);
  const loadingCategories = useServiceStore((state) => state.loadingCategories);
  const submitting = useServiceStore((state) => state.submitting);
  
  const fetchServiceCategories = useServiceStore((state) => state.fetchServiceCategories);
  const createServiceCategory = useServiceStore((state) => state.createServiceCategory);
  const updateServiceCategory = useServiceStore((state) => state.updateServiceCategory);
  const deleteServiceCategory = useServiceStore((state) => state.deleteServiceCategory);

  // Quản lý state lỗi hiển thị (Local UI error)
  const [globalError, setGlobalError] = useState(null);
  const [formError, setFormError] = useState('');
  
  // Quản lý các State điều hướng UI cục bộ
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ id: null, name: '', slug: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', title: '', message: '', pendingData: null });
  const showToast = useCartStore((state) => state.showToast);

  // Bọc hàm fetch danh mục từ store để bắt lỗi giao diện nếu có
  const loadCategoriesData = async () => {
    try {
      setGlobalError(null);
      await fetchServiceCategories();
    } catch (err) {
      setGlobalError("Không thể tải danh mục dịch vụ hệ thống.");
    }
  };

  useEffect(() => { 
    loadCategoriesData(); 
  }, [fetchServiceCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      slug: name === 'name' ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : formData.slug
    });
    if (formError) setFormError('');
  };

  const handleEditClick = (category) => {
    setIsEditing(true);
    setFormError('');
    setFormData({ id: category.id, name: category.name, slug: category.slug, description: category.description || '' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormError('');
    setFormData({ id: null, name: '', slug: '', description: '' });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Tên danh mục dịch vụ không được bỏ trống!');
      return;
    }

    if (isEditing) {
      setConfirmModal({
        isOpen: true,
        type: 'CONFIRM_SUBMIT',
        title: 'Xác nhận cập nhật',
        message: `Bạn muốn lưu thay đổi cho danh mục dịch vụ "${formData.name}"?`,
        pendingData: formData
      });
    } else {
      executeSaveCategory(formData);
    }
  };

  const executeSaveCategory = async (dataToSave) => {
    try {
      let res;
      if (isEditing) {
        res = await updateServiceCategory(dataToSave.id, dataToSave);
        if (res && (res.success || !res.error)) {
          showToast('Cập nhật danh mục dịch vụ thành công!', 'success');
        } else {
          throw new Error(res?.message || 'Không thể cập nhật danh mục.');
        }
      } else {
        res = await createServiceCategory(dataToSave);
        if (res && (res.success || !res.error)) {
          showToast('Thêm danh mục dịch vụ mới thành công!', 'success');
        } else {
          throw new Error(res?.message || 'Không thể tạo danh mục mới.');
        }
      }
      resetForm();
      closeConfirmModal();
    } catch (err) {
      setFormError(err.message || 'Hệ thống gặp sự cố, vui lòng thử lại.');
    }
  };

  const handleOpenDeleteModal = (id, name) => {
    setConfirmModal({
      isOpen: true,
      type: 'CONFIRM_DELETE',
      title: 'Xóa danh mục dịch vụ',
      message: `Bạn có chắc chắn muốn xóa nhóm "${name}"? Các gói dịch vụ nhỏ bên trong có thể mất đi liên kết phân loại.`,
      pendingData: { id, name }
    });
  };

  const executeDeleteCategory = async () => {
    const { id, name } = confirmModal.pendingData;
    try {
      const res = await deleteServiceCategory(id);
      if (res && (res.success || !res.error)) {
        showToast(`Xóa danh mục dịch vụ "${name}" thành công!`, 'success');
        if (isEditing && formData.id === id) resetForm();
        closeConfirmModal();
      } else {
        throw new Error(res?.message);
      }
    } catch (err) {
      showToast(err.message || 'Không thể xóa danh mục này.', 'error');
      closeConfirmModal();
    }
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === 'CONFIRM_SUBMIT') executeSaveCategory(confirmModal.pendingData);
    if (confirmModal.type === 'CONFIRM_DELETE') executeDeleteCategory();
  };

  const closeConfirmModal = () => setConfirmModal({ isOpen: false, type: '', title: '', message: '', pendingData: null });

  // Bộ lọc tìm kiếm Client-side kết nối trực tiếp mảng categories của Zustand Store
  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingCategories && categories.length === 0) {
    return <div className="flex h-[60vh] items-center justify-center"><Loading size="large" /></div>;
  }
  
  if (globalError) return (
    <div className="flex flex-col h-[50vh] items-center justify-center space-y-4 text-center p-6">
      <div className="p-4 bg-red-50 text-red-500 rounded-full"><AlertCircle size={40} /></div>
      <p className="text-gray-600 font-medium">{globalError}</p>
      <button onClick={loadCategoriesData} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold"><RefreshCw size={16} /> Thử lại</button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          <span>Quản lý Spa</span><ChevronRight size={12} /><span className="text-orange-500">Danh Mục Dịch Vụ</span>
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">DANH MỤC DỊCH VỤ</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* TRÁI: FORM */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-6">
          <div className="flex items-center gap-2 text-base font-black text-slate-800 border-b border-gray-100 pb-3 mb-4 uppercase tracking-wide">
            <FolderPlus size={18} className="text-orange-500" />
            {isEditing ? "Cập nhật danh mục" : "Tạo danh mục mới"}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={14} /><span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Tên danh mục dịch vụ *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={submitting} placeholder="Ví dụ: Khách sạn Thú Cưng..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 text-gray-700 disabled:opacity-60" />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Đường dẫn tĩnh (Slug)</label>
              <input type="text" name="slug" value={formData.slug} readOnly className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-mono text-gray-400 cursor-not-allowed outline-none" />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Mô tả ngắn</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} disabled={submitting} rows="3" placeholder="Mô tả nhóm dịch vụ này để khách hàng dễ hiểu..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 text-gray-700 resize-none disabled:opacity-60"></textarea>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={submitting} className={`flex-1 py-2.5 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-500 hover:bg-opacity-90'}`}>
                {submitting ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                {isEditing ? "Cập nhật" : "Tạo danh mục"}
              </button>
              {isEditing && <button type="button" onClick={resetForm} disabled={submitting} className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-xl text-sm disabled:opacity-50"><X size={16} /></button>}
            </div>
          </form>
        </div>

        {/* PHẢI: BẢNG DANH SÁCH */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Search size={16} /></span>
              <input type="text" placeholder="Tìm kiếm danh mục..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-slate-700 text-gray-700" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-50/70 text-gray-400 text-xs uppercase font-black border-b border-gray-100">
                  <th className="p-4 w-12 text-center">STT</th>
                  <th className="p-4">Tên danh mục</th>
                  <th className="p-4">Số lượng gói dịch vụ</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-400 font-medium">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Layers size={32} className="text-gray-300" />
                        <span>Không tìm thấy dữ liệu nhóm dịch vụ.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category, index) => {
                    const isRowEditing = formData.id === category.id;
                    return (
                      <tr key={category.id} className={`transition-colors group ${isRowEditing ? 'bg-orange-50/40' : 'hover:bg-gray-50/50'}`}>
                        <td className="p-4 text-center font-mono text-xs text-gray-400">{index + 1}</td>
                        <td className="p-4">
                          <div className={`font-bold transition-colors text-base ${isRowEditing ? 'text-orange-500' : 'text-gray-800'}`}>{category.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{category.slug}</div>
                        </td>
                        <td className="p-4 font-mono text-xs font-bold text-gray-500">
                          <span className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md text-slate-700">
                            {category.service_count || 0} gói
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button type="button" disabled={submitting} onClick={() => handleEditClick(category)} className={`p-2 rounded-xl border transition-all ${isRowEditing ? 'text-orange-500 bg-orange-100 border-orange-200' : 'text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200'}`}><Edit2 size={14} /></button>
                            <button type="button" disabled={submitting} onClick={() => handleOpenDeleteModal(category.id, category.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 disabled:opacity-40"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen} onClose={closeConfirmModal} onConfirm={handleConfirmAction}
        title={confirmModal.title} message={confirmModal.message}
        type={confirmModal.type === 'CONFIRM_DELETE' ? 'danger' : 'warning'}
      />
    </div>
  );
};

export default ServiceCategoryManagement;