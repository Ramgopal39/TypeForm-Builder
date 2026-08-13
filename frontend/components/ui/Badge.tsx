import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100/85',
    danger: 'bg-rose-50 text-rose-700 border border-rose-100/85',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100/85',
    info: 'bg-blue-50 text-blue-700 border border-blue-100/85',
    neutral: 'bg-slate-50 text-slate-600 border border-slate-200/80',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
export default Badge;
