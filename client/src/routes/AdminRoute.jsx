import React from 'react';
import { Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ui/PageLoader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader message="Verifying administrative access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md p-8 text-center space-y-4 border-red-500/20 bg-red-950/10">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">403 — Restricted Area</h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Administrative clearance required. Your current account does not have sufficient RBAC permissions to access this control module.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Return to Safety
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return children ? children : <Outlet />;
};
