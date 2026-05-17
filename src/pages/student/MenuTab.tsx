import React from 'react';
import { BookOpen } from 'lucide-react';
import { mockMenuItems } from '../../utils/mockData';
import { getTodayDayName, getDayName } from '../../utils/helpers';

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const MenuTab: React.FC = () => {
  const today = getTodayDayName();
  const todayMenu = mockMenuItems.find(m => m.day === today);

  return (
    <div className="space-y-4">
      {todayMenu && (
        <div className="bg-gradient-to-r from-[#1a73e8] to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
          <div className="flex items-center gap-2 mb-3"><BookOpen size={16} className="text-blue-200" /><span className="text-sm font-semibold text-blue-100">Today's Menu</span><span className="text-xs text-blue-200 capitalize">({getDayName(today)})</span></div>
          <div className="space-y-2">
            {[['Breakfast', todayMenu.breakfast], ['Lunch', todayMenu.lunch], ['Dinner', todayMenu.dinner]].map(([label, item]) => (
              <div key={label} className="flex items-start gap-3"><div className="text-xs font-semibold text-blue-200 w-16 pt-0.5 flex-shrink-0">{label}</div><div className="text-sm font-medium text-white leading-relaxed">{item}</div></div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Weekly Menu</h3>
        <div className="space-y-3">
          {dayOrder.map(day => {
            const menu = mockMenuItems.find(m => m.day === day);
            const isToday = day === today;
            return (
              <div key={day} className={`rounded-xl p-3 ${isToday ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                <div className={`text-xs font-bold mb-2 ${isToday ? 'text-[#1a73e8]' : 'text-gray-600'}`}>{getDayName(day)} {isToday && '(Today)'}</div>
                {menu ? (
                  <div className="space-y-1">
                    {[['B', menu.breakfast], ['L', menu.lunch], ['D', menu.dinner]].map(([abbr, item]) => (
                      <div key={abbr} className="flex items-start gap-2"><span className={`text-xs font-bold w-4 flex-shrink-0 ${isToday ? 'text-blue-400' : 'text-gray-400'}`}>{abbr}</span><span className="text-xs text-gray-700 leading-relaxed">{item}</span></div>
                    ))}
                  </div>
                ) : <div className="text-xs text-gray-400">No menu set</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
