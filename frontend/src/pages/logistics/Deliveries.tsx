import { Truck, MapPin, Package, CheckCircle2, IndianRupee, Navigation } from 'lucide-react';
import { useLogistics } from '../../hooks/useLogistics';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export default function LogisticsDeliveries() {
  const { myPickups, isMyPickupsLoading, markPickedUp, markDelivered } = useLogistics();
  const [filter, setFilter] = useState<'all' | 'in_transit' | 'confirmed' | 'delivered'>('all');

  const filteredPickups = myPickups.filter((p: any) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  if (isMyPickupsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Your Deliveries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Shipments</h1>
          <p className="text-slate-500 font-medium">Manage your active and completed cargo assignments.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           {['all', 'confirmed', 'in_transit', 'delivered'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === f ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                {f.replace('_', ' ')}
              </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPickups.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center space-y-4">
            <Truck className="w-16 h-16 text-slate-200" />
            <p className="text-xl font-bold text-slate-900">No shipments found</p>
          </div>
        ) : (
          filteredPickups.map((pickup: any) => (
            <div key={pickup.schedule_id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col xl:flex-row">
              {/* Main Info */}
              <div className="flex-1 p-8 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                          {pickup.order?.request?.listing?.category?.name}
                       </span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order #{pickup.order_id}</span>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900">
                      {pickup.order?.quantity} MT Consignment
                    </h4>
                  </div>
                  <div className={cn(
                    "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border",
                    pickup.status === 'confirmed' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    pickup.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    'bg-indigo-600 text-white border-indigo-700 shadow-indigo-100'
                  )}>
                    {pickup.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-8">
                      <div className="flex gap-5">
                         <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                               <MapPin className="w-5 h-5" />
                            </div>
                            <div className="w-0.5 h-12 bg-slate-100" />
                         </div>
                         <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Pickup From</p>
                            <p className="text-sm font-bold text-slate-900 leading-relaxed">{pickup.pickup_address}</p>
                         </div>
                      </div>
                      <div className="flex gap-5">
                         <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                            <Navigation className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Deliver To</p>
                            <p className="text-sm font-bold text-slate-900 leading-relaxed">{pickup.delivery_address}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{pickup.distance_km} KM Total Distance</p>
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-50 rounded-[2rem] p-8 flex flex-col justify-between border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <div>
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                            <IndianRupee className="w-3 h-3" />
                            Revenue Breakdown
                         </p>
                         <p className="text-4xl font-black text-slate-900 tracking-tighter">
                            ₹{(pickup.distance_km * 15 + 200).toLocaleString()}
                         </p>
                         <p className="text-[10px] text-emerald-600 font-bold mt-2 bg-emerald-100/50 w-fit px-2 py-0.5 rounded-lg">
                           Guaranteed Payout
                         </p>
                      </div>
                      <div className="mt-6 flex items-center gap-4">
                         <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                            <div 
                              className={cn(
                                "h-full bg-emerald-500 transition-all duration-1000",
                                pickup.status === 'confirmed' ? 'w-1/3' : 
                                pickup.status === 'in_transit' ? 'w-2/3' : 'w-full'
                              )} 
                            />
                         </div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           {pickup.status === 'confirmed' ? '33%' : pickup.status === 'in_transit' ? '66%' : '100%'}
                         </span>
                      </div>
                   </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-8 border-t border-slate-50">
                   {pickup.status === 'confirmed' && (
                      <button 
                        onClick={() => markPickedUp(pickup.order_id)}
                        className="flex-[2] min-w-[200px] bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-100 active:scale-95"
                      >
                         <Package className="w-5 h-5" />
                         START SHIPMENT / CONFIRM PICKUP
                      </button>
                   )}
                   {pickup.status === 'in_transit' && (
                      <button 
                        onClick={() => markDelivered(pickup.order_id)}
                        className="flex-[2] min-w-[200px] bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 active:scale-95"
                      >
                         <CheckCircle2 className="w-5 h-5" />
                         COMPLETE DELIVERY
                      </button>
                   )}
                   <button className="flex-1 min-w-[120px] bg-white border-2 border-slate-100 text-slate-900 py-5 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                      <Navigation className="w-4 h-4 text-emerald-600" />
                      NAVIGATE
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
