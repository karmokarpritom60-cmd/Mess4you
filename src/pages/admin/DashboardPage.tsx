import React, { useState, useEffect } from 'react';
import { Users, Utensils, XCircle, CreditCard, AlertCircle, PlusCircle, FileText, TrendingDown } from 'lucide-react';
import { getAllStudents, getPendingPayments, getExpensesForMonth, getPaymentsForMonth, subscribeToDayMeals } from '../../services/firestore';
import { formatDate, getCurrentMonth } from '../../utils/helpers';
import { Skeleton } from '../../components/ui/Skeleton';

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; color: string; sub?: string }> = ({ label, value, icon, color, sub }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
    <div className="min-w-0"><div className="text-xl font-bold text-gray-900">{value}</div><div className="text-xs text-gray-500 leading-tight">{label}</div>{sub && <div className="text-xs text-red-500 mt-0.5">{sub}</div>}</div>
  </div>
);

export const DashboardPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [todayMeals, setTodayMeals] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalCollection, setTotalCollection] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const month = getCurrentMonth();

        // Load students
        const allStudents = await getAllStudents();
        setStudents(allStudents.length);

        // Load pending payments
        const pending = await getPendingPayments();
        setPendingPayments(pending.length);

        // Load today's meals
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const unsubscribe = subscribeToDayMeals(todayStr, (meals) => {
          const eating = {
            breakfast: meals.filter(m => m.breakfast === 'eating').length,
            lunch: meals.filter(m => m.lunch === 'eating').length,
            dinner: meals.filter(m => m.dinner === 'eating').length,
          };
          setTodayMeals(eating);
        });

        // Load expenses
        const expenses = await getExpensesForMonth(month);
        const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
        setTotalExpense(expenseTotal);

        // Load collection
        const payments = await getPaymentsForMonth(month);
        const collected = payments.filter(p => p.status === 'verified').reduce((s, p) => s + p.amount, 0);
        setTotalCollection(collected);

        setLoading(false);
        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const eatingToday = todayMeals.breakfast;
  const vetoedToday = 2;

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Students" value={students} icon={<Users size={18} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard label="Eating Today" value={eatingToday} icon={<Utensils size={18} className="text-green-600" />} color="bg-green-50" />
        <StatCard label="Vetoed Today" value={vetoedToday} icon={<XCircle size={18} className="text-orange-500" />} color="bg-orange-50" />
        <StatCard label="Pending Review" value={pendingPayments} icon={<CreditCard size={18} className="text-red-500" />} color="bg-red-50" sub={pendingPayments > 0 ? 'Action needed' : undefined} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100"><div className="flex items-center gap-2 mb-2"><TrendingDown size={14} className="text-red-600" /><span className="text-xs font-semibold text-red-600">Total Expense</span></div><div className="text-2xl font-bold text-red-700">Rs {totalExpense.toLocaleString('en-IN')}</div></div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100"><div className="flex items-center gap-2 mb-2"><TrendingDown size={14} className="text-green-600" /><span className="text-xs font-semibold text-green-600">Total Collection</span></div><div className="text-2xl font-bold text-green-700">Rs {totalCollection.toLocaleString('en-IN')}</div></div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Today's Meal Summary</h3>
        {[
          { meal: 'Breakfast', eating: eatingToday, vetoed: 1, veg: 3, nonveg: 2 },
          { meal: 'Lunch', eating: eatingToday, vetoed: 1, veg: 3, nonveg: 2 },
          { meal: 'Dinner', eating: students, vetoed: 0, veg: 3, nonveg: 2 },
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
            { label: 'Verify Payments', icon: <CreditCard size={16} />, color: 'bg-orange-50 text-orange-600 border-orange-100', badge: pendingPayments, page: 'payments' },
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

      <div className="hidden">{formatDate(new Date())}</div>
    </div>
  );
};
