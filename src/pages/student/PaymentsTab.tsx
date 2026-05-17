import React, { useState } from 'react';
import { Copy, Check, QrCode } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../contexts/ToastContext';
import { mockPayments, mockSettings } from '../../utils/mockData';
import { formatCurrency, formatDate, copyToClipboard } from '../../utils/helpers';

export const PaymentsTab: React.FC = () => {
  const { userData } = useAuth();
  const { showToast } = useToast();
  const [showPayModal, setShowPayModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const myPayments = mockPayments.filter(p => p.studentId === userData?.uid);
  const totalBill = 3200;
  const baseAmount = 2500;
  const extraCharge = totalBill - baseAmount;
  const paid = myPayments.filter(p => p.status === 'verified').reduce((s, p) => s + p.amount, 0);
  const balance = Math.max(0, totalBill - paid);

  const handleCopyUpi = async () => {
    const ok = await copyToClipboard(mockSettings.upiId);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); showToast('UPI ID copied!', 'success'); }
  };

  const statusBadge = (status: string) => {
    if (status === 'verified') return <Badge variant="success">Verified</Badge>;
    if (status === 'rejected') return <Badge variant="error">Rejected</Badge>;
    return <Badge variant="warning">Pending</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">This Month's Bill</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Base amount</span><span className="font-medium text-gray-900">{formatCurrency(baseAmount)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Extra meals charge</span><span className="font-medium text-gray-900">{formatCurrency(extraCharge)}</span></div>
          <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-bold"><span className="text-gray-900">Total</span><span className="text-gray-900">{formatCurrency(totalBill)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Amount paid</span><span className="font-medium text-[#34a853]">{formatCurrency(paid)}</span></div>
          <div className="flex justify-between text-sm font-bold"><span className="text-[#ea4335]">Balance due</span><span className="text-[#ea4335]">{formatCurrency(balance)}</span></div>
        </div>
        {balance > 0 && <Button variant="primary" fullWidth size="lg" className="mt-4" onClick={() => setShowPayModal(true)}>Pay Now — {formatCurrency(balance)}</Button>}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Payment History</h3>
        {myPayments.length === 0 ? <div className="text-sm text-gray-400 text-center py-4">No payments yet</div> : (
          <div className="space-y-3">
            {myPayments.map(p => (
              <div key={p.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-gray-900">{formatCurrency(p.amount)}</span>{statusBadge(p.status)}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{formatDate(p.createdAt)}</div>
                  {p.status === 'rejected' && p.rejectionReason && <div className="mt-1.5 bg-red-50 rounded-lg px-3 py-1.5"><div className="text-xs text-red-600 font-medium">Reason: {p.rejectionReason}</div></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Make Payment">
        <div className="space-y-5">
          <div className="flex flex-col items-center">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="w-52 h-52 bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                <div className="text-center text-gray-400"><QrCode size={80} className="mx-auto mb-2 text-gray-300" /><div className="text-xs">Scan to pay</div></div>
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900 mt-3">{formatCurrency(balance)}</div>
          </div>
          <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <div><div className="text-xs text-gray-500">UPI ID</div><div className="text-sm font-semibold text-gray-900">{mockSettings.upiId}</div></div>
            <button onClick={handleCopyUpi} className="flex items-center gap-1.5 bg-[#1a73e8] text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-blue-700">
              {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-3"><div className="text-xs text-gray-500">Phone / UPI</div><div className="text-sm font-semibold text-gray-900">{mockSettings.paymentPhone}</div></div>
          <Button variant="secondary" fullWidth onClick={() => setShowPayModal(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};
