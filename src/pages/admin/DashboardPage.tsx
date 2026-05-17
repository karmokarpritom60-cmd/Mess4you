import React from 'react';
import { Users, Utensils, XCircle, Clock, CreditCard, AlertCircle, PlusCircle, FileText } from 'lucide-react';
import { mockUsers, mockPayments } from '../../utils/mockData';
import { formatDate } from '../../utils/helpers';

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; color: string; sub?: string }> = ({ label, value, icon, color, sub }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
    <div className="min-w-0"><div className="text-xl font-bold text-gray-900">{value}</div><div className="text-xs text-gray-500 leading-tight">{label}</div>{sub && <div className="text-xs text-red-500 mt-0.5">{sub}</div>}</div>
  </div>
);

export const DashboardPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const students = mockUsers.filter(u => u.role === 'student' && u.isActive);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending');
  const eatingToday = students.length - 2;
  const vetoedToday = 2;

  const recentActivity = [
    { text: 'Arjun Sharma submitted payment proof', time: '2 hours ago' },
    { text: 'Priya Patel vetoed lunch for May 20', time: '3 hours ago' },
    { text: 'New student Vikram Reddy registered', time: '1 day ago' },
    { text: 'May menu updated by admin', time: '2 days ago' },
    { text: 'Rahul Singh payment verified', time: '2 days ago' },
    { text: 'Expense added: Vegetables Rs 3200', time: '3 days ago' },
    { text: 'Sneha Gupta payment rejected', time: '4 days ago' },
    { text: 'May bills generated for all students', time: '5 days ago' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Students" value={students.length} icon={<Users size={18} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard label="Eating Today" value={eatingToday} icon={<Utensils size={18} className="text-green-600" />} color="bg-green-50" />
        <StatCard label="Vetoed Today" value={vetoedToday} icon={<XCircle size={18} className="text-orange-500" />} color="bg-orange-50" />
        <StatCard label="Pending Payments" value={pendingPayments.length} icon={<Clock size={18} className="text-red-500" />} color="bg-red-50" sub={pendingPayments.length > 0 ? 'Needs review' : undefined} />
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Today's Meal Summary</h3>
        {[
          { meal: 'Breakfast', eating: eatingToday - 1, vetoed: vetoedToday + 1, veg: 3, nonveg: 2 },
          { meal: 'Lunch', eating: eatingToday, vetoed: vetoedToday, veg: 3, nonveg: 2 },
          { meal: 'Dinner', eating: students.length, vetoed: 0, veg: 3, nonveg: 2 },
        ].map(row => (
          <div key={row.meal} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="text-sm font-semibold text-gray-700 w-20">{row.meal}</div>
            <div className="flex gap-4 text-xs"><span className="text-green-600 font-medium">{row.eating} eating</span><span className="text-red-500">{row.vetoed} vetoed</span><span className="text-gray-500">V:{row.veg} NV:{row.nonveg}</span></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Verify Payments', icon: <CreditCard size={16} />, color: 'bg-orange-50 text-orange-600 border-orange-100', badge: pendingPayments.length, page: 'payments' },
            { label: 'Send Reminder', icon: <AlertCircle size={16} />, color: 'bg-blue-50 text-blue-600 border-blue-100', page: 'notifications' },
            { label: 'Add Expense', icon: <PlusCircle size={16} />, color: 'bg-green-50 text-green-600 border-green-100', page: 'expenses' },
            { label: 'Generate Bill', icon: <FileText size={16} />, color: 'bg-purple-50 text-purple-600 border-purple-100', page: 'reports' },
          ].map(action => (
            <button key={action.label} onClick={() => onNavigate(action.page)} className={`relative flex items-center gap-2 px-3 py-3 rounded-xl border ${action.color} text-sm font-medium transition-all hover:opacity-80 active:scale-95`}>
              {action.icon}<span>{action.label}</span>
              {action.badge ? <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{action.badge}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.slice(0, 8).map((item, i) => (
            <div key={i} className="flex items-start gap-3"><div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-blue-400" /><div className="flex-1 min-w-0"><div className="text-xs text-gray-700">{item.text}</div><div className="text-xs text-gray-400 mt-0.5">{item.time}</div></div></div>
          ))}
        </div>
      </div>

      <div className="hidden">{formatDate(new Date())}</div>
    </div>
  );
};
