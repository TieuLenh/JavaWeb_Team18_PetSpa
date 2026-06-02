import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  Package, 
  Layers, 
  ChevronRight
} from 'lucide-react';
import Loading from '../../../components/common/Loading';
import { formatPrice } from '../../../utils/formatPrice';
import ProductFormAdmin from '../../../components/form/ProductFormAdmin';
import Modal from '../../../components/common/Modal'; 
import ConfirmModal from '../../../components/common/ConfirmModal'; 
import { useCartStore } from '../../../store/cartStore';
import { useProductStore } from '../../../store/productStore';

const ProductManagement = () => {
  // ── Store: products ──
  const products      = useProductStore((state) => state.products);
  const loading       = useProductStore((state) => state.loading);
  const error         = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  // ── Store: categories (từ API, không còn hardcode) ──
  const storeCategories  = useProductStore((state) => state.categories);
  const fetchCategories  = useProductStore((state) => state.fetchCategories);
  const createCategory   = useProductStore((state) => state.createCategory);
  const updateCategory   = useProductStore((state) => state.updateCategory);
  const deleteCategory   = useProductStore((state) => state.deleteCategory);

  // ── UI state ──
  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal form chính
  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [modalType,      setModalType]      = useState('CREATE');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Modal xác nhận
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: '',        // 'CANCEL_FORM' | 'CONFIRM_UPDATE' | 'CONFIRM_DELETE'
    title: '',
    message: '',
    pendingData: null,
  });

  const showToast = useCartStore((state) => state.showToast);

  // ── Fetch data ──
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // ── Danh mục dùng trong filter bar (thêm mục "Tất cả" ở đầu) ──
  // storeCategories có dạng: [{ id, code, name, ... }]
  const allOption  = { value: 'ALL', label: 'Tất cả sản phẩm' };
  const categories = [
    allOption,
    ...storeCategories.map((c) => ({
      value: c.code ?? c.id,   // code ưu tiên; fallback về id nếu backend không trả code
      label: c.name,
    })),
  ];

  // Danh mục truyền vào form (bỏ mục "Tất cả")
  const formCategories = categories.filter((c) => c.value !== 'ALL');

  // ── Helpers ──

  /** Lấy key phân loại nhất quán từ object product */
  const getCategoryKey = (product) => {
    const cat = product.category;
    if (!cat) return undefined;
    if (typeof cat === 'object') return cat.code ?? cat.id ?? cat.value;
    return cat;
  };

  /** Tìm label hiển thị cho một product */
  const getCategoryLabel = (product) => {
    const key  = getCategoryKey(product);
    const found = categories.find((c) => c.value === key);
    return found?.label ?? 'Khác';
  };

  // ── Handlers: Modal form ──

  const handleOpenCreateModal = () => {
    setModalType('CREATE');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setModalType('EDIT');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCancelForm = () => {
    setConfirmModal({
      isOpen: true,
      type: 'CANCEL_FORM',
      title: 'Hủy bỏ thao tác?',
      message: 'Những thay đổi bạn vừa nhập sẽ không được lưu. Bạn vẫn muốn thoát chứ?',
      pendingData: null,
    });
  };

  // Bước 1: Form gửi dữ liệu lên
  const handleFormSubmit = (formOutputData) => {
    if (modalType === 'EDIT') {
      setConfirmModal({
        isOpen: true,
        type: 'CONFIRM_UPDATE',
        title: 'Xác nhận cập nhật',
        message: `Bạn có chắc chắn muốn cập nhật thay đổi cho sản phẩm "${formOutputData.name}"?`,
        pendingData: formOutputData,
      });
    } else {
      executeSaveProduct(formOutputData);
    }
  };

  // Bước 2: Thực thi lưu (tạo / cập nhật)
  const executeSaveProduct = async (formOutputData) => {
    try {
      // Tìm thông tin category từ store để build payload đúng cấu trúc API
      const catMatch = storeCategories.find(
        (c) => (c.code ?? c.id) === formOutputData.category
      );
      const categoryObj = catMatch
        ? { id: catMatch.id, code: catMatch.code, name: catMatch.name }
        : { id: formOutputData.category, code: formOutputData.category, name: formOutputData.category };

      const mappedPayload = {
        name:           formOutputData.name,
        price:          formOutputData.price,
        stock_quantity: formOutputData.stock,
        category:       categoryObj,
        image_url:      formOutputData.image,
        description:    formOutputData.description,
      };

      if (modalType === 'CREATE') {
        const result = await createProduct(mappedPayload);
        showToast(
          result.success ? 'Thêm sản phẩm mới thành công!' : 'Đã xảy ra lỗi khi thêm sản phẩm.',
          result.success ? 'success' : 'error'
        );
      } else {
        const result = await updateProduct(selectedProduct.id, mappedPayload);
        showToast(
          result.success ? 'Cập nhật thông tin sản phẩm thành công!' : 'Đã xảy ra lỗi khi cập nhật sản phẩm.',
          result.success ? 'success' : 'error'
        );
      }

      setIsModalOpen(false);
      closeConfirmModal();
    } catch (err) {
      console.error('Gặp lỗi khi xử lý dữ liệu:', err);
      showToast('Đã xảy ra lỗi hệ thống.', 'error');
    }
  };

  // ── Handlers: Xóa sản phẩm ──

  const handleConfirmDelete = (productId, productName) => {
    setConfirmModal({
      isOpen: true,
      type: 'CONFIRM_DELETE',
      title: 'Xóa sản phẩm vĩnh viễn',
      message: `Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa sản phẩm "${productName}" không?`,
      pendingData: { id: productId, name: productName },
    });
  };

  const executeDeleteProduct = async () => {
    const { id, name } = confirmModal.pendingData;
    try {
      const result = await deleteProduct(id);
      showToast(
        result.success ? `Đã xóa sản phẩm "${name}" thành công!` : 'Không thể xóa sản phẩm vào lúc này.',
        result.success ? 'success' : 'error'
      );
      closeConfirmModal();
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      showToast('Đã xảy ra lỗi khi tiến hành xóa.', 'error');
    }
  };

  // ── Điều hướng nút "Đồng ý" trên ConfirmModal ──
  const handleConfirmAction = () => {
    switch (confirmModal.type) {
      case 'CANCEL_FORM':
        setIsModalOpen(false);
        closeConfirmModal();
        break;
      case 'CONFIRM_UPDATE':
        executeSaveProduct(confirmModal.pendingData);
        break;
      case 'CONFIRM_DELETE':
        executeDeleteProduct();
        break;
      default:
        closeConfirmModal();
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, type: '', title: '', message: '', pendingData: null });
  };

  // ── Bộ lọc client-side ──
  const filteredProducts = products.filter((product) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || (
      product.name?.toLowerCase().includes(q) ||
      product.product_code?.toLowerCase().includes(q)
    );
    const key = getCategoryKey(product);
    const matchesCategory = selectedCategory === 'ALL' || key === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ── Render guards ──
  if (loading && products.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center p-6 text-red-500 flex items-center justify-center gap-2">
        <AlertCircle size={18} /> {error}
      </div>
    );
  }

  // ── UI ──
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <span>Quản lý Shop</span>
            <ChevronRight size={12} />
            <span className="text-orange-500">Sản phẩm</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">DANH SÁCH SẢN PHẨM</h1>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-md hover:bg-opacity-90 active:scale-95 transition-all"
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 text-gray-700"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-52 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:outline-none"
        >
          {/* Render động từ store, không còn hardcode */}
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-black tracking-wider border-b border-gray-100">
                <th className="p-4 w-24 text-center">Ảnh</th>
                <th className="p-4">Thông tin sản phẩm</th>
                <th className="p-4">Phân loại</th>
                <th className="p-4">Giá bán</th>
                <th className="p-4 text-center">Kho hàng</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-400">
                    <Package size={36} className="mx-auto mb-2 text-gray-300" />
                    Không tìm thấy sản phẩm.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 text-center">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden border flex items-center justify-center mx-auto">
                        {product.image_url
                          ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          : <Package size={20} className="text-gray-400" />
                        }
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800 text-base">{product.name}</div>
                      <div className="text-xs font-mono text-gray-400">
                        Mã: <span className="font-bold text-blue-600">{product.product_code || `PROD-${product.id}`}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                        <Layers size={12} />
                        {/* Dùng helper thay vì hardcode find */}
                        {getCategoryLabel(product)}
                      </span>
                    </td>
                    <td className="p-4 font-black text-gray-900 text-base">{formatPrice(product.price)}</td>
                    <td className="p-4 text-center font-bold text-gray-800">{product.stock_quantity ?? 0} cái</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-200 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(product.id, product.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-all"
                        >
                          <Trash2 size={16} />
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

      {/* Modal 1: Form tạo / chỉnh sửa */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelForm}
        title={modalType === 'CREATE' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
        size="lg"
      >
        <ProductFormAdmin
          categories={formCategories}
          initialData={selectedProduct}
          onSubmit={handleFormSubmit}
          onClose={handleCancelForm}
        />
      </Modal>

      {/* Modal 2: Xác nhận hành động */}
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

export default ProductManagement;