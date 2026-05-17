import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { mockExpenses } from '../../utils/mockData';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency, formatDate, getCurrentMonth } from '../../utils/helpers';
import { Expense, ExpenseCategory } from '../../types';

const CATEGORIES: ExpenseCategory[] = ['Rice', 'Vegetables', 'Meat', 'Gas', 'Salary', 'Maintenance', 'Miscellaneous'];
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Rice: 'bg-yellow-100 text-yellow-800', Vegetables: 'bg-green-100 text-green-800', Meat: 'bg-red-100 text-red-800',
  Gas: 'bg-blue-100 text-blue-800', Salary: 'bg-purple-100 text-purple-800', Maintenance: 'bg-gray-100 text-gray-700', Miscellaneous: 'bg-orange-100 text-orange-800',
};

export const ExpensesPage: React.FC = () => {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [form, setForm] = useState({ category: 'Vegetables' as ExpenseCategory, amount: '', date: new Date().toISOString().split('T')[0], note: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = 'Enter valid amount';
    if (!form.date) errs.date = 'Date required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    const newExpense: Expense = { id: `exp-${Date.now()}`, category: form.category, amount: Number(form.amount), date: form.date, note: form.note, addedBy: 'admin-uid', month: getCurrentMonth(), createdAt: new Date() };
    setExpenses(prev => [newExpense, ...prev]);
    setSaving(false);
    showToast('Expense added!', 'success');
    setShowModal(false);
    setForm({ category: 'Vegetables', amount: '', date: new Date().toISOString().split('T')[0], note: '' });
  };

  const summary = CATEGORIES.map(cat => ({ cat, total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0) })).filter(s => s.total > 0);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-[#ea4335] to-red-500 rounded-2xl p-5 text-white shadow-lg shadow-red-200">
        <div className="text-sm text-red-100 font-medium">Total Expenses This Month</div>
        <div className="text-3xl font-bold mt-1">{formatCurrency(total)}</div>
        <div className="text-red-200 text-xs mt-1">{expenses.length} transactions</div>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">By Category</h3>
        <div className="space-y-2">{summary.map(({ cat, total: catTotal }) => (
          <div key={cat} className="flex items-center justify-between"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[cat]}`}>{cat}</span><span className="text-sm font-bold text-gray-900">{formatCurrency(catTotal)}</span></div>
        ))}</div>
      </div>
      <Button variant="primary" fullWidth onClick={() => setShowModal(true)}><Plus size={16} /> Add Expense</Button>
      <div className="space-y-2">{expenses.map(exp => (
        <div key={exp.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[exp.category]}`}>{exp.category}</span><span className="text-xs text-gray-400">{formatDate(new Date(exp.date + 'T00:00:00'))}</span></div>{exp.note && <div className="text-xs text-gray-500 truncate">{exp.note}</div>}</div>
          <div className="text-sm font-bold text-gray-900 flex-shrink-0">{formatCurrency(exp.amount)}</div>
        </div>
      ))}</div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Expense">
        <div className="space-y-3">
          <Select label="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ExpenseCategory }))} options={CATEGORIES.map(c => ({ value: c, label: c }))} />
          <Input label="Amount (Rs)" type="number" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} error={formErrors.amount} />
          <Input label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} error={formErrors.date} />
          <Textarea label="Note (optional)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Additional details..." />
          <Button variant="primary" fullWidth loading={saving} onClick={handleAdd}>Add Expense</Button>
        </div>
      </Modal>
    </div>
  );
};
