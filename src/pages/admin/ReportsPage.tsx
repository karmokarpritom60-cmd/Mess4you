import React, { useState } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, Calculator } from 'lucide-react';
import { mockUsers, mockExpenses, mockPayments } from '../../utils/mockData';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency, getMonthName, getCurrentMonth } from '../../utils/helpers';

export const ReportsPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [generating, setGenerating] = useState(false);

  const students = mockUsers.filter(u => u.role === 'student' && u.isActive);
  const totalExpense = mockExpenses.filter(e => e.month === selectedMonth).reduce((s, e) => s + e.amount, 0);
  const baseAmount = 2500;
  const totalStudents = students.length;
  const totalCollection = mockPayments.filter(p => p.month.startsWith(selectedMonth) && p.status === 'verified').reduce((s, p) => s + p.amount, 0);
  const deficit = totalExpense - (baseAmount * totalStudents);
  const totalActiveMeals = totalStudents * 90;
  const perMealRate = totalActiveMeals > 0 ? deficit / totalActiveMeals : 0;

  const studentBills = students.map(s => {
    const paid = mockPayments.filter(p => p.studentId === s.uid && p.status === 'verified').reduce((sum, p) => sum + p.amount, 0);
    const totalMeals = 85;
    const extraCharge = Math.round(totalMeals * perMealRate);
    const total = baseAmount + Math.max(0, extraCharge);
    const balance = Math.max(0, total - paid);
    return { student: s, paid, totalMeals, extraCharge: Math.max(0, extraCharge), total, balance, status: balance === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid' };
  });

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    setGenerating(false);
    showToast('Bills generated for all students!', 'success');
  };

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { value: m, label: getMonthName(m) };
  });

  return (
    <div className="space-y-4">
      <select className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
        {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100"><div className="flex items-center gap-2 mb-1"><TrendingDown size={14} className="text-red-500" /><span className="text-xs font-medium text-red-600">Total Expense</span></div><div className="text-xl font-bold text-red-700">{formatCurrency(totalExpense)}</div></div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100"><div className="flex items-center gap-2 mb-1"><TrendingUp size={14} className="text-green-600" /><span className="text-xs font-medium text-green-600">Total Collection</span></div><div className="text-xl font-bold text-green-700">{formatCurrency(totalCollection)}</div></div>
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100"><div className="flex items-center gap-2 mb-1"><DollarSign size={14} className="text-orange-600" /><span className="text-xs font-medium text-orange-600">Deficit</span></div><div className="text-xl font-bold text-orange-700">{formatCurrency(deficit)}</div></div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100"><div className="flex items-center gap-2 mb-1"><Calculator size={14} className="text-blue-600" /><span className="text-xs font-medium text-blue-600">Per Meal Rate</span></div><div className="text-xl font-bold text-blue-700">{formatCurrency(Math.round(perMealRate))}</div></div>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Bill Formula</h3>
        <div className="space-y-2 text-xs text-gray-600 font-mono bg-gray-50 rounded-xl p-3">
          <div>Deficit = Expense - (Base x Students)</div>
          <div>= {formatCurrency(totalExpense)} - ({formatCurrency(baseAmount)} x {totalStudents})</div>
          <div>= <span className="font-bold text-orange-600">{formatCurrency(deficit)}</span></div>
          <div className="border-t border-gray-200 pt-2 mt-2">Per Meal = Deficit / Total Meals</div>
          <div>= {formatCurrency(deficit)} / {totalActiveMeals} = <span className="font-bold text-blue-600">{formatCurrency(Math.round(perMealRate))}/meal</span></div>
          <div className="border-t border-gray-200 pt-2 mt-2">Student Bill = Base + (Meals x Rate) - Paid</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" fullWidth loading={generating} onClick={handleGenerate}><Calculator size={14} /> Generate Bills</Button>
        <Button variant="outline" fullWidth><Download size={14} /> Export</Button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-900">Student-wise Bills</h3></div>
        {studentBills.map(({ student, paid, total, balance, status }) => (
          <div key={student.uid} className="px-4 py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-center justify-between mb-1">
              <div><div className="text-sm font-semibold text-gray-900">{student.name}</div><div className="text-xs text-gray-400">Room {student.roomNumber}</div></div>
              <Badge variant={status === 'paid' ? 'success' : status === 'partial' ? 'warning' : 'error'}>{status === 'paid' ? 'Paid' : status === 'partial' ? 'Partial' : 'Unpaid'}</Badge>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>Bill: <strong className="text-gray-900">{formatCurrency(total)}</strong></span>
              <span>Paid: <strong className="text-green-600">{formatCurrency(paid)}</strong></span>
              {balance > 0 && <span>Due: <strong className="text-red-500">{formatCurrency(balance)}</strong></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
