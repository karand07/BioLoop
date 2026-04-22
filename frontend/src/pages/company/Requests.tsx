import { MessageSquare, IndianRupee, Package,  Clock, CheckCircle2, XCircle, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { cn } from '../../lib/utils';
import NegotiationBlock from '../../components/negotiation/NegotiationBlock';

const statusConfig: Record<string, { color: string, icon: any, label: string }> = {
  pending: { color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock, label: 'Pending Response' },
  negotiating: { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: MessageSquare, label: 'In Negotiation' },
  accepted: { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2, label: 'Accepted' },
  rejected: { color: 'bg-red-50 text-red-700 border-red-100', icon: XCircle, label: 'Rejected' },
  auto_rejected: { color: 'bg-slate-50 text-slate-500 border-slate-100', icon: AlertCircle, label: 'Expired' },
};

export default function CompanyRequests() {
  const { myRequests, isMyRequestsLoading, refetchMyRequests } = useOrders();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Sent Requests</h1>
        <p className="text-slate-500 mt-1">Track the status of your purchase proposals.</p>
      </div>

      {isMyRequestsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : myRequests.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 text-center border border-dashed border-slate-200">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900">No requests sent</h3>
          <p className="text-slate-500 mt-2">Browse the marketplace to find waste and send requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {myRequests.map((request: any) => {
            const config = statusConfig[request.status] || statusConfig.pending;
            const Icon = config.icon;
            
            return (
              <div key={request.request_id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="p-8 flex flex-col lg:flex-row gap-8">
                  {/* Listing Preview */}
                  <div className="w-full lg:w-48 aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={request.listing?.images} alt="Waste" className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                          <Package className="w-3.5 h-3.5" />
                          {request.listing?.category?.name}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-slate-400" />
                          {request.listing?.farmer?.farm_name}
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                          Sent on {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={cn(
                        "px-4 py-2 rounded-2xl border font-bold text-sm flex items-center gap-2",
                        config.color
                      )}>
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100/50">
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Requested</p>
                        <p className="font-bold text-slate-900">{request.requested_quantity} {request.listing?.category?.unit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Your Offer</p>
                        <p className="font-bold text-emerald-600 flex items-center">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {request.offered_price}
                          <span className="text-[10px] opacity-60 ml-0.5">/{request.listing?.category?.unit}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Listing Price</p>
                        <p className="font-bold text-slate-500">₹{request.listing?.asking_price}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Value</p>
                        <p className="font-bold text-slate-900 text-lg">₹{(request.requested_quantity * request.offered_price).toFixed(2)}</p>
                      </div>
                    </div>

                    {request.status === 'negotiating' && (
                      <NegotiationBlock 
                        requestId={request.request_id}
                        currentPrice={request.offered_price}
                        unit={request.listing?.category?.unit}
                        role="company"
                        onStatusUpdate={refetchMyRequests}
                      />
                    )}

                    {request.status === 'accepted' && (
                      <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-bold text-sm">Farmer accepted! Order is being finalized.</span>
                         </div>
                         <button className="text-xs font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-all">
                            View Order
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
