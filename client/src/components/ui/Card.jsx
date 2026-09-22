import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ className, hoverable = false, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-xl bg-obsidian-800/80 border border-white/10 backdrop-blur-md text-white transition-all duration-200',
        hoverable && 'hover:border-white/20 hover:shadow-glow-subtle hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('p-6 pb-3 space-y-1.5', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-lg font-semibold tracking-tight text-white', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-xs text-zinc-400 leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-3', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0 flex items-center', className)} {...props}>
    {children}
  </div>
);
