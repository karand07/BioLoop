import { Truck, MapPin, Package,  CheckCircle2, IndianRupee, Navigation, Loader2, ArrowRight,  AlertCircle } from 'lucide-react';
import { useLogistics } from '../../hooks/useLogistics';
import { cn } from '../../lib/utils';

export default function LogisticsDashboard() {
  const { availablePickups, myPickups, isAvailableLoading, isMyPickupsLoading, claimPickup, markPickedUp, markDelivered } = useLogistics();

  const activeDeliveries = myPickups.filter((p: any) => p.status !== 'delivered');
  const completedDeliveries = myPickups.filter((p: any) => p.status === 'delivered');

  const stats = [
    { label: 'Active Jobs', value: activeDeliveries.length, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completed', value: completedDeliveries.length, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Available', value: availablePickups.length, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Earnings', value: '₹0', icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  if (isAvailableLoading || isMyPickupsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Active Jobs */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-500" />
              Active Deliveries
            </h3>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Live Tracker
            </span>
          </div>

          <div className="space-y-4">
            {activeDeliveries.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">No active deliveries</p>
                <p className="text-xs text-slate-400 mt-1">Claim a shipment to get started.</p>
              </div>
            ) : (
              activeDeliveries.map((pickup: any) => (
                <div key={pickup.schedule_id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden border-l-4 border-l-emerald-500">
                  <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                          <Package className="w-3 h-3" />
                          {pickup.order?.request?.listing?.category?.name} • {pickup.order?.quantity} MT
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">Order #{pickup.order_id}</h4>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest",
                        pickup.status === 'confirmed' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                      )}>
                        {pickup.status.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="space-y-4 relative before:absolute before:left-2 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
                       <div className="flex items-start gap-4 relative">
                          <div className="w-4 h-4 rounded-full bg-white border-4 border-emerald-500 shrink-0 mt-1" />
                          <div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pickup from</p>
                             <p className="text-sm font-bold text-slate-700">{pickup.pickup_address}</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4 relative">
                          <div className="w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shrink-0 mt-1" />
                          <div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Deliver to</p>
                             <p className="text-sm font-bold text-slate-700">{pickup.delivery_address}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                       {pickup.status === 'confirmed' ? (
                          <button 
                            onClick={() => markPickedUp(pickup.order_id)}
                            className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                          >
                             Mark Picked Up
                          </button>
                       ) : (
                          <button 
                            onClick={() => markDelivered(pickup.order_id)}
                            className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                          >
                             Mark Delivered
                          </button>
                       )}
                       <button className="px-4 py-3 border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all">
                          <Navigation className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Available Shipments */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Available Near You
            </h3>
            <button className="text-emerald-600 text-sm font-bold">See Map</button>
          </div>

          <div className="space-y-4">
            {availablePickups.length === 0 ? (
              <div className="bg-slate-50 p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">No jobs available</p>
                <p className="text-xs text-slate-400 mt-1">Check back later for new shipments.</p>
              </div>
            ) : (
              availablePickups.map((pickup: any) => (
                <div key={pickup.schedule_id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-slate-400">
                         <MapPin className="w-4 h-4" />
                         <span className="text-xs font-bold">{pickup.distance_km} km total</span>
                      </div>
                      <div className="text-emerald-600 font-black text-sm">
                         ₹{(pickup.distance_km * 15).toFixed(2)}
                      </div>
                   </div>

                   <h4 className="font-bold text-slate-900 mb-2">{pickup.order?.request?.listing?.category?.name} ({pickup.order?.quantity} MT)</h4>
                   
                   <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                         <span className="truncate">{pickup.pickup_address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                         <span className="truncate">{pickup.delivery_address}</span>
                      </div>
                   </div>

                   <button 
                    onClick={() => claimPickup(pickup.order_id)}
                    className="w-full bg-slate-50 text-slate-900 group-hover:bg-emerald-600 group-hover:text-white py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                   >
                      Claim Shipment
                      <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
