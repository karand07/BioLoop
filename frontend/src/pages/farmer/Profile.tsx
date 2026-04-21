import React, { useState, useEffect } from 'react';
import { Mail, Phone, ShieldCheck, Building, Loader2, Edit3, Save, X, Navigation, Ruler, CheckCircle2, Leaf } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

export default function FarmerProfile() {
  const { user, isLoading, updateFarmerProfile, onboardFarmer } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    farm_name: '',
    farm_address: '',
    city: '',
    state: '',
    latitude: 0,
    longitude: 0,
    land_size_acres: 0,
    bank_name: '',
    account_number: '',
    ifsc: '',
  });

  const farmer = user?.farmer_profile;

  // Sync form data when user data is available
  useEffect(() => {
    if (farmer) {
      setFormData({
        farm_name: farmer.farm_name || '',
        farm_address: farmer.farm_address || '',
        city: farmer.city || '',
        state: farmer.state || '',
        latitude: parseFloat(farmer.latitude) || 0,
        longitude: parseFloat(farmer.longitude) || 0,
        land_size_acres: parseFloat(farmer.land_size_acres) || 0,
        bank_name: farmer.bank_name || '',
        account_number: farmer.account_number || '',
        ifsc: farmer.ifsc || '',
      });
    } else if (!isLoading && !farmer) {
      // If no farmer profile exists, we are in "Onboarding" mode
      setIsEditing(true);
    }
  }, [farmer, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (farmer) {
      updateFarmerProfile(formData);
    } else {
      onboardFarmer(formData);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {!farmer ? 'Complete Your Profile' : isEditing ? 'Edit Profile' : 'My Profile'}
          </h1>
          <p className="text-slate-500 mt-1">
            {!farmer ? 'Please provide your farm details to get started.' : 'Manage your farm and account information.'}
          </p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Edit3 className="w-5 h-5 text-emerald-500" />
            Edit Details
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Basic Info & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl font-bold transition-transform group-hover:scale-105 duration-300">
              {formData.farm_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{formData.farm_name || 'BioLoop Farmer'}</h3>
            <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mt-1">Farmer Partner</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-bold truncate text-slate-700">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-500">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-bold text-slate-700">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
              {user?.is_verified && (
                <div className="flex items-center gap-3 text-emerald-600 font-bold bg-emerald-50/50 px-4 py-2 rounded-2xl border border-emerald-100">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-widest">Verified Partner</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Stats or Tips */}
          <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-lg shadow-emerald-100 relative overflow-hidden">
             <Leaf className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-800/50 rotate-12" />
             <h4 className="text-lg font-bold mb-2 relative z-10">Eco Tip</h4>
             <p className="text-emerald-100/80 text-sm leading-relaxed relative z-10">
               Accurate farm location helps logistics partners reach you faster, reducing carbon footprint.
             </p>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className={cn(
            "bg-white p-8 rounded-3xl border transition-all duration-300",
            isEditing ? "border-emerald-200 shadow-xl shadow-emerald-50" : "border-slate-100 shadow-sm"
          )}>
            <div className="space-y-8">
              {/* Farm Details Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Building className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Farm Location & Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Farm Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.farm_name}
                      onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60 disabled:bg-slate-50/50"
                      placeholder="Green Valley Estate"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Farm Address</label>
                    <textarea
                      disabled={!isEditing}
                      value={formData.farm_address}
                      onChange={(e) => setFormData({ ...formData, farm_address: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60 min-h-[80px]"
                      placeholder="123 Farm Road, Sector 4..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </section>

              {/* Coordinates & Land Size */}
              <section className="space-y-6 pt-8 border-t border-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-emerald-500" />
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      disabled={!isEditing}
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-emerald-500" />
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      disabled={!isEditing}
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-emerald-500" />
                      Land (Acres)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      disabled={!isEditing}
                      value={formData.land_size_acres}
                      onChange={(e) => setFormData({ ...formData, land_size_acres: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </section>

              {/* Bank Details */}
              <section className="space-y-6 pt-8 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Bank Details for Payouts</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bank Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                      placeholder="e.g. State Bank of India"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.account_number}
                      onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">IFSC Code</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ifsc}
                      onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </section>

              {isEditing && (
                <div className="flex gap-4 pt-8">
                  {farmer && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {farmer ? 'Save Changes' : 'Complete Registration'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {!isEditing && farmer && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900">Your profile is up to date</h4>
                <p className="text-emerald-700/70 text-sm">Update your details anytime by clicking "Edit Details" above.</p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
