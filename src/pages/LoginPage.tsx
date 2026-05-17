import React, { useState } from 'react';
import { ChefHat, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../contexts/ToastContext';

export const LoginPage: React.FC = () => {
  const { login, resetPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await login(email, password);
      showToast('Login successful!', 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setErrors({ general: message });
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      showToast('Password reset email sent!', 'success');
      setShowReset(false);
    } catch {
      showToast('Could not send reset email', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-[#1a73e8] rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <ChefHat size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mess4you</h1>
          <p className="text-sm text-gray-500 mt-1">Hostel Mess Management</p>
        </div>

        {!showReset ? (
          <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-7 space-y-5 border border-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
            <div className="relative">
              <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} autoComplete="current-password" className="pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.general && <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{errors.general}</div>}
            <Button type="submit" fullWidth loading={loading} size="lg">Login</Button>
            <div className="text-center">
              <button type="button" onClick={() => setShowReset(true)} className="text-[#1a73e8] text-sm font-medium hover:underline">Forgot Password?</button>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 text-center font-medium mb-2">Test Credentials</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div className="bg-gray-50 rounded-lg px-2 py-1.5"><div className="font-medium">Student</div><div>student1@mess4you.com</div><div>Student@123</div></div>
                <div className="bg-gray-50 rounded-lg px-2 py-1.5"><div className="font-medium">Admin</div><div>admin@mess4you.com</div><div>Admin@123</div></div>
                <div className="bg-gray-50 rounded-lg px-2 py-1.5"><div className="font-medium">Cook</div><div>cook@mess4you.com</div><div>Cook@123</div></div>
                <div className="bg-gray-50 rounded-lg px-2 py-1.5"><div className="font-medium">Super Admin</div><div>superadmin@mess4you.com</div><div>Admin@123</div></div>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReset} className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-7 space-y-5 border border-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
            <p className="text-sm text-gray-500">Enter your email and we'll send you a reset link.</p>
            <Input label="Email" type="email" placeholder="you@example.com" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
            <Button type="submit" fullWidth loading={resetLoading} size="lg">Send Reset Link</Button>
            <div className="text-center">
              <button type="button" onClick={() => setShowReset(false)} className="text-[#1a73e8] text-sm font-medium hover:underline">Back to Login</button>
            </div>
          </form>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">&copy; {new Date().getFullYear()} Pritom Karmokar. All rights reserved.</p>
      </div>
    </div>
  );
};
