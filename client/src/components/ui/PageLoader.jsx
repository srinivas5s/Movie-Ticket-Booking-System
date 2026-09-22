import React from 'react';
import { Spinner } from './Spinner';

export const PageLoader = ({ message = 'Loading Antigravity...' }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="absolute w-16 h-16 rounded-full bg-white/5 animate-ping" />
        <Spinner size="lg" />
      </div>
      <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">{message}</p>
    </div>
  );
};
