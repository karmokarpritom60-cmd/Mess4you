import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Calendar, CreditCard, Receipt,
  BookOpen, Bell, BarChart2, Settings, LogOut, Menu as MenuIcon, X, ChefHat
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const adminPages = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'meals', label: 'Meals', icon: Calendar },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'menu', label: 'Menu', icon: BookOpen },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const { userData, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSuperAdmin = userData?.role === 'superadmin';
  const pages = isSuperAdmin ? [...adminPages, { id: 'settings', label: 'Settings', icon: Settings }] : adminPages;

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a73e8] rounded-xl flex items-center justify-center">
            <ChefHat size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-base">Mess4you</div>
            <div className="text-xs text-gray-500 capitalize">{userData?.role}</div>
          </div>
        </div>
      </div>
      <div className="p-3 flex-1 overflow-y-auto">
        {pages.map(page => {
          const Icon = page.icon;
          const isActive = activePage === page.id;
          return (
            <button
              key={page.id}
              onClick={() => { onPageChange(page.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 text-left ${isActive ? 'bg-[#1a73e8] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{page.label}</span>
            </button>
          );
        })}
      </div>
      <div className="p-3 border-t border-gray-100">
        <div className="px-4 py-2 mb-2">
          <div className="text-sm font-semibold text-gray-900">{userData?.name}</div>
          <div className="text-xs text-gray-400">{userData?.email}</div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center border border-gray-100">
        <MenuIcon size={20} className="text-gray-700" />
      </button>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-white h-full shadow-xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100">
              <X size={20} className="text-gray-600" />
            </button>
            <NavContent />
          </div>
        </div>
      )}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-100 shadow-sm">
        <NavContent />
      </div>
    </>
  );
};
