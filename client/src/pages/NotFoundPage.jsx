import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
        <Film className="w-8 h-8 text-zinc-500" />
      </div>
      <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
        404 Error
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-white">Scene Not Found</h1>
      <p className="text-xs text-zinc-400 max-w-sm">
        The cinematic sequence you are searching for does not exist or has been archived.
      </p>
      <Link to="/" className="pt-2">
        <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
          Return to Premieres
        </Button>
      </Link>
    </div>
  );
};
