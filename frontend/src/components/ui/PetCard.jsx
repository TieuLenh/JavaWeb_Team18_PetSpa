import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Eye } from 'lucide-react';
import { Badge } from './Badge';

const PetCard = ({ pet }) => {
  return (
    <div className="group bg-white rounded-3xl p-3 border border-gray-100 shadow-sm hover:shadow-xl hover:border-pet-blue/20 transition-all duration-300 text-left">
      
      {/* Hình ảnh với overlay tinh tế */}
      <div className="relative w-full h-56 overflow-hidden rounded-2xl mb-4">
        <img 
          src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=500"} // Có fallback ảnh phòng hờ bị null
          alt={pet.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 right-3">
          <Badge variant={pet.gender === 'male' ? 'default' : 'secondary'} className="backdrop-blur-md bg-white/80 border-0 text-xs font-bold">
            {pet.gender === 'male' ? '♂ Đực' : '♀ Cái'}
          </Badge>
        </div>
      </div>

      {/* Thông tin thú cưng */}
      <div className="px-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-xl font-black text-gray-900 group-hover:text-pet-blue transition-colors">
            {pet.name}
          </h3>
        </div>
        <p className="text-sm font-medium text-gray-400 mb-4 truncate">
          {pet.breed || 'Chưa rõ giống'} • {pet.age} tuổi
        </p>
      </div>
      
      {/* Nút hành động kiểu Minimalist */}
      <div className="flex gap-2">
        <Link to={`/profile/pets/detail/${pet.id}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-pet-blue hover:text-white transition-all text-sm font-bold">
            <Eye size={16} /> Xem
          </button>
        </Link>
        
        {/* ĐÃ SỬA: Đường dẫn chuẩn khớp với cấu hình trong App.jsx */}
        <Link to={`/profile/pets/edit/${pet.id}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-pet-orange hover:text-white transition-all text-sm font-bold">
            <Edit2 size={16} /> Sửa
          </button>
        </Link>
      </div>

    </div>
  );
};

export default PetCard;