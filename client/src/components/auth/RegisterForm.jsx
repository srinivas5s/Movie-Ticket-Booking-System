import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { registerSchema } from '../../utils/validators/authSchemas';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const RegisterForm = ({ onSuccess }) => {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerAsAdmin, setRegisterAsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      defaultCity: 'mumbai',
    },
  });

  const onSubmit = async (values) => {
    try {
      setServerError('');
      setIsSubmitting(true);
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        defaultCity: values.defaultCity || 'mumbai',
        ...(registerAsAdmin ? { role: 'ADMIN' } : {}),
      };
      await registerUser(payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      {serverError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <Input
        label="Full Name"
        placeholder="Jane Doe"
        leftIcon={<User className="w-4 h-4" />}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="jane@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Phone Number (Optional)"
        type="tel"
        placeholder="+91 98765 43210"
        leftIcon={<Phone className="w-4 h-4" />}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      {/* Dev toggle for admin role */}
      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-400 hover:text-zinc-200">
          <input
            type="checkbox"
            checked={registerAsAdmin}
            onChange={(e) => setRegisterAsAdmin(e.target.checked)}
            className="rounded bg-white/5 border border-white/10 text-white focus:ring-0 w-3.5 h-3.5 accent-white cursor-pointer"
          />
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-zinc-400" />
            <span>Register as Admin Account (Development Mode)</span>
          </span>
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        isLoading={isSubmitting}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Create Account
      </Button>
    </form>
  );
};
