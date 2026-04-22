import { useAdmin } from '../../hooks/useAdmin';
import { Users, Tag, ShoppingCart, IndianRupee, Loader2, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminDashboard() {
  const { stats, isStatsLoading } = useAdmin();

  const metrics = [
    { label: 'Total Users', value: stats?.users?.total || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5.2%', up: true },
    { label: 'Active Listings', value: stats?.listings?.active || 0, icon: Tag, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%', up: true },
    { label: 'Total Orders', value: stats?.orders?.total || 0, icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '-2.4%', up: false },
    { label: 'Platform GTV', value: `₹${(stats?.revenue?.total || 0).toLocaleString()}`, icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+8.1%', up: true },
  ];

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", m.bg, m.color)}>
                <m.icon className="w-6 h-6" />
              </div>
              <div className={cn("flex items-center gap-1 text-[10px] font-black", m.up ? 'text-emerald-500' : 'text-red-500')}>
                {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {m.trend}
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{m.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions / Activity */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                   <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">System Activity</h3>
             </div>
             <button className="text-xs font-bold text-emerald-600 hover:underline">Download Audit Log</button>
          </div>
          <div className="p-8">
             <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                   <div key={i} className="flex items-center gap-4 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-slate-700">New company profile verified: <span className="text-slate-900">Industrial Green Corp</span></p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">2 hours ago • Automated Verification</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-[10px] font-black text-slate-400 hover:text-slate-900">VIEW</button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="lg:col-span-1 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <h3 className="text-xl font-bold mb-8 relative z-10">User Base</h3>
           
           <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>Farmers</span>
                    <span className="text-white">{Math.round((stats?.users?.farmers / stats?.users?.total) * 100) || 0}%</span>
                 </div>
                 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(stats?.users?.farmers / stats?.users?.total) * 100 || 0}%` }} />
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>Companies</span>
                    <span className="text-white">{Math.round((stats?.users?.companies / stats?.users?.total) * 100) || 0}%</span>
                 </div>
                 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(stats?.users?.companies / stats?.users?.total) * 100 || 0}%` }} />
                 </div>
              </div>
           </div>

           <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="text-center">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Users</p>
                 <p className="text-xl font-bold">{stats?.users?.total || 0}</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Completed</p>
                 <p className="text-xl font-bold text-emerald-400">{stats?.orders?.completed || 0}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
