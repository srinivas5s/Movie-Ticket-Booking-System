import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-semibold uppercase tracking-wider rounded-full transition-colors select-none';

  const variants = {
    default: 'bg-white/10 text-zinc-200 border border-white/10',
    outline: 'border border-white/20 text-zinc-300 bg-transparent',
    glow: 'bg-white text-black font-bold shadow-glow-white border border-white',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    category: 'bg-zinc-800 text-zinc-100 border border-white/15 px-2 py-0.5',
  };

  const sizes = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[10px] px-2.5 py-0.5',
    lg: 'text-xs px-3 py-1',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
