import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../contexts/ToastContext';
import { generateMockMeals } from '../../utils/mockData';
import { MealRecord } from '../../types';
import { isCutoffPassed } from '../../utils/helpers';

const CUTOFFS = { breakfast: '05:00', lunch: '07:00', dinner: '15:30' };

export const MealsTab: React.FC = () => {
  const { userData } = useAuth();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const meals = generateMockMeals(userData?.uid || 'student1-uid');
  const mealsByDate = meals.reduce<Record<string, MealRecord>>((acc, m) => { acc[m.date] = m; return acc; }, {});
  const [tempVetos, setTempVetos] = useState({ breakfast: false, lunch: false, dinner: false });

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); };

  const handleDateTap = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const meal = mealsByDate[dateStr];
    const today = new Date();
    const tapDate = new Date(dateStr);
    if (tapDate < today && tapDate.toDateString() !== today.toDateString()) return;
    if (tapDate.toDateString() === today.toDateString() && isCutoffPassed(CUTOFFS.dinner)) return;
    setTempVetos({ breakfast: meal?.breakfast === 'vetoed', lunch: meal?.lunch === 'vetoed', dinner: meal?.dinner === 'vetoed' });
    setSelectedDate(dateStr);
  };

  const handleSaveVeto = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    showToast('Meal preferences saved!', 'success');
    setSelectedDate(null);
  };

  const formatModalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getDotColor = (meal: MealRecord | undefined) => {
    if (!meal) return null;
    const allVetoed = meal.breakfast === 'vetoed' && meal.lunch === 'vetoed' && meal.dinner === 'vetoed';
    const anyVetoed = meal.breakfast === 'vetoed' || meal.lunch === 'vetoed' || meal.dinner === 'vetoed';
    if (allVetoed) return 'bg-red-500';
    if (anyVetoed) return 'bg-orange-400';
    return 'bg-green-500';
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft size={20} className="text-gray-600" /></button>
          <span className="font-bold text-gray-900">{monthNames[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100"><ChevronRight size={20} className="text-gray-600" /></button>
        </div>
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const meal = mealsByDate[dateStr];
            const today = new Date();
            const thisDate = new Date(viewYear, viewMonth, day);
            const isPast = thisDate < today && thisDate.toDateString() !== today.toDateString();
            const isToday = thisDate.toDateString() === today.toDateString();
            const dotColor = getDotColor(meal);
            return (
              <button key={day} onClick={() => handleDateTap(day)} className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${isToday ? 'bg-[#1a73e8] text-white' : isPast ? 'opacity-50 cursor-default' : 'hover:bg-blue-50'}`}>
                <span className={`text-sm font-medium ${isToday ? 'text-white' : 'text-gray-800'}`}>{day}</span>
                {dotColor && <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isToday ? 'bg-white opacity-80' : dotColor}`} />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-green-500" /> Eating</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-orange-400" /> Partial veto</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-red-500" /> Full veto</div>
        </div>
      </div>

      <Modal isOpen={!!selectedDate} onClose={() => setSelectedDate(null)} title="Set Meal Preference">
        {selectedDate && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{formatModalDate(selectedDate)}</p>
            <p className="text-xs text-gray-400">Toggle meals you want to skip (veto)</p>
            {(['breakfast', 'lunch', 'dinner'] as const).map(meal => {
              const cutoff = CUTOFFS[meal];
              const locked = isCutoffPassed(cutoff);
              return (
                <div key={meal} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div><div className="text-sm font-semibold text-gray-900 capitalize">{meal}</div><div className="text-xs text-gray-400">Cutoff: {cutoff}</div></div>
                  {locked ? <div className="flex items-center gap-1.5 text-gray-400 text-xs"><Lock size={12} /> Locked</div> : (
                    <button onClick={() => setTempVetos(v => ({ ...v, [meal]: !v[meal] }))} className={`w-12 h-6 rounded-full transition-colors ${tempVetos[meal] ? 'bg-red-500' : 'bg-green-500'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow mx-0.5 transition-transform ${tempVetos[meal] ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  )}
                </div>
              );
            })}
            <div className="flex gap-3 mt-2">
              <Button variant="secondary" fullWidth onClick={() => setSelectedDate(null)}>Cancel</Button>
              <Button variant="primary" fullWidth loading={saving} onClick={handleSaveVeto}>Save</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
