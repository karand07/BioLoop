import { useState, useMemo } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { ShoppingCart, Truck, IndianRupee, Package, Loader2, MoreVertical, Building2, Search, ArrowUpRight, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const orderStatusColors: Record<string, string> = {
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  in_transit: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  closed: 'bg-slate-50 text-slate-600 border-slate-100',
  disputed: 'bg-rose-50 text-rose-700 border-rose-100',
};

export default function AdminOrders() {
  const { orders, isOrdersLoading } = useAdmin();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesSearch = 
        order.order_id.toString().includes(searchQuery) ||
        order.farmer?.farm_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.company?.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, searchQuery]);

  if (isOrdersLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Compiling Global Transactions...</p>
      </div>
    );
  }

  const totalVolume = orders.reduce((acc: number, curr: any) => acc + Number(curr.total_amount), 0);
  const totalCommission = orders.reduce((acc: number, curr: any) => acc + Number(curr.platform_commission), 0);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            Marketplace Ledger
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">Transactions</span>
          </h1>
          <p className="text-slate-500 font-medium">Monitoring the pulse of BioLoop's circular economy.</p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Orders</p>
            <h3 className="text-2xl font-black text-slate-900">{orders.length}</h3>
          </div>
          <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-black">
            LIVE
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Volume</p>
            <h3 className="text-2xl font-black text-slate-900">₹{totalVolume.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-emerald-900 p-6 rounded-[2rem] shadow-xl shadow-emerald-100 space-y-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-300/60 uppercase tracking-widest">Commission</p>
            <h3 className="text-2xl font-black">₹{totalCommission.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disputed</p>
            <h3 className="text-2xl font-black text-slate-900">{orders.filter((o: any) => o.status === 'disputed').length}</h3>
          </div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-2xl self-start">
          {['all', 'confirmed', 'in_transit', 'delivered', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                filterStatus === status 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search Order ID, Farmer or Company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stakeholders</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Matrix</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financials</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order: any) => (
                <tr key={order.order_id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">#{order.order_id}</span>
                       <p className="text-[10px] text-slate-300 font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                           <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-xs font-black text-slate-900 truncate tracking-tight">{order.farmer?.farm_name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Farmer</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                           <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-xs font-black text-slate-900 truncate tracking-tight">{order.company?.company_name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Company</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                       <p className="text-sm font-black text-slate-900">{order.request?.listing?.category?.name}</p>
                       <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <Package className="w-3 h-3" /> {order.quantity} {order.request?.listing?.category?.unit}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <div className="flex items-center gap-1.5 text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100 w-fit">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {Number(order.total_amount).toLocaleString()}
                       </div>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest pl-1">
                          Comm: ₹{Number(order.platform_commission).toFixed(2)}
                       </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      orderStatusColors[order.status] || 'bg-slate-50 border-slate-100'
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        order.status === 'closed' ? 'bg-slate-400' : 'bg-current'
                      )} />
                      {order.status.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 rounded-xl transition-all active:scale-95">
                          <Truck className="w-5 h-5" />
                       </button>
                       <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
             <div className="py-32 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <ShoppingCart className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">No Orders Found</h3>
                <p className="text-slate-400 font-medium mt-1">Try adjusting your filters or search query.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
