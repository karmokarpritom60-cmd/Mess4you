import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { DashboardPage } from './DashboardPage';
import { StudentsPage } from './StudentsPage';
import { MealsAdminPage } from './MealsAdminPage';
import { PaymentsAdminPage } from './PaymentsAdminPage';
import { ExpensesPage } from './ExpensesPage';
import { MenuAdminPage } from './MenuAdminPage';
import { NotificationsPage } from './NotificationsPage';
import { ReportsPage } from './ReportsPage';
import { SettingsPage } from '../superadmin/SettingsPage';
import { useAuth } from '../../contexts/AuthContext';

type Page = 'dashboard' | 'students' | 'meals' | 'payments' | 'expenses' | 'menu' | 'notifications' | 'reports' | 'settings';
const PAGE_TITLES: Record<Page, string> = { dashboard: 'Dashboard', students: 'Students', meals: 'Meals', payments: 'Payments', expenses: 'Expenses', menu: 'Weekly Menu', notifications: 'Notifications', reports: 'Reports', settings: 'Settings' };

export const AdminDashboard: React.FC = () => {
  const { userData } = useAuth();
  const [activePage, setActivePage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={p => setActivePage(p as Page)} />;
      case 'students': return <StudentsPage />;
      case 'meals': return <MealsAdminPage />;
      case 'payments': return <PaymentsAdminPage />;
      case 'expenses': return <ExpensesPage />;
      case 'menu': return <MenuAdminPage />;
      case 'notifications': return <NotificationsPage />;
      case 'reports': return <ReportsPage />;
      case 'settings': return userData?.role === 'superadmin' ? <SettingsPage /> : null;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} onPageChange={p => setActivePage(p as Page)} />
      <div className="lg:pl-64">
        <div className="bg-white border-b border-gray-100 px-5 py-4 sticky top-0 z-30 lg:pl-5">
          <div className="flex items-center"><div className="w-10 lg:hidden" /><h1 className="text-lg font-bold text-gray-900 pl-4 lg:pl-0">{PAGE_TITLES[activePage]}</h1></div>
        </div>
        <div className="px-4 py-5 max-w-3xl">{renderPage()}</div>
      </div>
    </div>
  );
};
