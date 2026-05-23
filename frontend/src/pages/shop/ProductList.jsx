import React, { useEffect } from 'react';
import Loading from '../../components/common/Loading';
import ProductCard from '../../components/ui/ProductCard';

// TÍCH HỢP ZUSTAND STORE
import { useProductStore } from '../../store/productStore';

const ProductList = () => {
  // 🔥 Trích xuất destructuring trực tiếp từ Store để đồng bộ dữ liệu tốt nhất
  const {
    products,
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    fetchProducts,
    fetchCategories
  } = useProductStore();

  // Đồng bộ tải dữ liệu khi component lần đầu hiển thị
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Màn hình chờ khi đang tải dữ liệu tổng thể
  if (loading && products.length === 0) return <Loading fullScreen />;

  // Logic lọc sản phẩm theo category (Khắc phục việc ép kiểu chuỗi/số an toàn)
  const filteredProducts =
    Number(selectedCategory) === 0
      ? products
      : products.filter((p) => Number(p.category?.id) === Number(selectedCategory));

  return (
    <div className="min-h-screen bg-gray-50/50 pt-15 pb-20">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-pet-blue mb-4">
            Cửa Hàng Thú Cưng
          </h1>

          {/* Danh sách nút bấm Danh mục (Categories) */}
          <div className="flex flex-wrap justify-center gap-3">

            {/* Nút hiển thị Tất cả sản phẩm */}
            <button
              onClick={() => setSelectedCategory(0)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                Number(selectedCategory) === 0
                  ? 'bg-pet-blue text-white shadow-lg'
                  : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              Tất cả
            </button>

            {/* Danh sách danh mục động từ Mock API */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  Number(selectedCategory) === Number(cat.id)
                    ? 'bg-pet-blue text-white shadow-lg'
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Lưới hiển thị danh sách sản phẩm sau lọc */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 font-medium text-gray-400">
            Không tìm thấy sản phẩm nào thuộc danh mục này.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductList;