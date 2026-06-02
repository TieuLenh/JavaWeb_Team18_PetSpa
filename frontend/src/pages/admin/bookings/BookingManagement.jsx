import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  User,
  Scissors,
  Edit2
} from 'lucide-react';
import Loading from '../../../components/common/Loading';
import { formatPrice } from '../../../utils/formatPrice';
import Modal from '../../../components/common/Modal'; 
import ConfirmModal from '../../../components/common/ConfirmModal';
import { useCartStore } from '../../../store/cartStore';
import { useBookingStore } from '../../../store/bookingStore'; // Tận dụng store được cung cấp
import BookingFormAdmin from '../../../components/form/BookingFormAdmin';
import { STATUS_FILTERS, BOOKING_STATUS } from '../../../utils/constants';

const BookingManagement = () => {
  // --- TẬN DỤNG TRẠNG THÁI VÀ ACTIONS TỪ ZUSTAND STORE ---
  const bookings = useBookingStore((state) => state.bookings);
  const loading = useBookingStore((state) => state.loading);
  const errorStore = useBookingStore((state) => state.error);
  const fetchBookings = useBookingStore((state) => state.fetchBookings);
  const createBooking = useBookingStore((state) => state.createBooking);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  // Giữ lại Zustand Store setter cục bộ để cập nhật giao diện nhanh khi sửa đổi thông tin 
  // (Cho các hàm chưa được viết sẵn API riêng biệt trong file store gốc)
  const setStoreState = useBookingStore.setState;

  // Tìm kiếm & Lọc lịch đặt
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Trạng thái điều khiển Modal Form chính
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('CREATE'); 
  const [selectedBooking, setSelectedBooking] = useState(null);

  // --- CÁC TRẠNG THÁI CHO MODAL XÁC NHẬN ---
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: '', // 'CANCEL_FORM', 'CONFIRM_STATUS_UPDATE', 'CONFIRM_CANCEL_BOOKING', 'CONFIRM_SAVE_FORM'
    title: '',
    message: '',
    pendingData: null
  });

  const showToast = useCartStore((state) => state.showToast);

  const statusFilters = STATUS_FILTERS;

  // Gọi API lấy danh sách qua Store khi mount component
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleOpenCreateModal = () => {
    setModalType('CREATE');
    setSelectedBooking(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (booking) => {
    setModalType('EDIT');
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Nhận dữ liệu trích xuất từ BookingForm đẩy lên
  const handleFormSubmit = (formOutputData) => {
    setConfirmModal({
      isOpen: true,
      type: 'CONFIRM_SAVE_FORM',
      title: modalType === 'CREATE' ? 'Xác nhận thêm lịch đặt' : 'Xác nhận cập nhật thông tin',
      message: modalType === 'CREATE' 
        ? 'Bạn có chắc chắn muốn tạo lịch hẹn dịch vụ mới này không?' 
        : `Bạn có chắc chắn muốn lưu lại toàn bộ thay đổi cho lịch hẹn #${selectedBooking?.id} không?`,
      pendingData: formOutputData
    });
  };

  // Thực thi cập nhật hoặc tạo mới vào State/DB sau khi bấm xác nhận ở ConfirmModal
  const executeSaveBooking = async () => {
    const formData = confirmModal.pendingData;
    try {
      if (modalType === 'CREATE') {
        const res = await createBooking(formData);
        if (res && res.success !== false) {
          showToast('Tạo mới lịch hẹn đặt dịch vụ thành công!', 'success');
        } else {
          showToast(res?.message || 'Gặp sự cố khi tạo lịch hẹn.', 'error');
        }
      } else {
        // Cập nhật bản ghi hiện tại dựa theo ID trực tiếp vào Zustand Store danh sách tổng
        setStoreState((state) => ({
          bookings: state.bookings.map(b => b.id === selectedBooking.id ? { ...b, ...formData } : b)
        }));
        showToast(`Cập nhật thông tin lịch hẹn #${selectedBooking.id} thành công!`, 'success');
      }
      setIsModalOpen(false);
      closeConfirmModal();
    } catch (err) {
      console.error("Lỗi khi xử lý lưu dữ liệu form:", err);
      showToast('Đã xảy ra lỗi, không thể lưu dữ liệu.', 'error');
    }
  };

  // Thay đổi trạng thái nhanh ngoài danh sách bảng (Ví dụ: Click nút duyệt nhanh CONFIRMED)
  const handleStatusChangeClick = (bookingId, currentCustomer, targetStatus) => {
    setConfirmModal({
      isOpen: true,
      type: 'CONFIRM_STATUS_UPDATE',
      title: 'Xác nhận cập nhật trạng thái',
      message: `Bạn có chắc chắn muốn chuyển trạng thái lịch hẹn của khách hàng "${currentCustomer}" sang [${targetStatus}] không?`,
      pendingData: { id: bookingId, status: targetStatus, customerName: currentCustomer }
    });
  };

  const executeUpdateStatus = async () => {
    const { id, status, customerName } = confirmModal.pendingData;
    try {
      // Cập nhật trạng thái Client-side trong mảng bookings của Store toàn cục
      setStoreState((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status: status } : b)
      }));
      showToast(`Cập nhật trạng thái lịch hẹn của ${customerName} thành công!`, 'success');
      closeConfirmModal();
    } catch (err) {
      console.error("Gặp lỗi khi xử lý cập nhật trạng thái:", err);
      showToast('Đã xảy ra lỗi hệ thống.', 'error');
    }
  };

  // Xử lý hủy lịch hẹn vĩnh viễn thông qua Store action
  const handleConfirmCancelBooking = (bookingId, customerName) => {
    setConfirmModal({
      isOpen: true,
      type: 'CONFIRM_CANCEL_BOOKING',
      title: 'Hủy lịch hẹn vĩnh viễn',
      message: `Hành động này sẽ hủy bỏ lịch đặt dịch vụ của khách hàng "${customerName}". Bạn có chắc chắn muốn tiếp tục?`,
      pendingData: { id: bookingId, name: customerName }
    });
  };

  const executeCancelBooking = async () => {
    const { id, name } = confirmModal.pendingData;
    try {
      const res = await cancelBooking(id);
      if (res && res.success) {
        showToast(`Đã hủy lịch hẹn của khách hàng "${name}" thành công!`, 'success');
      } else {
        showToast(res?.message || 'Xảy ra lỗi khi tiến hành hủy lịch.', 'error');
      }
      closeConfirmModal();
    } catch (err) {
      console.error("Lỗi khi hủy lịch:", err);
      showToast('Đã xảy ra lỗi khi tiến hành hủy lịch.', 'error');
    }
  };

  // Điều phối hành động khi bấm nút "Đồng ý" trên ConfirmModal
  const handleConfirmAction = () => {
    switch (confirmModal.type) {
      case 'CANCEL_FORM':
        setIsModalOpen(false); 
        closeConfirmModal();
        break;
      case 'CONFIRM_SAVE_FORM':
        executeSaveBooking();
        break;
      case 'CONFIRM_STATUS_UPDATE':
        executeUpdateStatus(); 
        break;
      case 'CONFIRM_CANCEL_BOOKING':
        executeCancelBooking(); 
        break;
      default:
        closeConfirmModal();
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, type: '', title: '', message: '', pendingData: null });
  };

  const handleCancelForm = () => {
    setConfirmModal({
      isOpen: true,
      type: 'CANCEL_FORM',
      title: 'Hủy bỏ thao tác?',
      message: 'Những thay đổi bạn vừa nhập trên Form sẽ không được lưu. Bạn vẫn muốn thoát chứ?',
      pendingData: null
    });
  };

  // Bộ lọc dữ liệu bảng trích xuất từ dữ liệu Store toàn cục
  const filteredBookings = bookings.filter(booking => {
    const searchString = searchTerm.trim().toLowerCase();
    const matchesSearch = !searchString ? true : (
      (booking.customer?.full_name && String(booking.customer.full_name).toLowerCase().includes(searchString)) ||
      (booking.pet?.name && String(booking.pet.name).toLowerCase().includes(searchString)) ||
      (booking.id && String(booking.id).toLowerCase().includes(searchString))
    );
    
    return matchesSearch && (selectedStatus === 'ALL' || booking.status === selectedStatus);
  });

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'CONFIRMED':
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Đã xác nhận</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">Chờ xử lý</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Đã hoàn thành</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">Đã hủy</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">{status}</span>;
    }
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loading size="large" /></div>;
  if (errorStore) return <div className="text-center p-6 text-red-500">{errorStore}</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <span>Quản lý Shop</span><ChevronRight size={12} /><span className="text-orange-500">Đặt lịch dịch vụ</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">DANH SÁCH ĐẶT LỊCH</h1>
        </div>
        <button onClick={handleOpenCreateModal} className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-md hover:bg-opacity-90 active:scale-95 transition-all">
          <Plus size={18} /> Đặt lịch mới
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Search size={18} /></span>
          <input type="text" placeholder="Tìm theo tên khách, thú cưng hoặc mã..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 text-gray-700" />
        </div>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full sm:w-52 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:outline-none">
          {statusFilters.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
        </select>
      </div>

      {/* Table list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-black tracking-wider border-b border-gray-100">
                <th className="p-4 w-16 text-center">Mã</th>
                <th className="p-4">Khách hàng & Thú cưng</th>
                <th className="p-4">Chi tiết dịch vụ</th>
                <th className="p-4">Thời gian đặt</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-400"><Calendar size={36} className="mx-auto mb-2 text-gray-300" />Không tìm thấy lịch đặt nào phù hợp.</td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 text-center font-bold text-blue-600 font-mono text-xs">
                      #{booking.id}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800 text-base flex items-center gap-1.5">
                        <User size={14} className="text-gray-400" />
                        {booking.customer?.full_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Thú cưng: <span className="font-bold text-orange-500">{booking.pet?.name}</span> ({booking.pet?.breed})
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {booking.services?.map((service, index) => (
                          <div key={index} className="text-xs bg-gray-50 border px-2 py-0.5 rounded-md inline-block mr-1 text-gray-700 font-medium">
                            {service.name}
                          </div>
                        ))}
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Scissors size={12} /> Nhân viên: <span className="font-semibold text-gray-600">{booking.groomer?.full_name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800 flex items-center gap-1"><Clock size={14} className="text-gray-400" />{booking.start_time} - {booking.end_time}</div>
                      <div className="text-xs font-semibold text-gray-400 mt-0.5">{booking.booking_date} ({booking.duration_minutes} phút)</div>
                    </td>
                    <td className="p-4 font-black text-gray-900 text-base">{formatPrice(booking.total_amount)}</td>
                    <td className="p-4 text-center">
                      {renderStatusBadge(booking.status)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Nút chỉnh sửa toàn bộ thông tin */}
                        <button 
                          onClick={() => handleOpenEditModal(booking)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-200 transition-all"
                          title="Chỉnh sửa chi tiết"
                        >
                          <Edit2 size={16} />
                        </button>

                        {booking.status === 'PENDING' && (
                          <button 
                            onClick={() => handleStatusChangeClick(booking.id, booking.customer?.full_name, 'CONFIRMED')} 
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl border border-transparent hover:border-emerald-200 transition-all"
                            title="Xác nhận lịch hẹn"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {booking.status !== 'CANCELLED' && (
                          <button 
                            onClick={() => handleConfirmCancelBooking(booking.id, booking.customer?.full_name)} 
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-all"
                            title="Hủy lịch đặt"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: BẢNG LUỒNG FORM CHÍNH ĐẶT LỊCH */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCancelForm} 
        title={modalType === 'CREATE' ? 'Tạo lượt đặt lịch hẹn dịch vụ Spa' : `Chỉnh sửa thông tin chi tiết lịch hẹn #${selectedBooking?.id}`}
        size='lg'
      >
        <BookingFormAdmin
          initialData={selectedBooking}
          onSubmit={handleFormSubmit}
          onClose={handleCancelForm}
        />
      </Modal>

      {/* MODAL 2: DÙNG CONFIRM_MODAL CHO CÁC THAO TÁC XÁC THỰC LUỒNG DỮ LIỆU */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type === 'CONFIRM_CANCEL_BOOKING' ? 'danger' : 'warning'}
      />
    </div>
  );
};

export default BookingManagement;