import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { loginSchema } from '../../utils/validators/authSchemas';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      setServerError('');
      setIsSubmitting(true);
      await login(values.email, values.password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setServerError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="your.email@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••••••"
        leftIcon={<Lock className="w-4 h-4" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        isLoading={isSubmitting}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Sign In
      </Button>

      {/* Quick demo autofill buttons */}
      <div className="pt-2 border-t border-white/5 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-zinc-500">
          <Sparkles className="w-3 h-3 text-zinc-400" />
          <span>Quick Demo Credential Fill</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillCredentials('user@Cineva.cinemas', 'password123')}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-zinc-300 hover:text-white transition-colors text-left"
          >
            👤 Demo User
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('admin@Cineva.cinemas', 'admin123')}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-zinc-300 hover:text-white transition-colors text-left"
          >
            🛡️ Demo Admin
          </button>
        </div>
      </div>
    </form>
  );
};
