import React, { useState } from 'react';
import { mockMenuItems } from '../../utils/mockData';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { getDayName, getTodayDayName } from '../../utils/helpers';
import { MenuItem } from '../../types';

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const MenuAdminPage: React.FC = () => {
  const { showToast } = useToast();
  const [menu, setMenu] = useState<MenuItem[]>(mockMenuItems);
  const [saving, setSaving] = useState(false);
  const today = getTodayDayName();

  const updateItem = (day: string, meal: 'breakfast' | 'lunch' | 'dinner', value: string) => {
    setMenu(prev => prev.map(m => m.day === day ? { ...m, [meal]: value } : m));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    showToast('Menu saved!', 'success');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {dayOrder.map(day => {
          const item = menu.find(m => m.day === day) || { day, breakfast: '', lunch: '', dinner: '', updatedAt: new Date(), updatedBy: '' };
          const isToday = day === today;
          return (
            <div key={day} className={`bg-white rounded-2xl p-4 shadow-sm border ${isToday ? 'border-blue-200' : 'border-gray-100'}`}>
              <div className={`text-sm font-bold mb-3 ${isToday ? 'text-[#1a73e8]' : 'text-gray-700'}`}>{getDayName(day)} {isToday && <span className="text-xs font-normal text-blue-400">(Today)</span>}</div>
              <div className="space-y-2">
                {(['breakfast', 'lunch', 'dinner'] as const).map(meal => (
                  <div key={meal} className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-gray-400 w-16 pt-2.5 flex-shrink-0 capitalize">{meal}</span>
                    <input className="flex-1 h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all" value={item[meal]} onChange={e => updateItem(day, meal, e.target.value)} placeholder={`Enter ${meal} menu...`} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Button variant="primary" fullWidth size="lg" loading={saving} onClick={handleSave}>Save Menu</Button>
    </div>
  );
};
