import React from 'react';
import { cn } from '../../utils/cn';

export const Spinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-[2px]',
    md: 'w-6 h-6 border-[2.5px]',
    lg: 'w-10 h-10 border-[3px]',
    xl: 'w-14 h-14 border-[3.5px]',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-white/20 border-t-white',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      role="status"
      aria-label="loading"
    />
  );
};
