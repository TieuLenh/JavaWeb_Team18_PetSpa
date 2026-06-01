// src/pages/shop/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Plus, CreditCard, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Badge } from '../../components/ui/Badge';
import AddressForm from '../../components/form/AddressForm'; 
import { useCartStore } from '../../store/cartStore'; 

// TÍCH HỢP ZUSTAND STORE: Quản lý logic đặt đơn hàng tập trung
import { useOrderStore } from '../../store/orderStore'; 
import { formatPrice } from '../../utils/formatPrice';
import addressService from '../../services/AddressService';

// TÍCH HỢP: Import cổng thanh toán tự động QR Banking
import PaymentModal from '../../components/common/PaymentModal';

const Checkout = () => {
  const navigate = useNavigate();
  
  // SỬA LỖI ĐỒNG BỘ: Gọi đúng hàm showToast và lấy state toast từ Zustand store
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const showToast = useCartStore((state) => state.showToast);
  const toast = useCartStore((state) => state.toast);
  
  // ZUSTAND ACTIONS & STATES: Quản lý đặt hàng toàn cục
  const { createOrder, submitting: isSubmitting } = useOrderStore();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD'); 

  // TÍCH HỢP: State quản lý hiển thị Modal QR và thông tin đơn hàng vừa tạo xong
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 500000 ? 0 : 30000; 
  const totalAmount = subtotal + shippingFee;

  // Điều hướng nếu giỏ hàng trống
  useEffect(() => {
    if (!items.length) navigate('/shop');
  }, [items, navigate]);

  // Lấy danh sách địa chỉ của user
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressService.getAddressesByUser(101); 
        if (response && response.success) {
          const mappedAddresses = response.data.map(addr => ({
            id: addr.id,
            receiverName: addr.recipient_name,
            phone: addr.phone_number,
            detailAddress: addr.detail_address,
            city: `${addr.district_ward}, ${addr.province_city}`,
            isDefault: addr.is_default
          }));
          
          setAddresses(mappedAddresses);
          
          const defaultAddr = mappedAddresses.find(addr => addr.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          } else if (mappedAddresses.length > 0) {
            setSelectedAddressId(mappedAddresses[0].id);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách địa chỉ:", err);
      }
    };
    
    fetchAddresses();
  }, []);

  // SỬA LỖI AN TOÀN: Cập nhật hàm gọi trigger tương thích với tên showToast mới
  const triggerNotification = (message) => {
    if (typeof showToast === 'function') {
      showToast(message, 'success');
    } else {
      alert(message);
    }
  };

  const handleAddressSubmitSuccess = (createdAddress) => {
    if (!addresses.length) createdAddress.isDefault = true;
    setAddresses(prev => [...prev, createdAddress]);
    setSelectedAddressId(createdAddress.id);
    setIsModalOpen(false);
    triggerNotification("Đã lưu địa chỉ giao hàng mới thành công!");
  };

  // TÍCH HỢP: Xử lý sau khi khách quét mã QR chuyển khoản thành công hoàn toàn
  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    clearCart();
    triggerNotification("Thanh toán đơn hàng thành công!");
    navigate("/profile", { state: { activeTab: "orders" } }); 
  };

  // Xử lý tạo và đặt đơn hàng qua Zustand Store
  const handlePlaceOrder = async () => {
    const currentAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (!currentAddress) return alert("Vui lòng thêm địa chỉ nhận hàng!");

    const formattedAddress = `${currentAddress.receiverName} (${currentAddress.phone}) - ${currentAddress.detailAddress}, ${currentAddress.city}`;

    const orderPayload = {
      customer: {
        id: 101,
        full_name: currentAddress.receiverName,
      },
      type: "PRODUCT_DELIVERY",
      
      items: items.map((item, index) => ({
        id: index + 1,
        product: {
          id: item.id,
          name: item.name,
        },
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),

      shipping_address: formattedAddress,
      payment_method: paymentMethod, 
      total_amount: totalAmount,
    };

    const response = await createOrder(orderPayload);
    
    if (response && response.success) {
      if (paymentMethod === 'BANKING') {
        const orderId = response.data?.id || response.id || Math.floor(100000 + Math.random() * 900000);
        setCreatedOrderData({
          id: orderId,
          amount: totalAmount
        });
        setIsPaymentModalOpen(true);
      } else {
        clearCart();
        triggerNotification("Đặt hàng thành công!");
        navigate("/profile", { state: { activeTab: "orders" } }); 
      }
    } else {
      alert(response?.message || "Đặt hàng thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 text-left relative">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <Link to="/shop/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-pet-blue font-bold mb-6 transition-colors">
          <ArrowLeft size={18} /> Quay lại giỏ hàng
        </Link>

        <h1 className="text-3xl font-black text-pet-blue mb-8 uppercase tracking-tight">Thanh toán đơn hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* KHỐI CHỌN ĐỊA CHỈ & PHƯƠNG THỨC */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="text-pet-orange" size={22} /> Thông tin nhận hàng
                </h2>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  variant="outline" 
                  className="!py-2 !px-3 text-xs flex items-center gap-1 border-pet-blue text-pet-blue hover:bg-pet-blue/5 rounded-xl font-bold"
                >
                  <Plus size={14} /> Thêm địa chỉ mới
                </Button>
              </div>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label 
                    key={addr.id}
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id ? 'border-pet-blue bg-pet-blue/5' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="delivery_address" 
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-pet-blue w-4 h-4"
                      />
                      <div className="flex-1 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900 text-base">{addr.receiverName}</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600 font-bold">{addr.phone}</span>
                          {addr.isDefault && (
                            <Badge variant="primary" className="bg-pet-orange text-white text-[10px] py-0.5 px-2 rounded">
                              Mặc định
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-500 font-medium">{addr.detailAddress}, {addr.city}</p>
                      </div>
                    </div>
                  </label>
                ))}

                {addresses.length === 0 && (
                  <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium text-sm">
                    Bạn chưa có địa chỉ nhận hàng. Vui lòng thêm địa chỉ mới để tiếp tục thanh toán!
                  </div>
                )}
              </div>
            </div>

            {/* KHỐI PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <CreditCard className="text-pet-blue" size={22} /> Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-pet-blue bg-pet-blue/5' : 'border-gray-100'}`}>
                  <input type="radio" name="payment_method" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-pet-blue w-4 h-4" />
                  <div>
                    <p className="font-bold text-gray-800 text-base">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Trả tiền mặt khi shipper giao tới</p>
                  </div>
                </label>
                <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'BANKING' ? 'border-pet-blue bg-pet-blue/5' : 'border-gray-100'}`}>
                  <input type="radio" name="payment_method" checked={paymentMethod === 'BANKING'} onChange={() => setPaymentMethod('BANKING')} className="accent-pet-blue w-4 h-4" />
                  <div>
                    <p className="font-bold text-gray-800 text-base">Chuyển khoản Ngân hàng (Mã QR)</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Quét mã QR qua ứng dụng ngân hàng</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* TÓM TẮT ĐƠN HÀNG */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <ShoppingBag className="text-pet-orange" size={22} /> Tóm tắt đơn hàng
            </h2>
            <div className="max-h-60 overflow-y-auto mb-6 space-y-4 divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pt-3 first:pt-0">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-contain bg-gray-50 border p-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400 font-medium">Số lượng: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 mb-6 border-t border-b border-gray-100 py-4 text-sm font-medium text-gray-500">
              <div className="flex justify-between"><span>Tạm tính</span><span className="text-gray-800 font-bold">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Phí vận chuyển</span><span className="text-gray-800 font-bold">{shippingFee === 0 ? <span className="text-green-500 font-black">Miễn phí</span> : formatPrice(shippingFee)}</span></div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-bold text-gray-800">Tổng thanh toán</span>
              <span className="text-2xl font-black text-pet-orange">{formatPrice(totalAmount)}</span>
            </div>
            <Button onClick={handlePlaceOrder} disabled={isSubmitting} className="w-full !py-4 rounded-2xl font-black text-lg tracking-wide shadow-lg shadow-pet-blue/20">
              {isSubmitting ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"}
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL THÊM ĐỊA CHỈ */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm địa chỉ giao hàng mới">
          <AddressForm 
            onSubmitSuccess={handleAddressSubmitSuccess} 
            onCancel={() => setIsModalOpen(false)} 
            userId={101}
          />
        </Modal>
      )}

      {/* RENDER PAYMENT MODAL */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={createdOrderData}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* BỔ SUNG: KHỐI UI HIỂN THỊ TOAST DỰA TRÊN ZUSTAND STATE */}
      {toast?.show && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-gray-900 text-white py-3 px-5 rounded-2xl shadow-xl transition-all duration-300 transform translate-y-0 opacity-100 animate-bounce">
          <CheckCircle2 size={20} className="text-green-400" />
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Checkout;