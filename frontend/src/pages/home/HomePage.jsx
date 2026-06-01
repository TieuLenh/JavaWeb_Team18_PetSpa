import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Components nội bộ & Common
import Hero from '../home/components/Hero';
import StatsSection from '../home/components/StatsSection';
import FacilitiesTeaser from './components/FacilitiesTeaser.jsx';
import Loading from '../../components/common/Loading';
import { Button } from '../../components/common/Button';

// UI Components có sẵn
import ProductCard from '../../components/ui/ProductCard';
import ServiceCard from '../../components/ui/ServiceCard';
import HomePetCard from '../home/components/HomePetCard';

// ✨ Animation component
import ScrollReveal from '../home/components/Scrollreveal';

// 🔄 CHUYỂN ĐỔI: Sử dụng Zustand Stores thay vì gọi trực tiếp API Services
import { useProductStore } from '../../store/productStore';
import { useServiceStore } from '../../store/serviceStore';
import { usePetStore } from '../../store/petStore';

// Hooks Store toàn cục khác
import { useCart } from '../../hooks/useCart';

const HomePage = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState('ALL');

  // 1. Lấy dữ liệu và trạng thái từ useProductStore
  const { 
    products: allProducts, 
    loading: productLoading, 
    fetchProducts 
  } = useProductStore();

  // 2. Lấy dữ liệu và trạng thái từ useServiceStore
  const { 
    services: allServices, 
    loading: serviceLoading, 
    fetchServices 
  } = useServiceStore();

  // 3. Lấy dữ liệu và trạng thái từ usePetStore
  const { 
    pets: allPets, 
    loading: petLoading, 
    fetchPets 
  } = usePetStore();

  // Kích hoạt fetch dữ liệu đồng thời khi component mount
  useEffect(() => {
    // Các hàm này trong store của bạn đã có cơ chế chặn trùng lặp / cache dữ liệu rất tốt
    fetchProducts();
    fetchServices();
    fetchPets();
  }, [fetchProducts, fetchServices, fetchPets]);

  // Xử lý cắt lát dữ liệu trực tiếp trên dữ liệu từ store đổ về công khai
  const popularServices = useMemo(() => allServices.slice(0, 6), [allServices]);
  const newPets = useMemo(() => allPets.slice(0, 4), [allPets]);

  // Đồng bộ hóa trạng thái tải tổng hợp: Chỉ quay loading khi một trong các store cốt lõi đang fetch lần đầu
  const isGlobalLoading = productLoading || serviceLoading || petLoading;

  // Lọc sản phẩm theo danh mục (Giữ nguyên logic của bạn nhưng tối ưu dependency)
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        if (activeTab === 'ALL') return true;
        const currentCategoryId = product.category_id || product.categoryId;
        
        if (activeTab === 'FOOD') return currentCategoryId === 1;
        if (activeTab === 'TOY') return currentCategoryId === 2;
        if (activeTab === 'ACCESSORY') return currentCategoryId === 3;
        return true;
      })
      .slice(0, 8);
  }, [allProducts, activeTab]);

  // Giao diện chờ
  if (isGlobalLoading && allProducts.length === 0 && allServices.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading size="large" />
      </div>
    );
  }

  return (
    <div className="homepage-container w-full mx-auto px-0 no-scrollbar">
      <Hero />
      <div className='px-20'> 
        
        {/* SECTION 2: Stats */}
        <ScrollReveal variant="zoom-in" duration={800} threshold={0.2}>
          <StatsSection />
        </ScrollReveal>

        {/* SECTION 3: Dịch vụ Spa */}
        <section className="mb-20">
          <ScrollReveal variant="fade-right" duration={700}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-2">
              <div>
                <span className="text-pet-orange font-bold text-xs uppercase tracking-widest block mb-1">
                  Dành Cho Thú Cưng Của Bạn
                </span>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
                  Dịch Vụ Spa Chuyên Sâu
                </h2>
              </div>
              <Button
                variant="text"
                onClick={() => navigate('/spa')}
                className="text-pet-blue hover:text-pet-orange font-bold p-0 self-start md:self-auto"
              >
                Khám phá menu dịch vụ &rarr;
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service, index) => (
              <ScrollReveal
                key={service.id}
                variant="fade-up"
                delay={index * 100}
                duration={650}
                threshold={0.1}
              >
                <ServiceCard
                  service={service}
                  onBookingClick={() => navigate(`/spa/booking/create?serviceId=${service.id}`)}
                />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* SECTION 4: Vaccination Teaser */}
        <ScrollReveal variant="flip-up" duration={900} threshold={0.2}>
          <FacilitiesTeaser />
        </ScrollReveal>

        {/* SECTION 5: Sản phẩm */}
        <section className="mb-20">
          <ScrollReveal variant="fade-down" duration={600}>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
              <div>
                <span className="text-pet-orange font-bold text-xs uppercase tracking-widest block mb-1">
                  Cửa hàng bách hóa Boss
                </span>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
                  Sản Phẩm Được Yêu Thích
                </h2>
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl self-start lg:self-auto overflow-x-auto max-w-full">
                {['ALL', 'FOOD', 'TOY', 'ACCESSORY'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-pet-blue text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab === 'ALL' && 'Tất Cả'}
                    {tab === 'FOOD' && 'Thức Ăn'}
                    {tab === 'TOY' && 'Đồ Chơi'}
                    {tab === 'ACCESSORY' && 'Phụ Kiện'}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ScrollReveal
                  key={product.id}
                  variant="fade-up"
                  delay={index * 75}
                  duration={600}
                  threshold={0.08}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={() => addItem(product)}
                    onClick={() => navigate(`/shop/product/${product.id}`)}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal variant="fade-up">
              <div className="text-center py-12 text-slate-400 font-medium">
                Hiện chưa có sản phẩm nào thuộc danh mục này.
              </div>
            </ScrollReveal>
          )}
        </section>

        {/* SECTION 6: Thú cưng mới */}
        <section className="mb-12">
          <ScrollReveal variant="fade-right" duration={800} threshold={0.2}>
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-pet-orange font-bold text-xs uppercase tracking-widest block mb-1">
                  Tìm ấm áp - Kiếm yêu thương
                </span>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
                  Thành Viên Mới Đến
                </h2>
              </div>
              <Button
                variant="text"
                onClick={() => navigate('/pet')}
                className="text-pet-blue hover:text-pet-orange font-bold"
              >
                Gặp gỡ tất cả &rarr;
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newPets.map((pet, index) => (
              <ScrollReveal
                key={pet.id}
                variant={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                delay={index * 120}
                duration={700}
                threshold={0.1}
              >
                <HomePetCard pet={pet} onClick={() => navigate(`/profile/pets/detail/${pet.id}`)} />
              </ScrollReveal>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePage;