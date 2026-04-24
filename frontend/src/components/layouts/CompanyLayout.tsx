import { Link, Outlet, useLocation } from 'react-router-dom';
import {  ShoppingBag,  MessageSquare, LogOut, Leaf, User, Search, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import { cn } from '../../lib/utils';

export default function CompanyLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: t('dashboard'), href: '/company/dashboard', icon: LayoutDashboard },
    { name: t('marketplace'), href: '/company/marketplace', icon: Search },
    { name: t('my_requests'), href: '/company/requests', icon: MessageSquare },
    { name: t('my_orders'), href: '/company/orders', icon: ShoppingBag },
    { name: t('profile'), href: '/company/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 shadow-2xl">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">BioLoop</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                  isActive 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                    : "hover:bg-white/5 text-slate-400 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-400"
                )} />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5 border border-white/5 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0">
              {user?.company_profile?.company_name?.charAt(0) || 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">{user?.company_profile?.company_name || t('loading')}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-4 mt-2 rounded-2xl text-slate-500 hover:text-white hover:bg-red-500/10 transition-all group font-bold text-sm"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <h2 className="text-xl font-bold text-slate-800">
            {navItems.find(item => item.href === location.pathname)?.name || t('marketplace')}
          </h2>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              {t('buyer_portal')}
            </div>
          </div>
        </header>
        <div className="p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
