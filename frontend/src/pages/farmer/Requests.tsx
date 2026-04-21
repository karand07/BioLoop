import  { useState } from 'react';
import { Package, Building2, IndianRupee, Check, X, MessageSquare, Loader2, ArrowRight } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { cn } from '../../lib/utils';

export default function FarmerRequests() {
  const { incomingRequests, isRequestsLoading, respondToRequest, isResponding } = useOrders();
  const [negotiatingId, setNegotiatingId] = useState<number | null>(null);
  const [negotiatedPrice, setNegotiatedPrice] = useState<string>('');

  const handleAction = (requestId: number, action: 'accepted' | 'rejected' | 'negotiated') => {
    if (action === 'negotiated') {
      if (!negotiatedPrice) return;
      respondToRequest({ requestId, action, negotiatedPrice: parseFloat(negotiatedPrice) });
      setNegotiatingId(null);
      setNegotiatedPrice('');
    } else {
      respondToRequest({ requestId, action });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Incoming Requests</h1>
        <p className="text-slate-500 mt-1">Manage purchase requests and negotiations from companies.</p>
      </div>

      {isRequestsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : incomingRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No requests yet</h3>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">
            You'll see purchase requests here once companies discover your listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {incomingRequests.map((request: any) => (
            <div key={request.request_id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Listing Preview */}
                <div className="w-full lg:w-48 aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                  <img src={request.listing?.images} alt="Waste" className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-1">
                        <Package className="w-4 h-4" />
                        {request.listing?.category?.name}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-slate-400" />
                        {request.company?.company_name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">Request sent on {new Date(request.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Offered Price</p>
                      <p className="text-lg font-bold text-emerald-600 flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {request.offered_price}
                        <span className="text-xs text-slate-400 font-medium ml-1">/ {request.listing?.category?.unit}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quantity</p>
                      <p className="font-bold text-slate-700">{request.requested_quantity} {request.listing?.category?.unit}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Listing Price</p>
                      <p className="font-bold text-slate-700">₹{request.listing?.asking_price}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Value</p>
                      <p className="font-bold text-slate-900">₹{request.offered_price * request.requested_quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                        request.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        request.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      )}>
                        {request.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {request.status === 'pending' && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {negotiatingId === request.request_id ? (
                        <div className="flex items-center gap-3 w-full animate-in slide-in-from-left-2">
                          <div className="relative flex-1">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="number"
                              value={negotiatedPrice}
                              onChange={(e) => setNegotiatedPrice(e.target.value)}
                              placeholder="Enter your price"
                              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                          </div>
                          <button 
                            onClick={() => handleAction(request.request_id, 'negotiated')}
                            disabled={isResponding || !negotiatedPrice}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Send Offer <ArrowRight className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setNegotiatingId(null)}
                            className="p-2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleAction(request.request_id, 'accepted')}
                            disabled={isResponding}
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]"
                          >
                            <Check className="w-5 h-5" /> Accept Request
                          </button>
                          <button 
                            onClick={() => setNegotiatingId(request.request_id)}
                            disabled={isResponding}
                            className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
                          >
                            <MessageSquare className="w-5 h-5 text-emerald-500" /> Negotiate
                          </button>
                          <button 
                            onClick={() => handleAction(request.request_id, 'rejected')}
                            disabled={isResponding}
                            className="bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-all"
                          >
                            <X className="w-5 h-5" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
