import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CookDashboard } from './pages/cook/CookDashboard';

const AppRoutes: React.FC = () => {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-[#1a73e8] rounded-3xl flex items-center justify-center animate-pulse">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
            <line x1="6" y1="17" x2="18" y2="17"/>
            <line x1="6" y1="13" x2="18" y2="13"/>
          </svg>
        </div>
        <div className="text-lg font-bold text-gray-900">Mess4you</div>
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!userData) return <LoginPage />;

  switch (userData.role) {
    case 'student': return <StudentDashboard />;
    case 'admin':
    case 'superadmin': return <AdminDashboard />;
    case 'cook': return <CookDashboard />;
    default: return <LoginPage />;
  }
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <OfflineBanner />
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
