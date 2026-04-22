import React, { useState, useEffect } from 'react';
import { Mail, Phone, Truck, Loader2, Edit3, Save, X, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

export default function LogisticsProfile() {
  const { user, isLoading } = useAuth();
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
    // We'll implement the actual mutation later if needed
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {!profile ? 'Complete Partner Profile' : isEditing ? 'Edit Vehicle Info' : 'Fleet Profile'}
          </h1>
          <p className="text-slate-500 mt-1">Manage your vehicle details and service parameters.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Edit3 className="w-5 h-5 text-emerald-500" />
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-900" />
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              <Truck className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{formData.vehicle_number || 'New Vehicle'}</h3>
            <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{formData.vehicle_type || 'Transit Partner'}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Email</p>
                  <p className="text-sm font-bold truncate text-slate-900">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Phone</p>
                  <p className="text-sm font-bold text-slate-900">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className={cn(
            "bg-white p-8 rounded-[2.5rem] border transition-all duration-300",
            isEditing ? "border-emerald-200 shadow-xl shadow-emerald-50" : "border-slate-100 shadow-sm"
          )}>
            <div className="space-y-8">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Vehicle & Service Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Number</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.vehicle_number}
                      onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                      placeholder="e.g. MH 12 AB 1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                    <select
                      disabled={!isEditing}
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60 appearance-none"
                    >
                      <option value="">Select Type</option>
                      <option value="small">Small (Pickup/Van)</option>
                      <option value="medium">Medium (6-Wheeler)</option>
                      <option value="large">Large (Truck/Trailer)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Service Area (City/Region)</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.service_area}
                        onChange={(e) => setFormData({ ...formData, service_area: e.target.value })}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                        placeholder="e.g. Mumbai Metro Region"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Bank Details */}
              <section className="space-y-6 pt-8 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Payout Account</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bank Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.account_number}
                      onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">IFSC Code</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ifsc}
                      onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </section>

              {isEditing && (
                <div className="flex gap-4 pt-8">
                  {profile && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {profile ? 'Save Changes' : 'Join Fleet'}
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
