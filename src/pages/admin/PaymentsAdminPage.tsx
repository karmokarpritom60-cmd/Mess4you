import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { mockPayments } from '../../utils/mockData';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Payment } from '../../types';

export const PaymentsAdminPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [rejectTarget, setRejectTarget] = useState<Payment | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  const [payments, setPayments] = useState(mockPayments);

  const pending = payments.filter(p => p.status === 'pending');
  const displayed = activeTab === 'pending' ? pending : payments;

  const handleVerify = async (payment: Payment) => {
    setProcessing(payment.id!);
    await new Promise(r => setTimeout(r, 1000));
    setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: 'verified' } : p));
    setProcessing(null);
    showToast('Payment verified!', 'success');
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) { showToast('Please enter a reason', 'warning'); return; }
    setProcessing(rejectTarget.id!);
    await new Promise(r => setTimeout(r, 800));
    setPayments(prev => prev.map(p => p.id === rejectTarget.id ? { ...p, status: 'rejected', rejectionReason: rejectReason } : p));
    setProcessing(null);
    setRejectTarget(null);
    setRejectReason('');
    showToast('Payment rejected', 'info');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {(['pending', 'all'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
            {tab === 'pending' ? `Pending Review${pending.length > 0 ? ` (${pending.length})` : ''}` : 'All Payments'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {displayed.length === 0 ? <div className="bg-white rounded-2xl p-8 text-center text-sm text-gray-400 shadow-sm border border-gray-100">{activeTab === 'pending' ? 'No pending payments' : 'No payments found'}</div> : (
          displayed.map(payment => (
            <div key={payment.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1 min-w-0"><div className="text-sm font-bold text-gray-900">{payment.studentName}</div><div className="text-lg font-bold text-[#1a73e8]">{formatCurrency(payment.amount)}</div><div className="text-xs text-gray-400">{formatDate(payment.createdAt)} · {payment.month}</div></div>
                <Badge variant={payment.status === 'verified' ? 'success' : payment.status === 'rejected' ? 'error' : 'warning'}>{payment.status}</Badge>
              </div>
              {payment.status === 'rejected' && payment.rejectionReason && <div className="bg-red-50 rounded-lg px-3 py-2 mb-3"><div className="text-xs text-red-600">Reason: {payment.rejectionReason}</div></div>}
              <div className="flex gap-2">
                {payment.status === 'pending' && (<>
                  <Button variant="success" size="sm" fullWidth loading={processing === payment.id} onClick={() => handleVerify(payment)}><Check size={14} /> Verify</Button>
                  <Button variant="danger" size="sm" fullWidth onClick={() => setRejectTarget(payment)}><X size={14} /> Reject</Button>
                </>)}
              </div>
            </div>
          ))
        )}
      </div>
      <Modal isOpen={!!rejectTarget} onClose={() => { setRejectTarget(null); setRejectReason(''); }} title="Reject Payment">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Please provide a reason for rejecting this payment from <strong>{rejectTarget?.studentName}</strong>.</p>
          <Textarea label="Rejection Reason" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Screenshot unclear, wrong amount..." />
          <div className="flex gap-2"><Button variant="secondary" fullWidth onClick={() => { setRejectTarget(null); setRejectReason(''); }}>Cancel</Button><Button variant="danger" fullWidth loading={!!processing} onClick={handleReject}>Reject</Button></div>
        </div>
      </Modal>
    </div>
  );
};
