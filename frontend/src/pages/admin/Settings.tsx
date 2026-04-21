import React from 'react';
import { Shield, Bell, CreditCard, Percent, Zap, Save, Loader2, Globe, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminSettings() {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Platform Settings</h1>
          <p className="text-slate-500 mt-1">Configure global marketplace parameters and security.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-200 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-8">
           {/* Financials Section */}
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Percent className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Marketplace Financials</h3>
              </div>
              <div className="p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Platform Commission (%)</label>
                       <p className="text-xs text-slate-400 mb-3">Fee charged on every successful order.</p>
                       <div className="relative">
                          <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="number" defaultValue={5} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Minimum Order Value (₹)</label>
                       <p className="text-xs text-slate-400 mb-3">Smallest transaction allowed on the platform.</p>
                       <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="number" defaultValue={500} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Security Section */}
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Shield className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Security & Verification</h3>
              </div>
              <div className="p-8 space-y-6">
                 {[
                    { id: 'v1', label: 'Manual Farmer Verification', desc: 'Admin must approve all new farmer registrations before they can list waste.', active: true },
                    { id: 'v2', label: 'Company KYC Required', desc: 'Require GST and Address proof for all company accounts.', active: true },
                    { id: 'v3', label: 'Auto-Lock Inactive Users', desc: 'Block users who haven\'t logged in for 90 days.', active: false },
                 ].map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                       <div className="space-y-1">
                          <p className="font-bold text-slate-700">{t.label}</p>
                          <p className="text-xs text-slate-400">{t.desc}</p>
                       </div>
                       <button className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          t.active ? 'bg-emerald-500' : 'bg-slate-200'
                       )}>
                          <div className={cn(
                             "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                             t.active ? 'right-1' : 'left-1'
                          )} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Zap className="w-5 h-5 text-emerald-400" />
                 Platform Health
              </h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-400 flex items-center gap-2">
                       <Globe className="w-4 h-4" /> Regional Nodes
                    </span>
                    <span className="text-emerald-400">99.9% Up</span>
                 </div>
                 <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-400 flex items-center gap-2">
                       <Lock className="w-4 h-4" /> SSL Status
                    </span>
                    <span className="text-blue-400">Secure</span>
                 </div>
                 <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-400 flex items-center gap-2">
                       <Bell className="w-4 h-4" /> SMS Gateway
                    </span>
                    <span className="text-emerald-400">Active</span>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Backup & Maintenance</h3>
              <div className="space-y-4">
                 <button className="w-full py-3.5 border-2 border-slate-100 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
                    Download DB Backup
                 </button>
                 <button className="w-full py-3.5 border-2 border-red-50 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all">
                    Enter Maintenance Mode
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
