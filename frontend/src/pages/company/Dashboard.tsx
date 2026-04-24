import { ShoppingBag, MessageSquare, IndianRupee, TrendingUp, Package, Clock, ArrowUpRight, ArrowRight, Loader2, Building2 } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { useWaste } from '../../hooks/useWaste';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function CompanyDashboard() {
  const { orders, myRequests, isOrdersLoading, isMyRequestsLoading } = useOrders();
  const { categories, isListingsLoading: isWasteLoading } = useWaste();

  const totalSpent = orders.reduce((acc: number, order: any) => acc + parseFloat(order.total_amount), 0);
  const activeOrders = orders.filter((o: any) => o.status !== 'closed' && o.status !== 'delivered');
  const pendingRequests = myRequests.filter((r: any) => r.status === 'pending' || r.status === 'negotiating');
  const totalSourced = orders.reduce((acc: number, order: any) => acc + parseFloat(order.quantity), 0);

  const stats = [
    { label: 'Total Sourced', value: `${totalSourced.toFixed(1)} MT`, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Investment', value: `₹${totalSpent.toLocaleString()}`, icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Orders', value: activeOrders.length, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Proposals', value: pendingRequests.length, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (isOrdersLoading || isMyRequestsLoading || isWasteLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Business Overview</h1>
          <p className="text-slate-500 mt-1">Real-time metrics for your sustainable sourcing operations.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-slate-600">Updated just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Recent Sourcing Requests</h3>
              <Link to="/company/requests" className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {myRequests.slice(0, 4).map((request: any) => (
                <div key={request.request_id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <img src={request.listing?.images} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{request.listing?.farmer?.farm_name}</p>
                    <p className="text-xs text-slate-400 font-medium">Requested {request.requested_quantity} {request.listing?.category?.unit} • ₹{request.offered_price}</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                    request.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                    request.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                  )}>
                    {request.status}
                  </div>
                </div>
              ))}
              {myRequests.length === 0 && (
                <div className="p-20 text-center text-slate-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-bold">No active requests</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Shipments Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-100">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-20 rounded-full -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-xl font-bold mb-6 relative z-10">Active Deliveries</h3>
             
             <div className="space-y-6 relative z-10">
                {activeOrders.slice(0, 3).map((order: any) => (
                  <div key={order.order_id} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                     <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">#{order.order_id}</span>
                        <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-lg uppercase tracking-widest">{order.status}</span>
                     </div>
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                           <Building2 className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-bold truncate">{order.farmer?.farm_name}</p>
                     </div>
                     <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-2/3" />
                     </div>
                  </div>
                ))}
                {activeOrders.length === 0 && (
                   <div className="text-center py-10 opacity-40">
                      <ShoppingBag className="w-10 h-10 mx-auto mb-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">No active orders</p>
                   </div>
                )}
             </div>

             <Link 
              to="/company/orders"
              className="mt-8 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all"
             >
                Manage Orders
                <ArrowUpRight className="w-4 h-4" />
             </Link>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Market Status</h4>
             <div className="space-y-4">
                {categories.slice(0, 4).map((cat: any) => (
                  <div key={cat.category_id} className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm font-medium">{cat.name}</span>
                    <span className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> ₹{cat.min_ref_price}/ {cat.unit}
                    </span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
