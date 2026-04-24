import { IndianRupee, ArrowRight, Search, AlertCircle, Clock } from 'lucide-react';
import { useLogistics } from '../../hooks/useLogistics';
import { useState } from 'react';

export default function LogisticsFind() {
  const { availablePickups, isAvailableLoading, claimPickup } = useLogistics();
  const [search, setSearch] = useState('');

  const filteredPickups = availablePickups.filter((p: any) => 
    p.pickup_address.toLowerCase().includes(search.toLowerCase()) ||
    p.delivery_address.toLowerCase().includes(search.toLowerCase()) ||
    p.order?.request?.listing?.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isAvailableLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Scanning for Shipments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Marketplace</h1>
          <p className="text-slate-500 font-medium">Find and claim high-value delivery jobs in your region.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search location or cargo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 w-full md:w-72 font-bold text-sm transition-all"
              />
           </div>
        </div>
      </div>

      {filteredPickups.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-xl font-bold text-slate-900">No matching shipments</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPickups.map((pickup: any) => (
            <div key={pickup.schedule_id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden">
               <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                     <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        {pickup.distance_km} KM Route
                     </div>
                     <div className="flex flex-col items-end">
                        <p className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
                           <IndianRupee className="w-4 h-4" />
                           {(pickup.distance_km * 15 + 200).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Est. Earnings</p>
                     </div>
                  </div>

                  <div className="space-y-2 mb-8">
                     <h4 className="text-xl font-black text-slate-900 truncate">
                       {pickup.order?.request?.listing?.category?.name}
                     </h4>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{pickup.order?.quantity} MT Total Weight</p>
                  </div>
                  
                  <div className="space-y-6 mb-10 relative">
                     <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-100" />
                     <div className="flex items-start gap-4 relative">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-4 ring-emerald-50 shrink-0 mt-1" />
                        <div>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Pickup</p>
                           <p className="text-xs font-bold text-slate-700 line-clamp-1">{pickup.pickup_address}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 relative">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white ring-4 ring-indigo-50 shrink-0 mt-1" />
                        <div>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Delivery</p>
                           <p className="text-xs font-bold text-slate-700 line-clamp-1">{pickup.delivery_address}</p>
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={() => claimPickup(pickup.order_id)}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-slate-100"
                  >
                     CLAIM SHIPMENT NOW
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Market Insight Section */}
      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Clock className="w-10 h-10" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Peak Hours Incoming</h3>
            <p className="text-slate-500 font-medium max-w-lg">Shipment volume usually increases between 4 PM and 8 PM. Stay online to claim the highest paying routes first.</p>
         </div>
         <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Market Active
         </div>
      </div>
    </div>
  );
}
