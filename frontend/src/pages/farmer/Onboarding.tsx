import React, { useState } from 'react';
import { Leaf, Building, Ruler, ArrowRight, Loader2, Navigation } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

export default function FarmerOnboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    farm_name: '',
    farm_address: '',
    city: '',
    state: '',
    latitude: 0,
    longitude: 0,
    land_size_acres: 0,
  });

  const { onboardFarmer, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      onboardFarmer(formData);
    }
  };

  const updateFormData = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Farm Registration</h1>
          <p className="text-slate-500 mt-2">Let's set up your farm profile to start listing waste.</p>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  step === i ? "w-8 bg-emerald-500" : "w-2 bg-slate-200"
                )} 
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-500" />
                  Farm Details
                </h2>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Farm Name</label>
                  <input
                    type="text"
                    required
                    value={formData.farm_name}
                    onChange={(e) => updateFormData('farm_name', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="e.g. Green Valley Farm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Farm Address</label>
                  <textarea
                    required
                    value={formData.farm_address}
                    onChange={(e) => updateFormData('farm_address', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px]"
                    placeholder="Full street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => updateFormData('state', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-500" />
                  Location & Size
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.latitude}
                      onChange={(e) => updateFormData('latitude', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.longitude}
                      onChange={(e) => updateFormData('longitude', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Land Size (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.land_size_acres}
                    onChange={(e) => updateFormData('land_size_acres', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
                    {(error as any).response?.data?.message || 'Failed to register farm. Please check your data.'}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {step === 2 ? 'Complete Registration' : 'Next Step'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
