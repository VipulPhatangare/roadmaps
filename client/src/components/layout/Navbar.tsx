import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Map, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { AdminSubNav } from './AdminSubNav';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminUser = user?.role === 'ADMIN' || user?.role === 'EDITOR';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Map className="h-5 w-5 text-white" />
            </div>
            <span>
              Roadmap<span className="text-indigo-400">AI</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/roadmaps" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Explore Roadmaps
            </Link>

            {isAuthenticated && (
              <Link to="/my-roadmaps" className="text-sm font-medium text-slate-300 transition hover:text-white">
                My Learning
              </Link>
            )}

            {isAdminUser && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  isAdminRoute
                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-md'
                    : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                Admin Portal
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-xs font-medium text-slate-400 sm:inline-block">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
              >
                <UserIcon className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Render Admin Sub-Navigation whenever user is inside Admin Portal */}
      {isAdminUser && isAdminRoute && <AdminSubNav />}
    </>
  );
};
