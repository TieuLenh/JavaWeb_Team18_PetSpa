import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, ShoppingBag, ArrowLeft, CreditCard, Phone } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore'; 
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Lấy các state và action tập trung từ useOrderStore
  const { currentOrder, loading, submitting, fetchOrderById, cancelOrder } = useOrderStore();

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  if (loading) return <Loading fullScreen />;

  // Xử lý fallback dữ liệu an toàn giống logic gốc của bạn
  const order = currentOrder;
  if (!order) {
    return <div className="pt-32 text-center text-gray-500 font-medium">Không tìm thấy thông tin đơn hàng.</div>;
  }

  // Hàm xử lý tương tác hủy đơn hàng trực tiếp qua Store
  const handleCancelOrder = async () => {
    if (window.confirm("Bạn có chắc chắn muốn yêu cầu hủy đơn hàng này không?")) {
      const res = await cancelOrder(id);
      if (res && res.success) {
        alert("Yêu cầu hủy đơn hàng thành công!");
      } else {
        alert(res?.message || "Hủy đơn hàng thất bại. Vui lòng thử lại sau.");
      }
    }
  };

  // Hàm helper render Badge trạng thái đơn hàng
  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge variant="success">Thành công</Badge>;
      case 'pending':
        return <Badge variant="warning">Chờ xử lý</Badge>;
      case 'shipping':
        return <Badge variant="primary" className="bg-blue-500 text-white">Đang giao hàng</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Đã hủy</Badge>;
      default:
        return <Badge variant="warning">Chờ xử lý</Badge>;
    }
  };

  // Tính toán dòng tiền dựa trên các trường dữ liệu snake_case từ API
  const totalAmount = order.total_amount || 0;
  const isFreeShip = totalAmount > 500000;
  const shippingFee = isFreeShip ? 0 : 30000;
  const subTotal = totalAmount - shippingFee;

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 text-left">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Nút quay lại điều hướng chuẩn xác về Tab Orders trong Profile */}
        <button 
          onClick={() => navigate("/profile", { state: { activeTab: "orders" } })}
          className="flex items-center text-gray-500 hover:text-pet-blue mb-6 font-bold text-sm transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <ArrowLeft size={18} className="mr-2" /> Quay lại danh sách đơn hàng
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Header Card */}
          <div className="bg-pet-blue p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-200 text-sm font-semibold tracking-wider">
                  MÃ ĐƠN HÀNG: {order.order_code || `#${order.id}`}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar size={16} className="text-blue-200" />
                  <span className="text-sm text-blue-100">
                    Ngày đặt: {formatDate(order.created_at || order.date)}
                  </span>
                </div>
              </div>
              <div>
                {renderStatusBadge(order.status)}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8">
            
            {/* Khối 1: Thông tin người nhận & Thanh toán */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-black tracking-wider text-gray-400 flex items-center gap-1.5">
                  <MapPin size={14} /> Địa chỉ nhận hàng
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    <User size={14} className="text-gray-400" /> 
                    {order.customer?.full_name || 'Người nhận'}
                  </p>
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    <Phone size={14} className="text-gray-400" /> 
                    {order.customer?.phone || 'Liên hệ qua ứng dụng'}
                  </p>
                  <p className="text-gray-500 pl-5 font-medium leading-relaxed">
                    {order.shipping_address}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase font-black tracking-wider text-gray-400 flex items-center gap-1.5">
                  <CreditCard size={14} /> Phương thức thanh toán
                </h3>
                <div className="text-sm font-bold text-gray-800">
                  <p className="bg-gray-50 inline-block px-3 py-1.5 rounded-xl border border-gray-100">
                    {order.payment_method === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản Ngân hàng (Mã QR)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Khối 2: Danh sách sản phẩm trong đơn hàng */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-black tracking-wider text-gray-400 flex items-center gap-1.5">
                <ShoppingBag size={14} /> Danh sách sản phẩm
              </h3>
              
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/30 px-4">
                {order.items?.map((item, index) => (
                  <div key={item.id || index} className="flex items-center gap-4 py-4 first:pt-4 last:pb-4">
                    <img 
                      src={item.product?.image || item.image || 'https://via.placeholder.com/150'} 
                      alt={item.product?.name || item.name} 
                      className="w-16 h-16 rounded-2xl object-contain bg-white border p-1" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 truncate">
                        {item.product?.name || item.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-bold mt-1">
                        Đơn giá: {formatPrice(item.price || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-400 block">x{item.quantity || 1}</span>
                      <span className="text-sm font-black text-gray-800 block mt-0.5">
                        {formatPrice(item.subtotal || (item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Khối 3: Tổng kết tài chính */}
            <div className="border-t border-gray-100 pt-6 space-y-3 text-sm font-medium text-gray-500">
              <div className="flex justify-between">
                <span>Tạm tính sản phẩm:</span>
                <span className="text-gray-800 font-bold">
                  {formatPrice(subTotal > 0 ? subTotal : 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="text-gray-800 font-bold">
                  {isFreeShip ? <span className="text-green-500 font-bold">Miễn phí</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-black text-gray-900 border-t border-dashed pt-4">
                <span>Tổng tiền đã thanh toán:</span>
                <span className="text-2xl text-pet-orange">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Hành Động - Chỉ hiển thị khi đơn hàng đang ở trạng thái pending */}
          {order.status?.toLowerCase() === 'pending' && (
            <div className="p-6 bg-gray-50 border-t flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleCancelOrder}
                disabled={submitting}
                className="flex-1 text-red-500 border-red-200 hover:bg-red-50/50 !py-3 rounded-2xl font-bold disabled:opacity-50"
              >
                {submitting ? 'Đang xử lý...' : 'Yêu cầu hủy đơn'}
              </Button>
              <Button className="flex-1 !py-3 rounded-2xl font-bold" disabled={submitting}>
                Liên hệ hỗ trợ
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;