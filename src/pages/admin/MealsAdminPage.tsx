import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { mockUsers, generateMockMeals } from '../../utils/mockData';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/helpers';
import { MealStatus } from '../../types';

const statusBadge = (status: MealStatus) => {
  if (status === 'eating') return <Badge variant="success">Eating</Badge>;
  if (status === 'vetoed') return <Badge variant="error">Vetoed</Badge>;
  return <Badge variant="gray">Locked</Badge>;
};

export const MealsAdminPage: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  const students = mockUsers.filter(u => u.role === 'student' && u.isActive);

  const getMealForDate = (studentId: string, date: string) => generateMockMeals(studentId).find(m => m.date === date);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-500 mb-1 block">Select Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" />
        </div>
        <button className="flex items-center gap-2 h-12 px-4 mt-5 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-medium"><Download size={14} /> CSV</button>
      </div>
      <div className="text-xs text-gray-500">{formatDate(new Date(selectedDate + 'T00:00:00'))}</div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="text-xs font-semibold text-gray-500 col-span-2">Student</div>
          <div className="text-xs font-semibold text-gray-500 text-center">B'fast</div>
          <div className="text-xs font-semibold text-gray-500 text-center">Lunch</div>
          <div className="text-xs font-semibold text-gray-500 text-center">Dinner</div>
        </div>
        {students.map(student => {
          const meal = getMealForDate(student.uid, selectedDate);
          return (
            <div key={student.uid} className="grid grid-cols-5 gap-2 px-4 py-3 items-center border-b border-gray-50 last:border-0">
              <div className="col-span-2 min-w-0"><div className="text-sm font-semibold text-gray-900 truncate">{student.name}</div><div className="text-xs text-gray-400">Rm {student.roomNumber}</div></div>
              <div className="flex justify-center">{meal ? statusBadge(meal.breakfast) : <Badge variant="gray">-</Badge>}</div>
              <div className="flex justify-center">{meal ? statusBadge(meal.lunch) : <Badge variant="gray">-</Badge>}</div>
              <div className="flex justify-center">{meal ? statusBadge(meal.dinner) : <Badge variant="gray">-</Badge>}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
