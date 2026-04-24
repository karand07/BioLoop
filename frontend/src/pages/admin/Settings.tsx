import React, { useEffect, useState } from 'react';
import { CreditCard, Percent, Zap, Save, Loader2 } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';

export default function AdminSettings() {
  const { settings, isSettingsLoading, updateSettings, isMutating } = useAdmin();
  const [formData, setFormData] = useState({
    commission_rate: 5,
    min_order_value: 500,
    base_logistics_rate: 50,
    is_maintenance_mode: false,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        commission_rate: Number(settings.commission_rate),
        min_order_value: Number(settings.min_order_value),
        base_logistics_rate: Number(settings.base_logistics_rate),
        is_maintenance_mode: settings.is_maintenance_mode,
      });
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  if (isSettingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Loading Global Config...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            System Configuration
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">Settings</span>
          </h1>
          <p className="text-slate-500 font-medium">Fine-tune the marketplace economics and global parameters.</p>
        </div>
        <button 
          type="submit"
          disabled={isMutating}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-2 transition-all shadow-xl shadow-emerald-100 disabled:opacity-70 active:scale-95"
        >
          {isMutating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          SAVE CONFIGURATION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="space-y-8">
           {/* Financials Section */}
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                    <Percent className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Marketplace Financials</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Revenue & Pricing Control</p>
                 </div>
              </div>
              <div className="p-10 space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-3">
                       <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Platform Commission (%)</label>
                       <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Percentage fee automatically deducted from every successful order payout.</p>
                       <div className="relative group">
                          <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input 
                            type="number" 
                            step="0.1"
                            value={formData.commission_rate}
                            onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-black text-slate-700 transition-all" 
                          />
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                       <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Min. Order Value (₹)</label>
                       <p className="text-[10px] text-slate-400 font-medium leading-relaxed">The lowest transaction amount allowed. Prevents micro-orders with high overhead.</p>
                       <div className="relative group">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input 
                            type="number" 
                            value={formData.min_order_value}
                            onChange={(e) => setFormData({ ...formData, min_order_value: parseFloat(e.target.value) })}
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-black text-slate-700 transition-all" 
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Base Logistics (₹/km)</label>
                       <p className="text-[10px] text-slate-400 font-medium leading-relaxed">System-wide reference rate used to estimate delivery costs for buyers.</p>
                       <div className="relative group">
                          <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input 
                            type="number" 
                            value={formData.base_logistics_rate}
                            onChange={(e) => setFormData({ ...formData, base_logistics_rate: parseFloat(e.target.value) })}
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-black text-slate-700 transition-all" 
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </form>
  );
}
