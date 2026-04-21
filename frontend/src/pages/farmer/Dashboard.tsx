import { Package, ShoppingCart, IndianRupee, TrendingUp, ArrowUpRight,Plus, Clock, CheckCircle2, AlertCircle,Leaf } from 'lucide-react';
import { useWaste } from '../../hooks/useWaste';
import { useOrders } from '../../hooks/useOrders';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function FarmerDashboard() {
  const { myListings, isListingsLoading } = useWaste();
  const { orders, isOrdersLoading, incomingRequests } = useOrders();

  // Calculate Stats
  const activeListings = myListings.filter((l: any) => l.status === 'active').length;
  const pendingRequests = incomingRequests.filter((r: any) => r.status === 'pending').length;
  const totalRevenue = orders
    .filter((o: any) => o.status === 'delivered' || o.status === 'closed')
    .reduce((acc: number, o: any) => acc + parseFloat(o.total_amount), 0);

  const stats = [
    { label: 'Active Listings', value: activeListings, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%' },
    { label: 'Pending Requests', value: pendingRequests, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '4 new' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5%' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+20%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Farmer Dashboard</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your farm today.</p>
        </div>
        <Link 
          to="/farmer/create-listing" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Create Listing
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders/Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            <Link to="/farmer/listings" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View All</Link>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {isOrdersLoading || isListingsLoading ? (
              <div className="p-8 text-center text-slate-400">Loading activity...</div>
            ) : incomingRequests.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-slate-500 text-sm font-medium">No recent requests or orders.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {incomingRequests.slice(0, 5).map((request: any) => (
                  <div key={request.request_id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{request.company?.company_name || 'New Company'}</h4>
                        <p className="text-sm text-slate-500">Requested {request.requested_quantity} units of {request.listing?.category?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">₹{request.offered_price}</div>
                      <div className={cn(
                        "text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full inline-block",
                        request.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      )}>
                        {request.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips / Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          <div className="bg-emerald-900 rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Grow your business</h3>
              <p className="text-emerald-100/70 text-sm mb-6">Create high-quality listings with clear images to attract more companies.</p>
              <Link 
                to="/farmer/create-listing"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                List Waste <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Leaf className="w-32 h-32 rotate-12" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-600">Profile Verified</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-600">Bank Details Added</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-slate-600">2 Pending Requests</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
