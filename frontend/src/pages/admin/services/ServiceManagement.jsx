import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, AlertCircle, 
  RefreshCw, Scissors, ChevronRight, Clock, Star
} from 'lucide-react';
import Loading from '../../../components/common/Loading';
import ConfirmModal from '../../../components/common/ConfirmModal';
import ServiceFormAdmin from '../../../components/form/ServiceFormAdmin';
import { useCartStore } from '../../../store/cartStore';
import { useServiceStore } from '../../../store/serviceStore';

const ServiceManagement = () => {
  // ── Lấy các states và actions từ Zustand ──
  const {
    services,
    categories,
    loading,
    fetchServices,
    fetchServiceCategories,
    createService,
    updateService,
    deleteService
  } = useServiceStore();

  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, name: '' });
  const showToast = useCartStore((state) => state.showToast);

  // ── Fetch dữ liệu ban đầu bằng Store Actions ──
  const initData = async () => {
    try {
      setError(null);
      // Chạy song song fetch services và categories giống ban đầu
      await Promise.all([
        fetchServices(),
        fetchServiceCategories()
      ]);
    } catch (err) {
      setError("Không thể tải danh sách dữ liệu dịch vụ.");
    }
  };

  useEffect(() => {
    initData();
  }, []);

  // ── Mở modal Thêm mới ──
  const openAddModal = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  // ── Mở modal Chỉnh sửa ──
  const openEditModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // ── Xử lý Lưu (Thêm/Sửa) thông qua Store Actions ──
  const handleSaveService = async (formData) => {
    const isEdit = !!selectedService;
    let res;

    if (isEdit) {
      res = await updateService(selectedService.id, formData);
      if (res && res.success) {
        showToast('Cập nhật gói dịch vụ thành công!', 'success');
        setIsModalOpen(false);
      } else {
        showToast(res?.message || 'Cập nhật thất bại.', 'error');
      }
    } else {
      res = await createService(formData);
      if (res && res.success) {
        showToast('Thêm dịch vụ mới thành công!', 'success');
        setIsModalOpen(false);
      } else {
        showToast(res?.message || 'Thêm mới thất bại.', 'error');
      }
    }
  };

  // ── Xử lý Xóa thông qua Store Action ──
  const executeDelete = async () => {
    const res = await deleteService(confirmDelete.id);
    if (res && res.success) {
      showToast(`Xóa dịch vụ "${confirmDelete.name}" thành công!`, 'success');
    } else {
      // Bắt lỗi logic từ backend (Ví dụ: Dịch vụ đang được đặt lịch)
      showToast(res?.message || 'Xóa thất bại, dịch vụ đang có lịch đặt của khách.', 'error');
    }
    setConfirmDelete({ isOpen: false, id: null, name: '' });
  };

  // ── Bộ lọc hiển thị (Giữ nguyên logic từ services của store) ──
  const filteredServices = services.filter(s => {
    const matchSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || s.category?.id === Number(selectedCategory);
    return matchSearch && matchCat;
  });

  // ── Loading / Error states ──
  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loading size="large" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col h-[50vh] items-center justify-center space-y-4 text-center p-6">
      <div className="p-4 bg-red-50 text-red-500 rounded-full"><AlertCircle size={40} /></div>
      <p className="text-gray-600 font-medium">{error}</p>
      <button
        onClick={initData}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold"
      >
        <RefreshCw size={16} /> Thử lại
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <span>Quản lý Spa</span>
            <ChevronRight size={12} />
            <span className="text-orange-500">Gói Dịch Vụ</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">DANH SÁCH DỊCH VỤ</h1>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-opacity-90 text-white font-bold rounded-xl shadow-sm text-sm transition-all active:scale-95"
        >
          <Plus size={18} /> Thêm Dịch Vụ Mới
        </button>
      </div>

      {/* ── Thanh tìm kiếm & Lọc ── */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Tìm tên dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 text-gray-700"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-700 font-medium"
        >
          <option value="ALL">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* ── Bảng dữ liệu ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-50/70 text-gray-400 text-xs uppercase font-black border-b border-gray-100">
                <th className="p-4 w-12 text-center">STT</th>
                <th className="p-4">Tên dịch vụ</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Giá (VNĐ)</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Scissors size={32} className="text-gray-300" />
                      <span>Không tìm thấy gói dịch vụ nào phù hợp.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service, index) => (
                  <tr key={service.id} className="hover:bg-gray-50/50 transition-colors group">

                    {/* STT */}
                    <td className="p-4 text-center font-mono text-xs text-gray-400">
                      {index + 1}
                    </td>

                    {/* Tên dịch vụ */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {service.thumbnail && (
                          <img
                            src={service.thumbnail}
                            alt={service.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-800">{service.name}</span>
                            {service.is_featured && (
                              <Star size={13} className="text-amber-500 fill-amber-500" title="Dịch vụ nổi bật" />
                            )}
                          </div>
                          <div className="text-xs text-gray-400 max-w-xs truncate">{service.description}</div>
                          
                          {/* Đánh giá */}
                          {service.average_rating > 0 && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star size={11} className="text-amber-400 fill-amber-400" />
                              <span className="text-[11px] font-semibold text-amber-600">
                                {service.average_rating?.toFixed(1)}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                ({service.review_count?.toLocaleString()} đánh giá)
                              </span>
                            </div>
                          )}

                          {/* Tags loài phù hợp */}
                          <div className="flex gap-1 mt-1">
                            {service.suitable_for?.map(pet => (
                              <span
                                key={pet}
                                className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-medium border border-amber-100"
                              >
                                {pet === 'Dog' ? '🐶 Chó' : pet === 'Cat' ? '🐱 Mèo' : pet}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Danh mục */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-xs font-semibold">
                        {service.category?.name}
                      </span>
                    </td>

                    {/* Thời gian */}
                    <td className="p-4 font-medium text-gray-700">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        {service.duration_minutes} phút
                      </div>
                    </td>

                    {/* Giá tiền */}
                    <td className="p-4">
                      {service.discount_percent > 0 ? (
                        <div>
                          <div className="font-bold text-orange-500">
                            {service.final_price?.toLocaleString()}đ
                          </div>
                          <div className="text-xs text-gray-400 line-through">
                            {service.original_price?.toLocaleString()}đ
                          </div>
                          <span className="text-[10px] bg-red-50 text-red-500 border border-red-100 rounded px-1 font-bold">
                            -{service.discount_percent}%
                          </span>
                        </div>
                      ) : (
                        <div className="font-bold text-gray-800">
                          {(service.price || service.original_price)?.toLocaleString()}đ
                        </div>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          service.status === 'ACTIVE'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {service.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                        {service.booking_count > 0 && (
                          <div className="text-[11px] text-gray-400">
                            📅 {service.booking_count?.toLocaleString()} lượt đặt
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Hành động */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-200"
                          title="Sửa dịch vụ"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ isOpen: true, id: service.id, name: service.name })}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200"
                          title="Xóa dịch vụ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ServiceFormAdmin ── */}
      <ServiceFormAdmin
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
        serviceData={selectedService}
      />

      {/* ── Confirm xóa ── */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, name: '' })}
        onConfirm={executeDelete}
        title="Xóa dịch vụ cửa hàng"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn gói dịch vụ "${confirmDelete.name}"? Thao tác này không thể hoàn tác.`}
        type="danger"
      />

    </div>
  );
};

export default ServiceManagement;