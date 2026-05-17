import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, LogOut, ChefHat } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { mockUsers, mockMenuItems } from '../../utils/mockData';
import { getTodayDayName, getDayName, formatDate } from '../../utils/helpers';

export const CookDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const students = mockUsers.filter(u => u.role === 'student' && u.isActive);
  const today = getTodayDayName();
  const todayMenu = mockMenuItems.find(m => m.day === today);
  const eatingBreakfast = students.length - 1;
  const eatingLunch = students.length - 2;
  const eatingDinner = students.length;
  const vegCount = students.filter(s => s.vegPreference === 'veg').length;
  const nonVegCount = students.filter(s => s.vegPreference === 'nonveg').length;
  const absentStudents = [students[0]?.name, students[1]?.name].filter(Boolean);

  const refresh = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLastRefresh(new Date());
    setLoading(false);
    showToast('Data refreshed', 'success');
  }, [showToast]);

  useEffect(() => { const interval = setInterval(refresh, 5 * 60 * 1000); return () => clearInterval(interval); }, [refresh]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1a73e8] rounded-xl flex items-center justify-center"><ChefHat size={18} className="text-white" /></div>
            <div><div className="font-bold text-gray-900">Cook View</div><div className="text-xs text-gray-400">{formatDate(new Date())}</div></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} className={`w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 ${loading ? 'opacity-50' : ''}`} disabled={loading}>
              <RefreshCw size={16} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={logout} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-red-50"><LogOut size={16} className="text-gray-600" /></button>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-1">Last updated: {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} · Auto-refreshes every 5 min</div>
      </div>

      <div className="px-4 py-5 space-y-4">
        <div className="space-y-3">
          <MealCountCard label="BREAKFAST" count={eatingBreakfast} />
          <MealCountCard label="LUNCH" count={eatingLunch} />
          <MealCountCard label="DINNER" count={eatingDinner} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#34a853] rounded-2xl p-5 text-white text-center shadow-sm"><div className="text-5xl font-bold mb-1">{vegCount}</div><div className="text-base font-semibold text-green-100">VEG</div></div>
          <div className="bg-orange-500 rounded-2xl p-5 text-white text-center shadow-sm"><div className="text-5xl font-bold mb-1">{nonVegCount}</div><div className="text-base font-semibold text-orange-100">NON-VEG</div></div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Absent / Vetoed Today</h3>
          {absentStudents.length === 0 ? <div className="text-sm text-gray-400">All students eating today</div> : (
            <div className="space-y-2">{absentStudents.map((name, i) => <div key={i} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-sm text-gray-700">{name}</span></div>)}</div>
          )}
        </div>
        {todayMenu && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Today's Menu <span className="text-gray-400 font-normal ml-1">({getDayName(today)})</span></h3>
            <div className="space-y-3">
              {[['Breakfast', todayMenu.breakfast], ['Lunch', todayMenu.lunch], ['Dinner', todayMenu.dinner]].map(([meal, item]) => (
                <div key={meal} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0"><div className="w-16 text-xs font-semibold text-gray-500 pt-0.5 flex-shrink-0">{meal}</div><div className="text-sm text-gray-800 leading-relaxed">{item}</div></div>
              ))}
            </div>
          </div>
        )}
        <p className="text-center text-xs text-gray-400">&copy; {new Date().getFullYear()} Pritom Karmokar</p>
      </div>
    </div>
  );
};

const MealCountCard: React.FC<{ label: string; count: number }> = ({ label, count }) => (
  <div className="bg-[#1a73e8] rounded-2xl p-6 text-white shadow-sm">
    <div className="text-center"><div className="text-6xl font-black mb-2">{count}</div><div className="text-xl font-bold text-blue-100 tracking-widest">{label}</div></div>
  </div>
);
