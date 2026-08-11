import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Cpu, FileText, ShieldCheck } from 'lucide-react';

export const AdminSubNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Domain Catalog',
      path: '/admin/domains',
      icon: Database,
    },
    {
      label: 'Agent Pipeline',
      path: '/admin/generation',
      icon: Cpu,
    },
    {
      label: 'API Docs & Keys',
      path: '/admin/api-docs',
      icon: FileText,
      highlight: true,
    },
  ];

  return (
    <div className="w-full border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-16 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left Title Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Portal
            </span>
          </div>

          {/* Center Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? currentPath === item.path
                : currentPath.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : item.highlight
                      ? 'border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-white'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
