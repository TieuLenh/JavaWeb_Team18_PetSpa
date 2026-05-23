// src/pages/spa/ServiceList.jsx
import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Layers } from 'lucide-react';

// Import Zustand Store thay thế hoàn toàn việc quản lý state cục bộ và gọi API trực tiếp
import { useServiceStore } from '../../store/serviceStore';

// Import UI Components
import Loading from '../../components/common/Loading';
import ServiceCard from '../../components/ui/ServiceCard';

const ServiceList = () => {
  // ─── LOCAL UI STATES ───────────────────────────────────────────────────────
  const [filterId, setFilterId] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // ─── ZUSTAND STORE STATES & ACTIONS ────────────────────────────────────────
  // Giả định useServiceStore của bạn quản lý danh sách dịch vụ (services) và danh mục (categories)
  const { 
    services, 
    categories, 
    loadingServices, // hoặc loading chung tùy store của bạn
    fetchServices, 
    fetchServiceCategories
  } = useServiceStore();

  // Đồng bộ hóa dữ liệu từ Store khi component mount
  useEffect(() => {
    // Gọi API thông qua store nếu dữ liệu chưa có sẵn (hoặc gọi mới để cập nhật)
    if (fetchServices) fetchServices();
    if (fetchServiceCategories) fetchServiceCategories();
  }, [fetchServices, fetchServiceCategories]);

  // Trạng thái Loading kế thừa trực tiếp từ Global State Store
  if (loadingServices) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // ─── LOGIC LỌC VÀ TÌM KIẾM DỊCH VỤ DỰA TRÊN STATE ──────────────────────────
  const filteredServices = services.filter((s) => {
    // 1. Lọc theo Danh mục (Category)
    let matchesCategory = true;
    if (filterId !== 'All') {
      const currentServiceCatId = s.category && typeof s.category === 'object'
        ? s.category.id
        : (s.categoryId || s.category_id);
      
      matchesCategory = Number(currentServiceCatId) === Number(filterId);
    }

    // 2. Lọc theo Từ khóa tìm kiếm (Search) - Hỗ trợ không phân biệt hoa thường
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pt-10 pb-20 text-left">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* ─── HEADER SECTION ─── */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-pet-blue mb-2">Dịch Vụ Spa</h1>
            <p className="text-gray-500 font-medium">Chăm sóc thú cưng của bạn bằng tất cả tình yêu thương</p>
          </div>
          
          {/* Nhóm các nút chuyển đổi danh mục động */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setFilterId('All')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                filterId === 'All' 
                  ? 'bg-pet-blue text-white border-pet-blue shadow-lg shadow-blue-500/10' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 border-gray-200'
              }`}
            >
              Tất Cả
            </button>

            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterId(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  Number(filterId) === Number(cat.id)
                    ? 'bg-pet-blue text-white border-pet-blue shadow-lg shadow-blue-500/10' 
                    : 'bg-white text-gray-500 hover:bg-gray-100 border-gray-200'
                }`}
              >
                {cat.name || cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* ─── TOOLBAR (SEARCH & FILTER) ─── */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
          {/* Input Tìm kiếm hoạt động theo thời gian thực */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tên dịch vụ hoặc mô tả..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium text-gray-700"
            />
          </div>
          
          <button className="flex items-center gap-2 text-gray-600 font-black text-xs uppercase tracking-wider hover:text-pet-blue transition-colors cursor-pointer">
            <SlidersHorizontal size={16} />
            Sắp xếp theo: Phổ biến nhất
          </button>
        </div>

        {/* ─── GRID LIST SERVICES ─── */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          /* ─── EMPTY STATE ─── */
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <Layers size={22} />
            </div>
            <h3 className="text-gray-700 font-black text-base mb-1">Không tìm thấy kết quả</h3>
            <p className="text-gray-400 font-medium text-sm">
              Không tìm thấy dịch vụ nào phù hợp với danh mục hoặc từ khóa "{searchTerm}" hiện tại của bạn.
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ServiceList;