import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PackageSearch,
  Building2,
  CircleDollarSign,
  ShoppingCart,
  ClipboardList,
  BarChart3,
  Store,
  ScrollText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Truck,
  Building,
  GalleryVerticalEnd,
  Receipt,
  Fuel
} from 'lucide-react';

const Sidebar = () => {
  const [role, setRole] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    setActiveItem(location.pathname);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const menuItems = {
    admin: [
      { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { text: 'Manage Users', icon: Users, path: '/users' },
      { text: 'Inventory', icon: PackageSearch, path: '/inventory' },
      { text: 'Suppliers', icon: Building2, path: '/suppliers' },
      { text: 'Fuel Sales', icon: CircleDollarSign, path: '/admin-sales' },
      { text: 'Fuel Purchases', icon: ShoppingCart, path: '/admin-purchase' },
      { text: 'Procurement', icon: ClipboardList, path: '/admin-procurement' },
      { text: 'Evaluation', icon: BarChart3, path: '/admin-evaluation' },
      { text: 'Branches', icon: Store, path: '/admin-branches' },
      { text: 'Reports', icon: ScrollText, path: '/admin-reports' },
    ],
    manager: [
      { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { text: 'Sales', icon: CircleDollarSign, path: '/fuel-sales' },
      { text: 'Fuel Purchases', icon: ShoppingCart, path: '/fuel-purchases' },
    ],
    supplier: [
      { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { text: 'Add Details', icon: Building, path: '/add-supplier-details' },
      { text: 'Bidding', icon: GalleryVerticalEnd, path: '/supplier-bidding' },
      { text: 'Orders', icon: Truck, path: '/orders' },
    ],
  };

  const renderLinks = () => {
    const items = menuItems[role] || [{ text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }];
    
    return items.map((item) => {
      const isActive = location.pathname === item.path;
      const Icon = item.icon;
      
      return (
        <div
          key={item.text}
          className="relative group px-3"
          title={!isOpen ? item.text : ''}
        >
          <Link
            to={item.path}
            className={`
              flex items-center gap-4 px-4 py-3.5 rounded-xl
              transition-all duration-300 ease-in-out cursor-pointer
              ${isActive 
                ? 'bg-gradient-to-r from-[#007547]/10 to-[#007547]/5 text-[#007547]' 
                : 'text-gray-600 hover:bg-[#007547]/5'
              }
              group relative overflow-hidden
            `}
          >
            <div className={`
              relative flex items-center justify-center
              ${isActive ? 'text-[#007547]' : 'text-gray-500 group-hover:text-[#007547]'}
              transition-all duration-300 transform
              ${!isOpen && 'w-10 h-10'}
              ${isActive && 'scale-110'}
            `}>
              <Icon className={`
                w-5 h-5 transition-all duration-300
                ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px] group-hover:stroke-[2.5px]'}
              `} />
              
              <div className={`
                absolute -inset-2 rounded-full bg-[#007547]/5 scale-0
                group-hover:scale-100 transition-transform duration-300
                ${isActive ? 'scale-100' : ''}
              `} />
            </div>
            
            {isOpen && (
              <span className={`
                whitespace-nowrap overflow-hidden transition-all duration-300
                ${isActive ? 'font-semibold' : 'font-medium'}
                text-sm tracking-wide
              `}>
                {item.text}
              </span>
            )}
            
            {isActive && (
              <>
                <div className="absolute left-0 top-0 w-1 h-full bg-[#007547] rounded-r-full" />
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#007547]" />
              </>
            )}
          </Link>
        </div>
      );
    });
  };

  return (
    <div 
      className={`
        fixed top-0 left-0 h-screen bg-white
        transition-all duration-300 ease-in-out
        border-r border-gray-100/50
        ${isOpen ? 'w-72' : 'w-24'}
        shadow-[0_0_40px_rgba(0,117,71,0.08)]
      `}
    >
      <div className="relative h-full flex flex-col">
        {/* Logo Section */}
        <div className="px-6 py-8 flex items-center justify-center relative">
          <div className="flex items-center gap-3">
            <Fuel className={`
              w-8 h-8 text-[#007547] transition-all duration-300
              ${isOpen ? 'rotate-0' : 'rotate-90'}
            `} />
            <h1 className={`
              font-extrabold text-[#007547] transition-all duration-300
              ${isOpen ? 'text-2xl opacity-100' : 'text-xl opacity-0 w-0'}
              tracking-tight
            `}>
              FuelWise
            </h1>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              absolute -right-3 top-9 p-1.5 rounded-full
              bg-[#007547] hover:bg-[#008f55]
              text-white shadow-lg hover:shadow-xl
              transition-all duration-300 ease-in-out
              hover:scale-110 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
            `}
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Gradient Divider */}
        <div className="px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#007547]/20 to-transparent" />
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {renderLinks()}
        </div>

        {/* Logout Section */}
        <div className="p-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[#007547]/20 to-transparent mb-4" />
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-3.5 mx-3
              rounded-xl text-gray-600
              hover:bg-red-50 hover:text-red-600
              transition-all duration-200 ease-in-out
              ${!isOpen && 'justify-center'}
              group
            `}
          >
            <div className="relative">
              <LogOut className={`
                w-5 h-5 transition-transform duration-300
                group-hover:scale-110 group-hover:stroke-[2.5px]
              `} />
              <div className="absolute -inset-2 rounded-full bg-red-100/50 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </div>
            {isOpen && (
              <span className="font-medium text-sm tracking-wide">
                Logout
              </span>
            )}
          </button>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e5e7eb;
            border-radius: 20px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #d1d5db;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Sidebar;