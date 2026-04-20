import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Lock, Phone, UserCircle, ArrowRight, Loader2, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

const roles = [
  { id: 'farmer', name: 'Farmer', description: 'List your bio-waste for sale' },
  { id: 'company', name: 'Company', description: 'Purchase and manage bio-waste' },
  { id: 'logistics', name: 'Logistics', description: 'Provide pickup and transport services' },
];

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    role: 'farmer',
  });
  const { signup, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(formData);
  };

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-200 mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create Your Account</h1>
          <p className="text-slate-500 mt-2 text-center">
            Join the BioLoop ecosystem and start your journey towards sustainable waste management.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-4">Select Your Role</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => updateFormData('role', role.id)}
                    className={cn(
                      "cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 relative",
                      formData.role === role.id 
                        ? "border-emerald-500 bg-emerald-50 shadow-md" 
                        : "border-slate-100 bg-slate-50 hover:border-emerald-200"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 mb-3 flex items-center justify-center transition-colors",
                      formData.role === role.id ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                    )}>
                      {formData.role === role.id && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <h3 className="font-bold text-slate-900">{role.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
                {(error as any).response?.data?.message || 'Failed to create account. Please try again.'}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
