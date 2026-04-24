import { IndianRupee, TrendingUp, Calendar, ArrowUpRight, CheckCircle2, Clock, Filter, Truck, Search } from 'lucide-react';
import { usePayouts } from '../../hooks/usePayouts';
import { cn } from '../../lib/utils';

export default function LogisticsEarnings() {
  const { payouts, isPayoutsLoading } = usePayouts();

  const totalEarnings = payouts
    .filter((p: any) => p.status === 'processed')
    .reduce((acc: number, p: any) => acc + Number(p.amount), 0);

  const pendingPayouts = payouts
    .filter((p: any) => p.status === 'pending')
    .reduce((acc: number, p: any) => acc + Number(p.amount), 0);

  const stats = [
    { label: 'Fleet Revenue', value: `₹${totalEarnings.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'In Escrow', value: `₹${pendingPayouts.toLocaleString()}`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Jobs Completed', value: payouts.filter((p: any) => p.status === 'processed').length, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'System Status', value: 'NEFT Active', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  if (isPayoutsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Processing Fleet Ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <IndianRupee className="w-3 h-3" />
            Fleet Settlement
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Revenue <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">Analytics</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage your delivery earnings and payout frequency.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Download GST Report
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon className="w-24 h-24 -mr-8 -mt-8" />
            </div>
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner", stat.bg, stat.color)}>
              <stat.icon className="w-7 h-7" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <Truck className="w-6 h-6 text-emerald-500" />
               Logistics Settlements
            </h3>
            <div className="flex items-center gap-4">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search trip IDs..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
               </div>
               <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 transition-all">
                  <Filter className="w-5 h-5" />
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Date</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Amount</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {payouts.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                           <div className="flex flex-col items-center space-y-3">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                 <Truck className="w-8 h-8 text-slate-200" />
                              </div>
                              <p className="text-slate-500 font-bold">No trips settled yet</p>
                              <p className="text-xs text-slate-400">Your trip earnings will appear here once delivered.</p>
                           </div>
                        </td>
                     </tr>
                  ) : (
                     payouts.map((payout: any) => (
                        <tr key={payout.payout_id} className="hover:bg-slate-50/50 transition-all group">
                           <td className="px-8 py-6 font-bold text-slate-900 text-sm">#{payout.order_id}</td>
                           <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                              {new Date(payout.processed_at || payout.created_at).toLocaleDateString('en-IN', {
                                 day: '2-digit',
                                 month: 'short',
                                 year: 'numeric'
                              })}
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-sm font-black text-slate-900">₹{Number(payout.amount).toLocaleString()}</span>
                           </td>
                           <td className="px-8 py-6">
                              <div className={cn(
                                 "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                 payout.status === 'processed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                              )}>
                                 {payout.status === 'processed' ? (
                                    <>
                                       <CheckCircle2 className="w-3 h-3" />
                                       Settled
                                    </>
                                 ) : (
                                    <>
                                       <Clock className="w-3 h-3" />
                                       Processing
                                    </>
                                 )}
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <button className="text-emerald-600 font-bold text-xs flex items-center gap-1 hover:underline">
                                 View Ref
                                 <ArrowUpRight className="w-3 h-3" />
                              </button>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
