import React, { useState, useEffect } from 'react';
import { Mail, Phone, Building, Loader2, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LocationPicker from '../../components/shared/LocationPicker';
import { cn } from '../../lib/utils';

export default function CompanyProfile() {
  const { t } = useTranslation();
  const { user, isLoading, updateCompanyProfile, onboardCompany } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: '',
    business_type: '',
    address: '',
    latitude: 0,
    longitude: 0,
    gst_number: '',
  });

  const company = user?.company_profile;

  useEffect(() => {
    if (company) {
      setFormData({
        company_name: company.company_name || '',
        business_type: company.business_type || '',
        address: company.address || '',
        latitude: parseFloat(company.latitude) || 0,
        longitude: parseFloat(company.longitude) || 0,
        gst_number: company.gst_number || '',
      });
    } else if (!isLoading && !company) {
      setIsEditing(true);
    }
  }, [company, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company) {
      updateCompanyProfile(formData);
    } else {
      onboardCompany(formData);
    }
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
            {!company ? t('complete_business_profile') : isEditing ? t('edit_business_info') : t('business_profile')}
          </h1>
          <p className="text-slate-500 mt-1">{t('company_desc')}</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Edit3 className="w-5 h-5 text-emerald-500" />
            {t('edit_profile')}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-900" />
            <div className="w-24 h-24 bg-slate-100 text-slate-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              {formData.company_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'C'}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{formData.company_name || t('your_company')}</h3>
            <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{formData.business_type || t('industrial_partner')}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('work_email')}</p>
                  <p className="text-sm font-bold truncate text-slate-900">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('business_phone')}</p>
                  <p className="text-sm font-bold text-slate-900">{user?.phone || t('not_provided')}</p>
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
                    <Building className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{t('business_details')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('company_name_label')}</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                      placeholder={t('company_name_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('business_type_label')}</label>
                    <select
                      disabled={!isEditing}
                      value={formData.business_type}
                      onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60 appearance-none"
                    >
                      <option value="">{t('select_type')}</option>
                      <option value="Manufacturing">{t('manufacturing')}</option>
                      <option value="Biomass Power">{t('biomass_power')}</option>
                      <option value="Composting">{t('composting')}</option>
                      <option value="Recycling">{t('recycling')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('gst_number')}</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.gst_number}
                      onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60"
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('hq_address')}</label>
                    <textarea
                      disabled={!isEditing}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60 min-h-[100px]"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-6 pt-8 border-t border-slate-50">
                <LocationPicker 
                  lat={formData.latitude} 
                  lng={formData.longitude} 
                  onChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })} 
                  readOnly={!isEditing}
                />
              </section>

              {isEditing && (
                <div className="flex gap-4 pt-8">
                  {company && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      {t('cancel')}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {company ? t('save_changes') : t('complete_registration')}
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
