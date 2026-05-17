import React, { useState } from 'react';
import { Search, Plus, ChevronRight, Leaf, Drumstick } from 'lucide-react';
import { mockUsers, mockPayments } from '../../utils/mockData';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { User } from '../../types';

export const StudentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', roomNumber: '', vegPreference: 'veg', password: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const students = mockUsers.filter(u => u.role === 'student' && u.isActive);
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.roomNumber.toLowerCase().includes(search.toLowerCase()));

  const getPaymentStatus = (studentId: string) => {
    const payments = mockPayments.filter(p => p.studentId === studentId);
    if (payments.find(p => p.status === 'verified')) return 'paid';
    if (payments.find(p => p.status === 'pending')) return 'pending';
    return 'unpaid';
  };

  const getVetoStatus = (studentId: string) => studentId === 'student1-uid' ? 'Vetoed dinner' : null;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = 'Required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.phone || form.phone.length < 10) errs.phone = 'Valid phone required';
    if (!form.roomNumber) errs.roomNumber = 'Required';
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddStudent = async () => {
    if (!validateForm()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    showToast('Student added successfully!', 'success');
    setShowAddModal(false);
    setForm({ name: '', email: '', phone: '', roomNumber: '', vegPreference: 'veg', password: '' });
  };

  const studentPayments = selectedStudent ? mockPayments.filter(p => p.studentId === selectedStudent.uid) : [];

  return (
    <div className="space-y-4 relative">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="w-full h-12 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" placeholder="Search by name or room..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="text-xs text-gray-500">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</div>
      <div className="space-y-2">
        {filtered.map(student => {
          const payStatus = getPaymentStatus(student.uid);
          const vetoStatus = getVetoStatus(student.uid);
          return (
            <button key={student.uid} onClick={() => setSelectedStudent(student)} className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 text-left hover:border-blue-200 transition-all active:bg-blue-50">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">{student.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1"><span className="text-sm font-semibold text-gray-900 truncate">{student.name}</span>{student.vegPreference === 'veg' ? <Leaf size={12} className="text-green-500 flex-shrink-0" /> : <Drumstick size={12} className="text-red-500 flex-shrink-0" />}</div>
                <div className="flex items-center gap-2 flex-wrap"><span className="text-xs text-gray-500">Room {student.roomNumber}</span><Badge variant={payStatus === 'paid' ? 'success' : payStatus === 'pending' ? 'warning' : 'error'}>{payStatus === 'paid' ? 'Paid' : payStatus === 'pending' ? 'Pending' : 'Unpaid'}</Badge>{vetoStatus && <Badge variant="warning">{vetoStatus}</Badge>}</div>
              </div>
              <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
            </button>
          );
        })}
      </div>

      <button onClick={() => setShowAddModal(true)} className="fixed bottom-6 right-5 w-14 h-14 bg-[#1a73e8] rounded-full flex items-center justify-center shadow-lg shadow-blue-300 hover:bg-blue-700 transition-all active:scale-95 z-40"><Plus size={24} className="text-white" /></button>

      <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Student Details">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">{selectedStudent.name.charAt(0)}</div>
              <div><div className="text-lg font-bold text-gray-900">{selectedStudent.name}</div><div className="text-sm text-gray-500">{selectedStudent.email}</div><div className="text-xs text-gray-400">Room {selectedStudent.roomNumber}</div></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-500">Phone</div><div className="text-sm font-semibold text-gray-900">{selectedStudent.phone}</div></div>
              <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-500">Preference</div><div className="text-sm font-semibold text-gray-900 capitalize">{selectedStudent.vegPreference}</div></div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="text-xs font-semibold text-blue-700 mb-2">Current Bill</div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Total</span><span className="font-bold">{formatCurrency(3200)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Paid</span><span className="font-bold text-green-600">{formatCurrency(studentPayments.filter(p => p.status === 'verified').reduce((s, p) => s + p.amount, 0))}</span></div>
            </div>
            {studentPayments.length > 0 && (
              <div><div className="text-xs font-bold text-gray-700 mb-2">Payment History</div>
                {studentPayments.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div><div className="text-sm font-medium text-gray-900">{formatCurrency(p.amount)}</div><div className="text-xs text-gray-400">{formatDate(p.createdAt)}</div></div>
                    <Badge variant={p.status === 'verified' ? 'success' : p.status === 'rejected' ? 'error' : 'warning'}>{p.status}</Badge>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2"><Button variant="outline" fullWidth>Edit</Button><Button variant="danger" fullWidth>Deactivate</Button></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Student">
        <div className="space-y-3">
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={formErrors.name} placeholder="Arjun Sharma" />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={formErrors.email} placeholder="arjun@example.com" />
          <Input label="Phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} error={formErrors.phone} placeholder="9876543210" />
          <Input label="Room Number" value={form.roomNumber} onChange={e => setForm(f => ({ ...f, roomNumber: e.target.value }))} error={formErrors.roomNumber} placeholder="101" />
          <Select label="Food Preference" value={form.vegPreference} onChange={e => setForm(f => ({ ...f, vegPreference: e.target.value }))} options={[{ value: 'veg', label: 'Vegetarian' }, { value: 'nonveg', label: 'Non-Vegetarian' }]} />
          <Input label="Temporary Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={formErrors.password} placeholder="Min 6 characters" />
          <Button variant="primary" fullWidth loading={saving} onClick={handleAddStudent}>Add Student</Button>
        </div>
      </Modal>
    </div>
  );
};
