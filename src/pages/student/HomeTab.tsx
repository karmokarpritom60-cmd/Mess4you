import React, { useState, useEffect } from 'react';
import { Bell, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { getGreeting, formatCurrency, getCountdownToString, formatDate } from '../../utils/helpers';
import { mockSettings, mockPayments, mockNotifications } from '../../utils/mockData';
import { MealStatus } from '../../types';

const MealCard: React.FC<{ label: string; status: MealStatus; cutoffTime: string }> = ({ label, status, cutoffTime }) => {
  const [countdown, setCountdown] = useState(getCountdownToString(cutoffTime));
  useEffect(() => {
    if (status === 'locked') return;
    const interval = setInterval(() => setCountdown(getCountdownToString(cutoffTime)), 30000);
    return () => clearInterval(interval);
  }, [cutoffTime, status]);

  const cfg: Record<MealStatus, { bg: string; dot: string; text: string; label: string }> = {
    eating: { bg: 'bg-green-50 border-green-200', dot: 'bg-[#34a853]', text: 'text-green-700', label: 'Eating' },
    vetoed: { bg: 'bg-red-50 border-red-200', dot: 'bg-[#ea4335]', text: 'text-red-700', label: 'Vetoed' },
    locked: { bg: 'bg-gray-50 border-gray-200', dot: 'bg-gray-400', text: 'text-gray-500', label: 'Locked' },
  };
  const c = cfg[status];

  return (
    <div className={`flex-1 rounded-2xl border ${c.bg} p-3`}>
      <div className="text-xs font-semibold text-gray-500 mb-2">{label}</div>
      <div className={`w-3 h-3 rounded-full ${c.dot} mb-1`} />
      <div className={`text-xs font-bold ${c.text}`}>{c.label}</div>
      {status !== 'locked' && <div className="text-xs text-gray-400 mt-0.5">{countdown}</div>}
    </div>
  );
};

export const HomeTab: React.FC = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const settings = mockSettings;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const studentPayments = mockPayments.filter(p => p.studentId === userData?.uid);
  const totalBill = 3200;
  const paid = studentPayments.filter(p => p.status === 'verified').reduce((s, p) => s + p.amount, 0);
  const balance = Math.max(0, totalBill - paid);
  const paymentStatus = balance === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
  const notifications = mockNotifications.filter(n => n.targetType === 'all' || n.targetIds.includes(userData?.uid || '')).slice(0, 3);

  if (loading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-[#1a73e8] to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
        <div className="text-blue-100 text-sm font-medium">{getGreeting()},</div>
        <div className="text-2xl font-bold mt-0.5">{userData?.name?.split(' ')[0]}</div>
        <div className="text-blue-200 text-xs mt-1">Room {userData?.roomNumber}</div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-[#1a73e8]" />
          <span className="text-sm font-bold text-gray-900">Today's Meals</span>
          <span className="text-xs text-gray-400">{formatDate(new Date())}</span>
        </div>
        <div className="flex gap-2">
          <MealCard label="Breakfast" status="locked" cutoffTime={settings.breakfastCutoff} />
          <MealCard label="Lunch" status="locked" cutoffTime={settings.lunchCutoff} />
          <MealCard label="Dinner" status="eating" cutoffTime={settings.dinnerCutoff} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-900">This Month's Bill</span>
          <Badge variant={paymentStatus === 'paid' ? 'success' : paymentStatus === 'partial' ? 'warning' : 'error'}>
            {paymentStatus === 'paid' ? 'Paid' : paymentStatus === 'partial' ? 'Partial' : 'Unpaid'}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center"><div className="text-lg font-bold text-gray-900">{formatCurrency(totalBill)}</div><div className="text-xs text-gray-500">Total</div></div>
          <div className="text-center border-x border-gray-100"><div className="text-lg font-bold text-[#34a853]">{formatCurrency(paid)}</div><div className="text-xs text-gray-500">Paid</div></div>
          <div className="text-center"><div className="text-lg font-bold text-[#ea4335]">{formatCurrency(balance)}</div><div className="text-xs text-gray-500">Due</div></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3"><Bell size={16} className="text-[#1a73e8]" /><span className="text-sm font-bold text-gray-900">Notifications</span></div>
        {notifications.length === 0 ? <div className="text-sm text-gray-400 text-center py-3">No notifications</div> : (
          <div className="space-y-2">
            {notifications.map(notif => (
              <div key={notif.id} className="flex gap-3 items-start">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.type === 'urgent' ? 'bg-red-500' : notif.type === 'important' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-gray-900 truncate">{notif.title}</div><div className="text-xs text-gray-500 line-clamp-2">{notif.message}</div></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
