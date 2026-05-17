import React, { useState } from 'react';
import { Clock, DollarSign, QrCode, Users, Plus, Trash2, Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import { mockSettings, mockUsers } from '../../utils/mockData';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../contexts/ToastContext';
import { formatTime } from '../../utils/helpers';
import { Settings } from '../../types';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

const defaultSchedule = Object.fromEntries(DAYS.flatMap(d => [[`${d}_breakfast`, true], [`${d}_lunch`, true], [`${d}_dinner`, true]]));

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Settings>(mockSettings);
  const [saving, setSaving] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<Record<string, boolean>>(defaultSchedule);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const admins = mockUsers.filter(u => u.role === 'admin');

  const handleSave = async (key: string) => {
    setSaving(key);
    await new Promise(r => setTimeout(r, 800));
    setSaving(null);
    showToast('Settings saved!', 'success');
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !/\S+@\S+\.\S+/.test(newAdminEmail)) { showToast('Enter a valid email', 'warning'); return; }
    setAddingAdmin(true);
    await new Promise(r => setTimeout(r, 800));
    setAddingAdmin(false);
    showToast('Admin added!', 'success');
    setNewAdminEmail('');
  };

  const toggleSchedule = (key: string) => setSchedule(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-5">
      <Section title="Meal Cutoff Times" icon={<Clock size={16} className="text-[#1a73e8]" />}>
        <div className="space-y-3">
          {[
            { label: 'Breakfast Cutoff', key: 'breakfastCutoff' as keyof Settings },
            { label: 'Lunch Cutoff', key: 'lunchCutoff' as keyof Settings },
            { label: 'Dinner Cutoff', key: 'dinnerCutoff' as keyof Settings },
          ].map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <div><div className="text-sm font-medium text-gray-700">{label}</div><div className="text-xs text-gray-400">{formatTime(settings[key] as string)}</div></div>
              <input type="time" value={settings[key] as string} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} className="h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" />
            </div>
          ))}
          <Button variant="primary" fullWidth loading={saving === 'cutoffs'} onClick={() => handleSave('cutoffs')}>Save Cutoff Times</Button>
        </div>
      </Section>

      <Section title="Base Amount" icon={<DollarSign size={16} className="text-[#34a853]" />}>
        <div className="space-y-3">
          <Input label="Monthly Base Amount (Rs)" type="number" value={String(settings.baseAmount)} onChange={e => setSettings(s => ({ ...s, baseAmount: Number(e.target.value) }))} placeholder="2500" helperText="Fixed monthly charge per student" />
          <Button variant="primary" fullWidth loading={saving === 'base'} onClick={() => handleSave('base')}>Save</Button>
        </div>
      </Section>

      <Section title="Payment Settings" icon={<QrCode size={16} className="text-orange-500" />}>
        <div className="space-y-3">
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">QR Code Image</label><button className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 flex flex-col items-center gap-2 hover:border-[#1a73e8]"><Upload size={18} className="text-gray-400" /><span className="text-sm text-gray-500">Upload QR Image</span></button></div>
          <Input label="UPI ID" value={settings.upiId} onChange={e => setSettings(s => ({ ...s, upiId: e.target.value }))} placeholder="yourname@upi" />
          <Input label="Payment Phone Number" value={settings.paymentPhone} onChange={e => setSettings(s => ({ ...s, paymentPhone: e.target.value }))} placeholder="9876543210" />
          <Button variant="primary" fullWidth loading={saving === 'payment'} onClick={() => handleSave('payment')}>Save Payment Settings</Button>
        </div>
      </Section>

      <Section title="Admin Management" icon={<Users size={16} className="text-purple-600" />}>
        <div className="space-y-3">
          <div className="space-y-2">{admins.map(admin => (
            <div key={admin.uid} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div><div className="text-sm font-semibold text-gray-900">{admin.name}</div><div className="text-xs text-gray-400">{admin.email}</div></div>
              <button className="p-2 rounded-lg hover:bg-red-50"><Trash2 size={14} className="text-red-500" /></button>
            </div>
          ))}</div>
          <div className="flex gap-2">
            <input className="flex-1 h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]" placeholder="Admin email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} type="email" />
            <Button variant="primary" loading={addingAdmin} onClick={handleAddAdmin}><Plus size={14} /></Button>
          </div>
        </div>
      </Section>

      <Section title="Meal Schedule" icon={<Clock size={16} className="text-blue-500" />}>
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-1 mb-2">
            <div className="text-xs font-semibold text-gray-400">Day</div>
            <div className="text-xs font-semibold text-gray-400 text-center">B'fast</div>
            <div className="text-xs font-semibold text-gray-400 text-center">Lunch</div>
            <div className="text-xs font-semibold text-gray-400 text-center">Dinner</div>
          </div>
          {DAYS.map(day => (
            <div key={day} className="grid grid-cols-4 gap-1 items-center py-1 border-b border-gray-50 last:border-0">
              <div className="text-sm font-medium text-gray-700">{DAY_LABELS[day]}</div>
              {(['breakfast', 'lunch', 'dinner'] as const).map(meal => {
                const key = `${day}_${meal}`;
                return <button key={meal} onClick={() => toggleSchedule(key)} className="flex justify-center">{schedule[key] ? <ToggleRight size={22} className="text-[#34a853]" /> : <ToggleLeft size={22} className="text-gray-300" />}</button>;
              })}
            </div>
          ))}
        </div>
        <Button variant="primary" fullWidth loading={saving === 'schedule'} onClick={() => handleSave('schedule')} className="mt-3">Save Schedule</Button>
      </Section>
    </div>
  );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-center gap-2 mb-4">{icon}<h3 className="text-sm font-bold text-gray-900">{title}</h3></div>
    {children}
  </div>
);
