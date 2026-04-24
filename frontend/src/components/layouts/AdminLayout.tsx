import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Tag, ShoppingCart, LogOut, ShieldCheck, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import { cn } from '../../lib/utils';

export default function AdminLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: t('overview'), href: '/admin/dashboard', icon: LayoutDashboard },
    { name: t('user_management'), href: '/admin/users', icon: Users },
    { name: t('waste_categories'), href: '/admin/categories', icon: Tag },
    { name: t('global_orders'), href: '/admin/orders', icon: ShoppingCart },
    { name: t('platform_settings'), href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 shadow-2xl z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">BioAdmin</span>
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

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-slate-500 hover:text-white hover:bg-red-500/10 transition-all group font-bold text-sm"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            {t('logout_session')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <h2 className="text-xl font-bold text-slate-800">
            {navItems.find(item => item.href === location.pathname)?.name || t('admin_panel')}
          </h2>
          <div className="flex items-center gap-6">
             <LanguageSwitcher />
             <div className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">
                {t('mainnet_node')}
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                AD
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
