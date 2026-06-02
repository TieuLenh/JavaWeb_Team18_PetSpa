import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Scissors, 
  ClipboardList, 
  Users, 
  UserCheck, 
  BarChart3, 
  LogOut,
  PawPrint,
  ChevronDown,
  Layers,
  Package,
  FileText,
  Calendar // Thêm icon Calendar để quản lý lịch hẹn
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// COMPONENT PHỤ XỬ LÝ MỤC MENU (CÓ HOẶC KHÔNG CÓ CẤP CON)
const SidebarMenuItem = ({ item, currentPath }) => {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  
  const isAnyChildActive = hasChildren && item.children.some(child => currentPath === child.path);
  const shouldBeActive = currentPath === item.path || isAnyChildActive;

  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  const toggleSubMenu = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="space-y-1">
      <Link
        to={hasChildren ? '#' : item.path}
        onClick={hasChildren ? toggleSubMenu : undefined}
        className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 group relative ${
          shouldBeActive
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-pet-blue'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        {shouldBeActive && (
          <span className="absolute left-0 top-1/4 w-1 h-1/2 bg-pet-orange rounded-r-full"></span>
        )}
        
        <div className="flex items-center gap-3">
          <Icon 
            size={20} 
            className={`transition-colors ${
              shouldBeActive ? 'text-pet-blue' : 'text-gray-400 group-hover:text-gray-600'
            }`} 
          />
          <span>{item.label}</span>
        </div>

        {hasChildren && (
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180 text-pet-blue' : ''}`}
          />
        )}
      </Link>

      {hasChildren && isOpen && (
        <div className="pl-9 pr-2 space-y-1 transition-all duration-300">
          {item.children.map((child) => {
            const ChildIcon = child.icon;
            const isChildActive = currentPath === child.path;

            return (
              <Link
                key={child.path}
                to={child.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  isChildActive
                    ? 'text-pet-orange bg-orange-50/50'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {ChildIcon && <ChildIcon size={14} />}
                <span>{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

// COMPONENT SIDEBAR CHÍNH
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/admin/bookings', label: 'Quản lý lịch hẹn', icon: Calendar }, // Thêm mới vào đây
    { path: '/admin/orders', label: 'Quản lý đơn hàng', icon: ClipboardList },
    { 
      path: '/admin/products', 
      label: 'Quản lý sản phẩm', 
      icon: ShoppingBag,
      children: [
        { path: '/admin/products/list', label: 'Danh sách sản phẩm', icon: Package },
        { path: '/admin/products/categories', label: 'Danh mục sản phẩm', icon: Layers }
      ]
    },
    { 
      path: '/admin/services', 
      label: 'Quản lý dịch vụ', 
      icon: Scissors,
      children: [
        { path: '/admin/services/list', label: 'Danh sách dịch vụ', icon: FileText }, 
        { path: '/admin/services/categories', label: 'Danh mục dịch vụ', icon: Layers }
      ]
    },
    { path: '/admin/users', label: 'Quản lý khách hàng', icon: Users },
    { path: '/admin/staff', label: 'Quản lý nhân viên', icon: UserCheck },
    { path: '/admin/reports', label: 'Báo cáo doanh thu', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col justify-between z-40 shadow-sm">
      <div className="flex flex-col flex-1">
        <div className="h-20 px-6 flex items-center border-b border-gray-50">
          <Link to="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="bg-pet-blue p-2 rounded-xl group-hover:bg-pet-orange transition-colors shadow-sm">
              <PawPrint className="text-white" size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter text-pet-blue">
              PET<span className="text-pet-orange">SPA</span>
              <span className="text-[10px] ml-1 px-1.5 py-0.5 bg-red-50 text-red-500 font-bold rounded-md align-middle">
                ADMIN
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {adminMenuItems.map((item) => (
            <SidebarMenuItem 
              key={item.label} 
              item={item} 
              currentPath={location.pathname} 
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-50 bg-gray-50/50">
        <div className="flex items-center justify-between p-2 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-pet-blue text-white flex items-center justify-center font-black text-sm uppercase shadow-sm shrink-0">
              {user?.fullName ? user.fullName.charAt(0) : 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-gray-800 truncate">
                {user?.fullName || 'Quản trị viên'}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {user?.email || 'admin@petspa.com'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Đăng xuất"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;