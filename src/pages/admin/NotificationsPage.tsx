import React, { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import { mockNotifications } from '../../utils/mockData';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../contexts/ToastContext';
import { formatDate } from '../../utils/helpers';
import { Notification, NotificationType, NotificationTarget } from '../../types';

export const NotificationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Notification[]>(mockNotifications);
  const [form, setForm] = useState({ title: '', message: '', type: 'normal' as NotificationType, targetType: 'all' as NotificationTarget });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title required';
    if (!form.message.trim()) errs.message = 'Message required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    const newNotif: Notification = { id: `notif-${Date.now()}`, title: form.title, message: form.message, type: form.type, targetType: form.targetType, targetIds: [], sentBy: 'admin-uid', createdAt: new Date(), readBy: [] };
    setSent(prev => [newNotif, ...prev]);
    setSending(false);
    showToast('Notification sent!', 'success');
    setForm({ title: '', message: '', type: 'normal', targetType: 'all' });
  };

  const typeBadge = (type: NotificationType) => {
    if (type === 'urgent') return <Badge variant="error">Urgent</Badge>;
    if (type === 'important') return <Badge variant="warning">Important</Badge>;
    return <Badge variant="info">Normal</Badge>;
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center gap-2 mb-1"><Send size={16} className="text-[#1a73e8]" /><h3 className="text-sm font-bold text-gray-900">Send Notification</h3></div>
        <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} error={errors.title} placeholder="Notification title" />
        <Textarea label="Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} error={errors.message} placeholder="Write your message..." rows={3} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as NotificationType }))} options={[{ value: 'normal', label: 'Normal' }, { value: 'important', label: 'Important' }, { value: 'urgent', label: 'Urgent' }]} />
          <Select label="Target" value={form.targetType} onChange={e => setForm(f => ({ ...f, targetType: e.target.value as NotificationTarget }))} options={[{ value: 'all', label: 'All Students' }, { value: 'unpaid', label: 'Unpaid Only' }]} />
        </div>
        <Button variant="primary" fullWidth loading={sending} onClick={handleSend}><Send size={14} /> Send Notification</Button>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3"><Bell size={16} className="text-gray-500" /><h3 className="text-sm font-bold text-gray-900">Sent Notifications</h3></div>
        <div className="space-y-2">{sent.map(notif => (
          <div key={notif.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-2 mb-1"><span className="text-sm font-semibold text-gray-900">{notif.title}</span>{typeBadge(notif.type)}</div>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{notif.message}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400"><span>{formatDate(notif.createdAt)}</span><span>· {notif.targetType === 'all' ? 'All students' : 'Unpaid only'}</span><span>· {notif.readBy.length} read</span></div>
          </div>
        ))}</div>
      </div>
    </div>
  );
};
