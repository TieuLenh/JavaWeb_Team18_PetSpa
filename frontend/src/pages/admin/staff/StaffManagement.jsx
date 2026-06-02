import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight,
  Eye,
  User,
  Briefcase,
  Calendar,
  CreditCard,
  DollarSign,
  Plus,
  Mail,
  Phone,
  Package,
  Award,
  Clock,
  Star
} from 'lucide-react';
import Loading from '../../../components/common/Loading';
import { formatPrice } from '../../../utils/formatPrice'; 
import { formatDate } from '../../../utils/formatDate';   
import Modal from '../../../components/common/Modal'; 
import ConfirmModal from '../../../components/common/ConfirmModal';
import { useCartStore } from '../../../store/cartStore'; 
import { useStaffStore } from '../../../store/staffStore';
import StaffFormAdmin from '../../../components/form/StaffFormAdmin';
import { STATUS_OPTIONS } from '../../../utils/constants';

const StaffManagement = () => {
  // Kết nối các State và Actions từ useStaffStore
  const staffsFromStore = useStaffStore((state) => state.staffs);
  const loading = useStaffStore((state) => state.loading);
  const fetchStaffs = useStaffStore((state) => state.fetchStaffs);
  const createStaff = useStaffStore((state) => state.createStaff);
  const updateStaff = useStaffStore((state) => state.updateStaff);
  const deleteStaff = useStaffStore((state) => state.deleteStaff);

  // Các State cục bộ cho UI điều hướng
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [normalizedStaffs, setNormalizedStaffs] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('VIEW'); 
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: '', 
    title: '',
    message: '',
    pendingData: null
  });

  const showToast = useCartStore((state) => state.showToast);

  const statusOptions = STATUS_OPTIONS;

  // Kích hoạt lấy dữ liệu khi component mount
  useEffect(() => {
    fetchStaffs();
  }, [fetchStaffs]);

  // Chuẩn hóa dữ liệu ngay khi dữ liệu từ mảng gốc của Store thay đổi
  useEffect(() => {
    if (staffsFromStore) {
      const normalized = staffsFromStore.map(item => ({
        id: item.id,
        staff_code: item.staff_code || item.code || `STF-${item.id}`,
        full_name: item.full_name || item.fullName || item.name || 'N/A',
        email: item.email || item.account?.email || 'N/A',
        phone: item.phone || item.account?.phone || 'N/A',
        role: item.role || item.account?.role?.name || 'Kỹ thuật viên',
        status: item.status || 'ACTIVE',
        base_salary: Number(item.base_salary || item.salary || 0),
        allowance: Number(item.allowance || 0),
        joined_at: item.joined_at || item.createdAt || new Date().toISOString().split('T')[0],
        experience_years: Number(item.experience_years || 0),
        specialties: Array.isArray(item.specialties) ? item.specialties : [],
        rating: Number(item.rating || 0),
        total_reviews: Number(item.total_reviews || 0),
        working_hours: item.working_hours || { start: "08:00", end: "17:00" }
      }));
      setNormalizedStaffs(normalized);
    }
  }, [staffsFromStore]);

  const handleOpenCreateModal = () => {
    setModalType('CREATE');
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff) => {
    setModalType('EDIT');
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (staff) => {
    setModalType('VIEW');
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formOutputData) => {
    if (modalType === 'EDIT') {
      setConfirmModal({
        isOpen: true,
        type: 'CONFIRM_UPDATE',
        title: 'Cập nhật hồ sơ nhân viên',
        message: `Hành động này sẽ cập nhật thông tin dữ liệu của nhân viên ${formOutputData.staff_code || ''}. Bạn chắc chắn chứ?`,
        pendingData: formOutputData
      });
    } else {
      executeSaveStaff(formOutputData);
    }
  };

  const executeSaveStaff = async (formOutputData) => {
    try {
      const mappedPayload = {
        staff_code: formOutputData.staff_code,
        full_name: formOutputData.full_name,
        email: formOutputData.email,
        phone: formOutputData.phone,
        role: formOutputData.role,
        status: formOutputData.status,
        base_salary: Number(formOutputData.base_salary || 0),
        allowance: Number(formOutputData.allowance || 0),
        joined_at: selectedStaff?.joined_at || formOutputData.joined_at || new Date().toISOString().split('T')[0],
        experience_years: Number(formOutputData.experience_years || 0),
        specialties: formOutputData.specialties || [],
        rating: Number(formOutputData.rating || 0),
        total_reviews: Number(formOutputData.total_reviews || 0),
        working_hours: formOutputData.working_hours || { start: "08:00", end: "17:00" }
      };

      if (modalType === 'CREATE') {
        const res = await createStaff(mappedPayload);
        if (res?.success) {
          showToast('Thêm nhân viên mới thành công!', 'success');
        } else {
          throw new Error(res?.error);
        }
      } else {
        const res = await updateStaff(selectedStaff.id, mappedPayload);
        if (res?.success) {
          showToast(`Đã lưu thay đổi cho nhân viên ${formOutputData.full_name}!`, 'success');
        } else {
          throw new Error(res?.error);
        }
      }

      setIsModalOpen(false);
      closeConfirmModal();
    } catch (err) {
      console.error(err);
      showToast(err?.message || 'Gặp sự cố khi lưu thông tin nhân viên.', 'error');
    }
  };

  const handleCancelForm = () => {
    if (modalType === 'VIEW') {
      setIsModalOpen(false);
      return;
    }
    setConfirmModal({
      isOpen: true,
      type: 'CANCEL_FORM',
      title: 'Rời khỏi trang nhập?',
      message: 'Các trường thông tin vừa thay đổi sẽ biến mất nếu bạn chưa lưu.',
      pendingData: null
    });
  };

  const handleConfirmDelete = (staffId, staffCode, fullName) => {
    setConfirmModal({
      isOpen: true,
      type: 'CONFIRM_DELETE',
      title: 'Xóa nhân viên vĩnh viễn',
      message: `Hành động này sẽ xóa bỏ hoàn toàn nhân viên [${fullName}] (${staffCode}) ra khỏi hệ thống quản lý.`,
      pendingData: { id: staffId, code: staffCode, name: fullName }
    });
  };

  const executeDeleteStaff = async () => {
    const { id, name } = confirmModal.pendingData;
    try {
      const res = await deleteStaff(id);
      if (res?.success) {
        showToast(`Đã xóa nhân viên ${name} thành công`, 'success');
        closeConfirmModal();
      } else {
        throw new Error(res?.error);
      }
    } catch (err) {
      showToast(err?.message || 'Xảy ra lỗi khi thực thi xóa.', 'error');
    }
  };

  const handleConfirmAction = () => {
    switch (confirmModal.type) {
      case 'CANCEL_FORM':
        setIsModalOpen(false);
        closeConfirmModal();
        break;
      case 'CONFIRM_UPDATE':
        executeSaveStaff(confirmModal.pendingData);
        break;
      case 'CONFIRM_DELETE':
        executeDeleteStaff();
        break;
      default:
        closeConfirmModal();
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, type: '', title: '', message: '', pendingData: null });
  };

  // Logic filter tìm kiếm dựa trên local state trung gian đã chuẩn hóa
  const filteredStaffs = normalizedStaffs.filter(staff => {
    const searchString = searchTerm.trim().toLowerCase();
    const matchesSearch = !searchString ? true : (
      (staff.staff_code && String(staff.staff_code).toLowerCase().includes(searchString)) ||
      (staff.full_name && String(staff.full_name).toLowerCase().includes(searchString)) ||
      (staff.email && String(staff.email).toLowerCase().includes(searchString)) ||
      (staff.phone && String(staff.phone).includes(searchString))
    );
    const matchesStatus = selectedStatus === 'ALL' || staff.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading && normalizedStaffs.length === 0) {
    return <div className="flex h-[60vh] items-center justify-center"><Loading size="large" /></div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <span>Quản lý hệ thống</span><ChevronRight size={12} /><span className="text-orange-500">Nhân viên</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">QUẢN LÝ NHÂN VIÊN</h1>
        </div>
        <button onClick={handleOpenCreateModal} className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-md hover:bg-opacity-90 active:scale-95 transition-all">
          <Plus size={18} /> Thêm nhân viên mới
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Search size={18} /></span>
          <input 
            type="text" 
            placeholder="Tìm theo mã, họ tên, email, sđt..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 text-gray-700" 
          />
        </div>
        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)} 
          className="w-full sm:w-56 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:outline-none"
        >
          {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {/* Table list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-black tracking-wider border-b border-gray-100">
                <th className="p-4 w-44">Mã nhân viên</th>
                <th className="p-4">Họ và tên</th>
                <th className="p-4">Vị trí & Kinh nghiệm</th>
                <th className="p-4">Mức lương (Cơ bản + Phụ cấp)</th>
                <th className="p-4 text-center">Đánh giá</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStaffs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-400">
                    <Package size={36} className="mx-auto mb-2 text-gray-300" />
                    Không tìm thấy dữ liệu nhân viên nào trùng khớp.
                  </td>
                </tr>
              ) : (
                filteredStaffs.map((staff) => {
                  const matchedStatus = statusOptions.find(s => s.value === staff.status);
                  const totalSalary = (staff.base_salary || 0) + (staff.allowance || 0);
                  return (
                    <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="text-xs font-mono text-gray-400 mb-0.5">{formatDate(staff.joined_at)}</div>
                        <div className="font-bold text-blue-600 font-mono tracking-tight text-sm">{staff.staff_code}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800 text-base flex items-center gap-1.5">
                          <User size={14} className="text-gray-400" /> {staff.full_name}
                        </div>
                        <div className="text-xs text-gray-400 flex flex-col gap-0.5 mt-1">
                          <span className="flex items-center gap-1"><Mail size={12} /> {staff.email}</span>
                          <span className="flex items-center gap-1"><Phone size={12} /> {staff.phone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700 text-sm flex items-center gap-1">
                          <Briefcase size={14} className="text-gray-400" /> {staff.role}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Award size={12} className="text-orange-400" /> {staff.experience_years} năm kinh nghiệm
                        </div>
                        {staff.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 max-w-xs">
                            {staff.specialties.map((spec, index) => (
                              <span key={index} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock size={12} /> Ca: {staff.working_hours?.start} - {staff.working_hours?.end}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-black text-gray-900 text-base">{formatPrice(totalSalary)}</div>
                        <div className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded w-max mt-1 bg-slate-100 text-slate-500">
                          Gốc: {formatPrice(staff.base_salary)} • PC: {formatPrice(staff.allowance)}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-sm">
                          <Star size={14} fill="currentColor" /> {staff.rating?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">({staff.total_reviews || 0} đánh giá)</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full ${matchedStatus?.color || 'bg-gray-100'}`}>
                          {matchedStatus?.label || 'Không rõ'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleOpenViewModal(staff)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl border border-transparent transition-all" title="Xem chi tiết">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleOpenEditModal(staff)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-200 transition-all" title="Sửa thông tin">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleConfirmDelete(staff.id, staff.staff_code, staff.full_name)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-all" title="Xóa nhân sự">
                            <Trash2 size={16} />
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
      </div>

      {/* MODAL LUỒNG FORM NHÂN VIÊN */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCancelForm} 
        title={modalType === 'CREATE' ? 'Thêm nhân sự mới thủ công' : modalType === 'EDIT' ? 'Cập nhật hồ sơ nhân viên' : 'Hồ sơ chi tiết nhân viên'}
        size='lg'
      >
        <StaffFormAdmin
          initialData={selectedStaff}
          onSubmit={handleFormSubmit}
          onClose={handleCancelForm}
          mode={modalType}
        />
      </Modal>

      {/* CONFIRM_MODAL ĐỒNG BỘ TRẢI NGHIỆM */}
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

export default StaffManagement;