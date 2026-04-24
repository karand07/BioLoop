import { Truck, MapPin, Package, CheckCircle2, IndianRupee, Navigation, Loader2, ArrowRight, AlertCircle, TrendingUp, Calendar, Filter, Clock } from 'lucide-react';
import { useLogistics } from '../../hooks/useLogistics';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

export default function LogisticsDashboard() {
  const { user } = useAuth();
  const { availablePickups, myPickups, isAvailableLoading, isMyPickupsLoading, claimPickup, markPickedUp, markDelivered } = useLogistics();

  const activeDeliveries = myPickups.filter((p: any) => p.status !== 'delivered');
  const completedDeliveries = myPickups.filter((p: any) => p.status === 'delivered');

  const stats = [
    { label: 'Active Jobs', value: activeDeliveries.length, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2 this week' },
    { label: 'Completed', value: completedDeliveries.length, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Lifetime' },
    { label: 'Available', value: availablePickups.length, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'In your area' },
    { label: 'Total Earnings', value: `₹${(completedDeliveries.length * 1200).toLocaleString()}`, icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Escrow: ₹5,400' },
  ];

  if (isAvailableLoading || isMyPickupsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
          <Truck className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Syncing Fleet Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Online • Fleet Node #42
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 font-medium">You have {activeDeliveries.length} active shipments to handle today.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="px-4 py-2 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vehicle Status</p>
              <p className="text-xs font-black text-slate-900 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 {user?.logistics_profile?.vehicle_number || "MH 12 AB 1234"}
              </p>
           </div>
           <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-slate-100 flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Go Online
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
            <div className="flex items-baseline gap-2">
               <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-3 flex items-center gap-1">
               <TrendingUp className="w-3 h-3 text-emerald-500" />
               {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Active Jobs - Takes 2 columns */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Shipments</h3>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 transition-all">
                  <Filter className="w-4 h-4" />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {activeDeliveries.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <Package className="w-10 h-10 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-slate-900">No active cargo</p>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto">Your fleet is currently idle. Browse available shipments to start earning.</p>
                </div>
                <button className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
                   Explore Opportunities
                </button>
              </div>
            ) : (
              activeDeliveries.map((pickup: any) => (
                <div key={pickup.schedule_id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  {/* Left Side - Info */}
                  <div className="flex-1 p-8 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                              {pickup.order?.request?.listing?.category?.name}
                           </span>
                           <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                              {pickup.order?.quantity} MT Cargo
                           </span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mt-2">Order ID #{pickup.order_id}</h4>
                      </div>
                      <div className={cn(
                        "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                        pickup.status === 'confirmed' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-indigo-600 text-white shadow-indigo-100'
                      )}>
                        {pickup.status.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Visual Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                       <div className="space-y-6">
                          <div className="flex gap-4">
                             <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                   <MapPin className="w-4 h-4" />
                                </div>
                                <div className="w-0.5 h-12 bg-slate-100" />
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Origin / Pickup</p>
                                <p className="text-sm font-bold text-slate-900 mt-1">{pickup.pickup_address}</p>
                                <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                                   <Clock className="w-3 h-3" />
                                   Est: 10:30 AM
                                </p>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                <Navigation className="w-4 h-4" />
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Destination / Factory</p>
                                <p className="text-sm font-bold text-slate-900 mt-1">{pickup.delivery_address}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">{pickup.distance_km} km away</p>
                             </div>
                          </div>
                       </div>

                       <div className="bg-slate-50 rounded-3xl p-6 flex flex-col justify-between border border-slate-100">
                          <div className="flex items-center justify-between mb-4">
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Earnings Projection</p>
                             <TrendingUp className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div className="space-y-1">
                             <p className="text-2xl font-black text-slate-900">₹{(pickup.distance_km * 15 + 200).toLocaleString()}</p>
                             <p className="text-[10px] text-slate-400 font-bold">Base: ₹200 + ₹15/km</p>
                          </div>
                          <div className="mt-4 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-emerald-500 transition-all duration-1000" 
                                style={{ width: pickup.status === 'confirmed' ? '33%' : '66%' }} 
                             />
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-50">
                       {pickup.status === 'confirmed' ? (
                          <button 
                            onClick={() => markPickedUp(pickup.order_id)}
                            className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-100"
                          >
                             <Package className="w-5 h-5" />
                             Confirm Pickup
                          </button>
                       ) : (
                          <button 
                            onClick={() => markDelivered(pickup.order_id)}
                            className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-100"
                          >
                             <CheckCircle2 className="w-5 h-5" />
                             Mark as Delivered
                          </button>
                       )}
                       <button className="flex-1 bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                          <Navigation className="w-4 h-4 text-emerald-600" />
                          Map
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Available Shipments - Sidebar Style */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-100">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Marketplace</h3>
            </div>
            <button className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline">See All</button>
          </div>

          <div className="space-y-4">
            {availablePickups.length === 0 ? (
              <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">No jobs nearby</p>
                <p className="text-xs text-slate-400 mt-1">New shipments arrive every 15 minutes.</p>
              </div>
            ) : (
              availablePickups.map((pickup: any) => (
                <div key={pickup.schedule_id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg">
                         <MapPin className="w-3 h-3 text-emerald-500" />
                         <span className="text-[10px] font-black text-slate-900">{pickup.distance_km} KM</span>
                      </div>
                      <div className="text-emerald-600 font-black text-lg">
                         ₹{(pickup.distance_km * 15 + 200).toLocaleString()}
                      </div>
                   </div>

                   <div className="space-y-1 mb-6">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Consignment</p>
                      <h4 className="font-bold text-slate-900 truncate">{pickup.order?.request?.listing?.category?.name} • {pickup.order?.quantity} MT</h4>
                   </div>
                   
                   <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                         <p className="text-xs font-medium text-slate-600 line-clamp-1">{pickup.pickup_address}</p>
                      </div>
                      <div className="flex items-start gap-3">
                         <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                         <p className="text-xs font-medium text-slate-600 line-clamp-1">{pickup.delivery_address}</p>
                      </div>
                   </div>

                   <button 
                    onClick={() => claimPickup(pickup.order_id)}
                    className="w-full bg-slate-50 text-slate-900 group-hover:bg-emerald-600 group-hover:text-white py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                   >
                      Claim Shipment
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Tip Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
             <div className="relative space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                   <Calendar className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-black uppercase tracking-widest text-indigo-300">Fleet Tip</p>
                   <p className="text-sm font-bold text-slate-100">Claim jobs with 'High Priority' tags to earn an extra 10% on base fare.</p>
                </div>
                <button className="text-xs font-black text-white underline underline-offset-4">Learn More</button>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
