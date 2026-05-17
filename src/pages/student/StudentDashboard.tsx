import React, { useState } from 'react';
import { BottomNav } from '../../components/layout/BottomNav';
import { HomeTab } from './HomeTab';
import { MealsTab } from './MealsTab';
import { MenuTab } from './MenuTab';
import { PaymentsTab } from './PaymentsTab';
import { ProfileTab } from './ProfileTab';

type TabId = 'home' | 'meals' | 'menu' | 'payments' | 'profile';
const TAB_TITLES: Record<TabId, string> = { home: 'Home', meals: 'Meals', menu: 'Menu', payments: 'Payments', profile: 'Profile' };

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'meals': return <MealsTab />;
      case 'menu': return <MenuTab />;
      case 'payments': return <PaymentsTab />;
      case 'profile': return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-5 py-4 sticky top-0 z-30"><h1 className="text-lg font-bold text-gray-900">{TAB_TITLES[activeTab]}</h1></div>
      <div className="px-4 py-4 pb-24">{renderTab()}</div>
      <BottomNav activeTab={activeTab} onTabChange={t => setActiveTab(t as TabId)} />
    </div>
  );
};
