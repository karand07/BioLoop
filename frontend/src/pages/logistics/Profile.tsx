import React, { useState, useEffect } from 'react';
import { Mail, Phone, Truck, Loader2, Edit3, Save, X, ShieldCheck, MapPin, CreditCard, Building2, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

export default function LogisticsProfile() {
  const { user, isLoading, updateLogisticsProfile, onboardLogistics } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicle_type: '',
    vehicle_number: '',
    service_area: '',
    account_number: '',
    ifsc: '',
    bank_name: '',
  });

  const profile = user?.logistics_profile;

  useEffect(() => {
    if (profile) {
      setFormData({
        vehicle_type: profile.vehicle_type || '',
        vehicle_number: profile.vehicle_number || '',
        service_area: profile.service_area || '',
        account_number: profile.account_number || '',
        ifsc: profile.ifsc || '',
        bank_name: profile.bank_name || '',
      });
    } else if (!isLoading && !profile) {
      setIsEditing(true);
    }
  }, [profile, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      updateLogisticsProfile(formData);
    } else {
      onboardLogistics(formData);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Loading Fleet Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            Partner Settings
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Fleet <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">Configuration</span>
          </h1>
          <p className="text-slate-500 font-medium">Keep your vehicle and payout details updated for seamless operations.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Edit3 className="w-5 h-5 text-emerald-500" />
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative group">
            <div className="h-32 bg-gradient-to-br from-slate-900 to-indigo-900 relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>
            
            <div className="px-8 pb-8 -mt-12 relative text-center">
               <div className="w-24 h-24 bg-white rounded-[2rem] p-1 shadow-xl mx-auto mb-4">
                  <div className="w-full h-full bg-emerald-50 text-emerald-600 rounded-[1.8rem] flex items-center justify-center">
                    <Truck className="w-10 h-10" />
                  </div>
               </div>
               
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">{formData.vehicle_number || 'New Partner'}</h3>
               <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">{formData.vehicle_type || 'Unregistered'}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Partner</span>
               </div>

               <div className="mt-10 space-y-4 text-left">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                        <User className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Partner Name</p>
                        <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                        <Mail className="w-5 h-5" />
                     </div>
                     <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Contact Email</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                        <Phone className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Support Line</p>
                        <p className="text-sm font-bold text-slate-900">{user?.phone || 'Not Verified'}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-100">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
             <div className="relative space-y-4">
                <ShieldCheck className="w-10 h-10 text-white/50" />
                <h4 className="text-xl font-black tracking-tight">Verified Fleet</h4>
                <p className="text-sm text-emerald-50 text-medium opacity-90">Your documents are verified. You are eligible for high-value hazardous waste shipments.</p>
             </div>
          </div>
        </div>

        {/* Main Settings Form */}
        <div className="lg:col-span-8 space-y-8">
          <div className={cn(
            "bg-white rounded-[3rem] border transition-all duration-500",
            isEditing ? "border-emerald-200 shadow-2xl shadow-emerald-50 p-10" : "border-slate-100 shadow-sm p-8"
          )}>
            <div className="space-y-12">
              {/* Fleet Details Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Fleet Specifications</h3>
                    <p className="text-sm text-slate-400 font-medium">Configure your vehicle type and logistics coverage.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Plate Number</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.vehicle_number}
                      onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none disabled:opacity-60 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                      placeholder="e.g. MH 12 AB 1234"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Classification</label>
                    <select
                      disabled={!isEditing}
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none disabled:opacity-60 transition-all font-bold text-slate-900 appearance-none"
                    >
                      <option value="">Select Capacity</option>
                      <option value="small">Light (Pickup/Lister)</option>
                      <option value="medium">Medium (6-10 Wheeler)</option>
                      <option value="large">Heavy (12+ Wheeler/Trailer)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Operational Zone</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.service_area}
                        onChange={(e) => setFormData({ ...formData, service_area: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none disabled:opacity-60 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        placeholder="e.g. Maharashtra & Gujarat Corridor"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Financial Section */}
              <section className="space-y-8 pt-10 border-t border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Settlement Account</h3>
                    <p className="text-sm text-slate-400 font-medium">Earnings will be settled to this bank account.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Institution Name</label>
                    <div className="relative">
                       <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                       <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.bank_name}
                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none disabled:opacity-60 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        placeholder="e.g. State Bank of India"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                    <input
                      type="password"
                      disabled={!isEditing}
                      value={formData.account_number}
                      onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none disabled:opacity-60 transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bank Identifier (IFSC)</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ifsc}
                      onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none disabled:opacity-60 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                      placeholder="e.g. SBIN0001234"
                    />
                  </div>
                </div>
              </section>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {profile && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 px-8 border border-slate-200 text-slate-600 font-black text-sm rounded-[1.5rem] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Discard Changes
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-[2] bg-slate-900 hover:bg-emerald-600 text-white font-black text-sm py-4 px-8 rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Save className="w-5 h-5" />
                    {profile ? 'Commit Changes' : 'Register Vehicle'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
