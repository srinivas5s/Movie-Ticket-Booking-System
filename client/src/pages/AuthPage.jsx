import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Film, Sparkles, Shield, UserCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const redirectPath = location.state?.from?.pathname || '/';

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSuccess = () => {
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-1">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
              Antigravity Security Shield
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {activeTab === 'login' ? 'Access Your Screenings' : 'Join Antigravity Cinemas'}
          </h1>
          <p className="text-xs text-zinc-400">
            {activeTab === 'login'
              ? 'Sign in to access your digital tickets, booking history, and seat reserves.'
              : 'Create an account to reserve premium seats and experience luxury cinema.'}
          </p>
        </div>

        {/* Tabbed Auth Card */}
        <Card className="p-6 backdrop-blur-xl border-white/10 bg-obsidian-800/90 shadow-2xl">
          {/* Tab selector */}
          <div className="grid grid-cols-2 p-1 mb-6 rounded-lg bg-white/[0.04] border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Content */}
          {activeTab === 'login' ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </Card>

        {/* Security / RBAC footnote */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-zinc-400" />
            <span>Strict Role-Based Access Control</span>
          </span>
          <span className="text-zinc-700">•</span>
          <span className="flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-zinc-400" />
            <span>BCrypt Encrypted Passwords</span>
          </span>
        </div>
      </div>
    </div>
  );
};
