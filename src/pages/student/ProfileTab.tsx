import React, { useRef, useState } from 'react';
import { Camera, LogOut, User, Phone, Home, Leaf, Drumstick } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../contexts/ToastContext';

export const ProfileTab: React.FC = () => {
  const { userData, logout } = useAuth();
  const { showToast } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logout(); } catch { showToast('Logout failed', 'error'); setLoggingOut(false); }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">{userData?.name?.charAt(0).toUpperCase()}</div>
          <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-[#1a73e8] rounded-full flex items-center justify-center shadow-md border-2 border-white"><Camera size={14} className="text-white" /></button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" />
        </div>
        <div className="text-xl font-bold text-gray-900">{userData?.name}</div>
        <div className="text-sm text-gray-500">{userData?.email}</div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">Profile Details</h3>
        {[
          { icon: <User size={16} className="text-[#1a73e8]" />, bg: 'bg-blue-50', label: 'Full Name', value: userData?.name },
          { icon: <Phone size={16} className="text-[#34a853]" />, bg: 'bg-green-50', label: 'Phone Number', value: userData?.phone },
          { icon: <Home size={16} className="text-orange-500" />, bg: 'bg-orange-50', label: 'Room Number', value: userData?.roomNumber },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>{item.icon}</div>
            <div><div className="text-xs text-gray-400">{item.label}</div><div className="text-sm font-semibold text-gray-900">{item.value}</div></div>
          </div>
        ))}
        <div className="flex items-center gap-3 py-2">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${userData?.vegPreference === 'veg' ? 'bg-green-50' : 'bg-red-50'}`}>
            {userData?.vegPreference === 'veg' ? <Leaf size={16} className="text-green-600" /> : <Drumstick size={16} className="text-red-500" />}
          </div>
          <div><div className="text-xs text-gray-400">Food Preference</div><div className="text-sm font-semibold text-gray-900 capitalize">{userData?.vegPreference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</div></div>
        </div>
      </div>

      <Button variant="danger" fullWidth size="lg" loading={loggingOut} onClick={handleLogout}><LogOut size={16} /> Logout</Button>
      <p className="text-center text-xs text-gray-400">&copy; {new Date().getFullYear()} Pritom Karmokar</p>
    </div>
  );
};
