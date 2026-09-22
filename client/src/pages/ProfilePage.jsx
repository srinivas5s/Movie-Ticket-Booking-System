import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { profileSchema } from '../utils/validators/authSchemas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, updateProfile, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      defaultCity: user?.defaultCity || 'mumbai',
    },
  });

  const onSubmit = async (values) => {
    try {
      setSuccessMessage('');
      setErrorMessage('');
      await updateProfile(values);
      setSuccessMessage('Profile details updated successfully.');
      setIsEditing(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile details.');
    }
  };

  const cancelEdit = () => {
    reset({
      name: user?.name || '',
      phone: user?.phone || '',
      defaultCity: user?.defaultCity || 'mumbai',
    });
    setIsEditing(false);
    setErrorMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={isAdmin ? 'glow' : 'outline'} size="sm">
              {user?.role || 'USER'} ACCOUNT
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Member Profile</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your personal preferences, contact details, and account security.
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary */}
        <Card className="p-6 text-center space-y-4 md:col-span-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-glow-subtle">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{user?.email}</p>
          </div>
          <div className="pt-3 border-t border-white/10 w-full text-left space-y-2 text-xs text-zinc-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <Shield className="w-3.5 h-3.5" />
                Role
              </span>
              <span className="font-semibold text-zinc-200">{user?.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <MapPin className="w-3.5 h-3.5" />
                City
              </span>
              <span className="capitalize text-zinc-200">{user?.defaultCity || 'mumbai'}</span>
            </div>
            {user?.createdAt && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined
                </span>
                <span className="text-zinc-200">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Right Column: Editable Information */}
        <Card className="p-6 md:col-span-2">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your contact details are used for SMS/Email ticket delivery and reservations.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              disabled={!isEditing}
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address (Locked)"
              value={user?.email || ''}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
              helperText="Email cannot be changed directly as it acts as your unique identifier."
            />

            <Input
              label="Phone Number"
              disabled={!isEditing}
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              label="Default Preferred City"
              disabled={!isEditing}
              placeholder="e.g. Mumbai, Bengaluru"
              leftIcon={<MapPin className="w-4 h-4" />}
              error={errors.defaultCity?.message}
              {...register('defaultCity')}
            />

            {isEditing && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={cancelEdit}
                  leftIcon={<X className="w-3.5 h-3.5" />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
