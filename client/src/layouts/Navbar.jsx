import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Search, User, Shield, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { CityHeaderWidget } from '../components/city/CityHeaderWidget';
import { CitySelectionModal } from '../components/city/CitySelectionModal';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-obsidian-900/80 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-black font-black shadow-glow-subtle group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-wider text-white uppercase group-hover:text-zinc-200 transition-colors">
                  Antigravity
                </span>
                <span className="text-[9px] tracking-[0.25em] text-zinc-400 uppercase font-semibold -mt-1">
                  Cinemas
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/movies"
                className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors ${
                  location.pathname.startsWith('/movies')
                    ? 'text-white bg-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Movies
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'text-white bg-white/10 border border-white/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Shield className="w-3 h-3 text-zinc-300" />
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Center Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
            <div className="w-full relative flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search movies, theatres, genres..."
                className="w-full bg-white/[0.04] border border-white/10 text-xs rounded-full pl-9 pr-8 py-1.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
              />
              <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-zinc-500 bg-white/5 border border-white/10 rounded">
                /
              </kbd>
            </div>
          </div>

          {/* Right Section: City Header Widget + Auth Profile */}
          <div className="flex items-center gap-3">
            {/* City Selector Widget */}
            <CityHeaderWidget />

            {/* User Session Action */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all group"
                  title="View your profile"
                >
                  <User className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white" />
                  <span className="text-xs text-zinc-200 group-hover:text-white font-medium">
                    {user?.name || 'User'}
                  </span>
                  {isAdmin ? (
                    <Badge variant="glow" size="sm">ADMIN</Badge>
                  ) : (
                    <Badge variant="outline" size="sm">USER</Badge>
                  )}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-zinc-400 hover:text-red-400"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth">
                  <Button variant="primary" size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* City Selection Glassmorphic Modal */}
      <CitySelectionModal />
    </>
  );
};
