import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children, loading = false, variant = 'primary', size = 'md', fullWidth = false, disabled, className = '', ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95';
  const variants: Record<string, string> = {
    primary: 'bg-[#1a73e8] text-white hover:bg-blue-700 focus:ring-blue-400 disabled:bg-blue-300',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300',
    danger: 'bg-[#ea4335] text-white hover:bg-red-700 focus:ring-red-400',
    success: 'bg-[#34a853] text-white hover:bg-green-700 focus:ring-green-400',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
    outline: 'border-2 border-[#1a73e8] text-[#1a73e8] hover:bg-blue-50 focus:ring-blue-400',
  };
  const sizes: Record<string, string> = { sm: 'h-9 px-3 text-sm', md: 'h-12 px-5 text-sm', lg: 'h-14 px-6 text-base' };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : null}
      {children}
    </button>
  );
};
