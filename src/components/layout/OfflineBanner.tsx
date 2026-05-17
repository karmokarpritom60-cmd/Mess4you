import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#ea4335] text-white text-sm font-medium py-2 px-4 flex items-center justify-center gap-2">
      <WifiOff size={14} />
      You are offline
    </div>
  );
};
