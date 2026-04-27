import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, IndianRupee, Package, Calendar, ArrowRight, Loader2, ShoppingCart,  X, RefreshCw, AlertCircle } from 'lucide-react';
import { useWaste } from '../../hooks/useWaste';
import { useOrders } from '../../hooks/useOrders';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

export default function CompanyMarketplace() {
  const { t } = useTranslation();
  const { listings, categories, isAllListingsLoading, refetchAllListings, listingsError } = useWaste();
  const { createRequest, isCreatingRequest, myRequests, isMyRequestsLoading, requestsError } = useOrders();
  
  const isLoading = isAllListingsLoading || isMyRequestsLoading;
  const isError = !!listingsError || !!requestsError;
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [orderData, setOrderData] = useState({ quantity: '', price: '' });

  const filteredListings = useMemo(() => {
    // Safety check for data types
    if (!Array.isArray(listings) || !Array.isArray(myRequests)) return [];

    // Get IDs of listings already requested by this company (ensure numeric for comparison)
    const requestedListingIds = new Set(myRequests.map((r: any) => Number(r.listing_id)));

    return listings.filter((listing: any) => {
      // Hide listings already requested or not active
      if (requestedListingIds.has(Number(listing.listing_id))) return false;
      if (listing.status !== 'active') return false;

      const matchesCategory = selectedCategory === 'all' || listing.category_id.toString() === selectedCategory;
      const matchesSearch = (listing.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (listing.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (listing.farmer?.farm_name || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [listings, myRequests, selectedCategory, searchQuery]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    createRequest({
      listing_id: selectedListing.listing_id,
      requested_quantity: parseFloat(orderData.quantity),
      offered_price: parseFloat(orderData.price),
      farmer_id: selectedListing.farmer_id
    });
    
    setSelectedListing(null);
    setOrderData({ quantity: '', price: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Hero Section */}
      <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-100">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Package className="w-full h-full -rotate-12 translate-x-1/4" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">{t('source_bio_waste')}</h1>
          <p className="text-emerald-100 text-lg leading-relaxed">
            {t('marketplace_hero_desc')}
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
              <input 
                type="text"
                placeholder={t('search_waste_type')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-12 pr-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-400 transition-all cursor-pointer"
              >
                <option value="all" className="text-slate-900">{t('all_categories')}</option>
                {categories.map((cat: any) => (
                  <option key={cat.category_id} value={cat.category_id.toString()} className="text-slate-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          {t('available_listings')}
          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-xs font-bold">
            {filteredListings.length}
          </span>
        </h2>
        <button 
          onClick={() => refetchAllListings()}
          disabled={isLoading}
          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all disabled:opacity-50"
          title={t('refresh_list')}
        >
          <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-12 text-center my-10">
           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-red-900 mb-2">{t('error_loading_data')}</h3>
           <p className="text-red-700/70 mb-6 max-w-md mx-auto">{t('check_connection_desc')}</p>
           <button 
             onClick={() => { refetchAllListings(); }}
             className="bg-white text-red-600 border border-red-200 px-8 py-3 rounded-2xl font-bold hover:bg-red-100 transition-all shadow-sm shadow-red-100"
           >
             {t('try_again')}
           </button>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900">{t('no_listings_found')}</h3>
          <p className="text-slate-500 mt-2">{t('adjust_filters_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing: any) => (
            <div 
              key={listing.listing_id}
              className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={listing.images} 
                  alt={listing.category?.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-1.5 shadow-sm">
                  <Package className="w-3.5 h-3.5" />
                  {listing.category?.name}
                </div>
                <div className="absolute bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {listing.asking_price}
                  <span className="text-[10px] opacity-70 ml-1 font-medium">/ {listing.category?.unit}</span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">{listing.farmer?.city}, {listing.farmer?.state}</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-1 rounded-lg">
                    {listing.quantity} {listing.category?.unit} {t('avail_short')}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{listing.farmer?.farm_name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 min-h-[40px]">{listing.description}</p>
                
                <div className="flex items-center gap-4 py-4 border-y border-slate-50">
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('available_from')}</p>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      {new Date(listing.available_from).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedListing(listing);
                    setOrderData({ quantity: listing.quantity, price: listing.asking_price });
                  }}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t('send_request')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedListing(null)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl transition-colors z-10"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{t('purchase_request')}</h2>
                  <p className="text-slate-500">{t('source_from', { farm_name: selectedListing.farmer?.farm_name })}</p>
                </div>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <img src={selectedListing.images} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('listing_detail')}</p>
                      <p className="font-bold text-slate-700">{selectedListing.category?.name} • ₹{selectedListing.asking_price}/{selectedListing.category?.unit}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('quantity_with_unit', { unit: selectedListing.category?.unit })}</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        required
                        max={selectedListing.quantity}
                        value={orderData.quantity}
                        onChange={(e) => setOrderData({ ...orderData, quantity: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t('offered_price_per_unit', { unit: selectedListing.category?.unit })}</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        required
                        value={orderData.price}
                        onChange={(e) => setOrderData({ ...orderData, price: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                  <div className="flex items-center justify-between text-emerald-900 font-bold">
                    <span>{t('estimated_total')}</span>
                    <span className="text-xl flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {(parseFloat(orderData.quantity || '0') * parseFloat(orderData.price || '0')).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingRequest}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isCreatingRequest ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {t('confirm_request')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
