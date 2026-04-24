import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, MessageSquare, ShoppingBag, LogOut, Leaf, User, IndianRupee } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/farmer/dashboard', icon: LayoutDashboard },
  { name: 'Create Listing', href: '/farmer/create-listing', icon: PlusCircle },
  { name: 'My Listings', href: '/farmer/listings', icon: List },
  { name: 'Requests', href: '/farmer/requests', icon: MessageSquare },
  { name: 'Orders', href: '/farmer/orders', icon: ShoppingBag },
  { name: 'Earnings', href: '/farmer/earnings', icon: IndianRupee },
  { name: 'Profile', href: '/farmer/profile', icon: User },
];

export default function FarmerLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-emerald-50 flex flex-col fixed inset-y-0">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">BioLoop</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-emerald-800 text-white shadow-lg" 
                    : "hover:bg-emerald-800/50 text-emerald-100/70 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-emerald-400" : "text-emerald-100/50 group-hover:text-emerald-400"
                )} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-800/50 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
              {user?.farmer_profile?.farm_name?.charAt(0) || 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.farmer_profile?.farm_name || 'Loading...'}</p>
              <p className="text-xs text-emerald-100/50 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-emerald-100/50 hover:text-white hover:bg-red-500/10 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-700">
            {navItems.find(item => item.href === location.pathname)?.name || 'Farmer Portal'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Farmer Account
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
