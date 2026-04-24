import { Truck, MapPin, Package, CheckCircle2, IndianRupee, Navigation, ArrowRight, TrendingUp } from 'lucide-react';
import { useLogistics } from '../../hooks/useLogistics';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

export default function LogisticsDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { availablePickups, myPickups, isAvailableLoading, isMyPickupsLoading, claimPickup } = useLogistics();

  const activeDeliveries = myPickups.filter((p: any) => p.status !== 'delivered');
  const completedDeliveries = myPickups.filter((p: any) => p.status === 'delivered');

  const stats = [
    { label: t('active_duties'), value: activeDeliveries.length, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2 this week' },
    { label: t('deliveries'), value: completedDeliveries.length, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Lifetime' },
    { label: t('find_shipments'), value: availablePickups.length, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'In your area' },
    { label: t('earnings'), value: `₹${(completedDeliveries.length * 1200).toLocaleString()}`, icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Escrow: ₹5,400' },
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
            {t('system_online')} • Fleet Node #42
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {t('welcome_back')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 font-medium">{t('fleet_performance')}</p>
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
        {/* Active Jobs Preview */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('active_duties')}</h3>
            </div>
            <Link to="/logistics/deliveries" className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
              {t('all_deliveries')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {activeDeliveries.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <Package className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-xl font-bold text-slate-900">{t('no_active_cargo')}</p>
              </div>
            ) : (
              activeDeliveries.slice(0, 1).map((pickup: any) => (
                <div key={pickup.schedule_id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  <div className="flex-1 p-8 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                              {pickup.order?.request?.listing?.category?.name}
                           </span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mt-2">ID #{pickup.order_id}</h4>
                      </div>
                      <div className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-600 text-white">
                        {pickup.status.replace('_', ' ')}
                      </div>
                    </div>

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
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('origin')}</p>
                                <p className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[200px]">{pickup.pickup_address}</p>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                <Navigation className="w-4 h-4" />
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('destination')}</p>
                                <p className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[200px]">{pickup.delivery_address}</p>
                             </div>
                          </div>
                       </div>

                       <div className="bg-slate-50 rounded-3xl p-6 flex flex-col justify-center border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t('earnings')}</p>
                          <p className="text-2xl font-black text-slate-900">₹{(pickup.distance_km * 15 + 200).toLocaleString()}</p>
                       </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-50">
                       <Link 
                         to="/logistics/deliveries"
                         className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                       >
                          {t('deliveries')}
                       </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Available Shipments Preview */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-100">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('new_opportunities')}</h3>
            </div>
            <Link to="/logistics/find" className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
              {t('find_more')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {availablePickups.slice(0, 2).map((pickup: any) => (
              <div key={pickup.schedule_id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pickup.distance_km} KM Away</span>
                    <div className="text-emerald-600 font-black text-lg">
                       ₹{(pickup.distance_km * 15 + 200).toLocaleString()}
                    </div>
                 </div>

                 <div className="space-y-1 mb-6">
                    <h4 className="font-bold text-slate-900 truncate">{pickup.order?.request?.listing?.category?.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{pickup.order?.quantity} MT</p>
                 </div>
                 
                 <button 
                  onClick={() => claimPickup(pickup.order_id)}
                  className="w-full bg-slate-50 text-slate-900 hover:bg-emerald-600 hover:text-white py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2"
                 >
                    {t('claim_job')}
                    <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
