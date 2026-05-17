import React from 'react';
import { Home, Calendar, BookOpen, CreditCard, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'meals', label: 'Meals', icon: Calendar },
  { id: 'menu', label: 'Menu', icon: BookOpen },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-bottom">
    <div className="flex items-center justify-around px-2">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-2 px-3 gap-0.5 min-w-0 flex-1 transition-all duration-200 ${isActive ? 'text-[#1a73e8]' : 'text-gray-400'}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);
