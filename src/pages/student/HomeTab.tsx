import React, { useState, useEffect } from 'react';
import { Bell, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { getGreeting, formatCurrency } from '../../utils/helpers';
import { getPaymentsForMonth, getExpensesForMonth, getNotifications, getSettings, getMealsForStudent } from '../../services/firestore';
import { getCurrentMonth } from '../../utils/helpers';
import { Notification, Payment } from '../../types';

export const HomeTab: React.FC = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [studentPayments, setStudentPayments] = useState<Payment[]>([]);
  const [studentMeals, setStudentMeals] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalBill, setTotalBill] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!userData) return;
      try {
        const month = getCurrentMonth();

        // Load expenses
        const expenses = await getExpensesForMonth(month);
        const expense = expenses.reduce((sum, e) => sum + e.amount, 0);
        setTotalExpense(expense);

        // Load payments
        const payments = await getPaymentsForMonth(month);
        const verified = payments.filter(p => p.status === 'verified' && p.studentId === userData.uid);
        setStudentPayments(verified);
        const collected = verified.reduce((sum, p) => sum + p.amount, 0);

        // Load settings
        const settings = await getSettings();
        if (settings) {
          const bill = settings.baseAmount + 500; // Add estimated extra charge
          setTotalBill(bill);
          setBalance(Math.max(0, bill - collected));
        }

        // Load meals count for current month
        const meals = await getMealsForStudent(userData.uid);
        const activeMonth = meals.filter(m => m.date.startsWith(month) && m.breakfast === 'eating');
        setStudentMeals(activeMonth.length);

        // Load notifications
        const notifs = await getNotifications(3);
        const relevant = notifs.filter(n => n.targetType === 'all' || n.targetIds.includes(userData.uid));
        setNotifications(relevant);

        setLoading(false);
      } catch (error) {
        console.error('Error loading home data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [userData]);

  const paymentStatus = balance === 0 ? 'paid' : studentPayments.length > 0 ? 'partial' : 'unpaid';

  if (loading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;

  const perStudentDeficit = 500; // Placeholder based on sample calc

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
          <span className="text-sm font-bold text-gray-900">This Month's Finances</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Total Mess Expense</span><span className="font-bold text-gray-900">{formatCurrency(totalExpense)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Your Deficit Share</span><span className="font-bold text-orange-600">{formatCurrency(perStudentDeficit)}</span></div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold"><span className="text-gray-900">Your Bill</span><span className="text-gray-900">{formatCurrency(totalBill)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Amount Paid</span><span className="font-bold text-[#34a853]">{formatCurrency(studentPayments.reduce((s, p) => s + p.amount, 0))}</span></div>
          <div className="flex justify-between"><span className="text-[#ea4335]">Balance Due</span><span className="font-bold text-[#ea4335]">{formatCurrency(balance)}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-900">Your Bill Status</span>
          <Badge variant={paymentStatus === 'paid' ? 'success' : paymentStatus === 'partial' ? 'warning' : 'error'}>
            {paymentStatus === 'paid' ? 'Paid' : paymentStatus === 'partial' ? 'Partial' : 'Unpaid'}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center"><div className="text-lg font-bold text-gray-900">{studentMeals}</div><div className="text-xs text-gray-500">Meals Eaten</div></div>
          <div className="text-center border-x border-gray-100"><div className="text-lg font-bold text-[#1a73e8]">{formatCurrency(totalBill)}</div><div className="text-xs text-gray-500">Total</div></div>
          <div className="text-center"><div className="text-lg font-bold text-[#ea4335]">{formatCurrency(balance)}</div><div className="text-xs text-gray-500">Due</div></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3"><Bell size={16} className="text-[#1a73e8]" /><span className="text-sm font-bold text-gray-900">Recent Notifications</span></div>
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
