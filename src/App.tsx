import React, { useState, useEffect } from 'react';
import { AlertCircle, BookOpen } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CookDashboard } from './pages/cook/CookDashboard';

const FirebaseConfigCheck: React.FC = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const isConfigured = apiKey && projectId;

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-5">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertCircle size={32} className="text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Firebase Not Configured</h1>
          <p className="text-gray-600 text-center mb-6">The app requires Firebase credentials to run. Follow these steps:</p>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-blue-600">1</span></div>
              <div><p className="font-semibold text-gray-900">Copy `.env.example` to `.env`</p><p className="text-xs text-gray-500 mt-1">cp .env.example .env</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-blue-600">2</span></div>
              <div><p className="font-semibold text-gray-900">Read the setup guide</p><p className="text-xs text-gray-500 mt-1">Open SETUP.md in project root for detailed Firebase setup instructions</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-blue-600">3</span></div>
              <div><p className="font-semibold text-gray-900">Add your Firebase credentials</p><p className="text-xs text-gray-500 mt-1">Fill in `.env` with values from Firebase Console</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><span className="text-sm font-bold text-blue-600">4</span></div>
              <div><p className="font-semibold text-gray-900">Restart the dev server</p><p className="text-xs text-gray-500 mt-1">Stop and run: npm run dev</p></div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex gap-3">
            <BookOpen size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700"><strong>Quick Start:</strong> See SETUP.md for step-by-step Firebase configuration instructions.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const AppRoutes: React.FC = () => {
  const { userData, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
        <div className="text-sm text-gray-400">Initializing...</div>
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
  const configError = <FirebaseConfigCheck />;
  if (configError) return configError;

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
