import { useState } from 'react';
import { ShoppingBag, IndianRupee, Truck, Loader2, Building2, MapPin, Clock, CheckCircle2, Calendar, X, Package } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../hooks/useAuth';
import { useSystem } from '../../hooks/useSystem';
import { cn } from '../../lib/utils';

const orderStatusColors: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function CompanyOrders() {
  const { orders, isOrdersLoading, confirmSlot, isConfirming, initiatePayment, isInitiatingPayment, verifyPayment, confirmDelivery, isConfirmingDelivery } = useOrders();
  const { settings } = useSystem();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewingSummary, setViewingSummary] = useState<any>(null);

  const handleConfirm = (slot: string) => {
    confirmSlot({ orderId: selectedOrder.order_id, slot });
    setSelectedOrder(null);
  };

  const handlePayment = async (order: any) => {
    try {
      const res = await initiatePayment(order.order_id);
      const { razorpayOrder } = res.data;
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "BioLoop",
        description: `Order #${order.order_id}`,
        order_id: razorpayOrder.id,
        handler: (response: any) => {
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          setViewingSummary(null);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#10b981" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment initialization failed', err);
    }
  };

  const handleConfirmDelivery = (orderId: number) => {
    confirmDelivery(orderId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-500 mt-1">Manage and track your active purchases.</p>
      </div>

      {isOrdersLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 text-center border border-dashed border-slate-200">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900">No orders yet</h3>
          <p className="text-slate-500 mt-2">Your confirmed purchase requests will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order: any) => (
            <div key={order.order_id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              <div className="p-8 flex flex-col xl:flex-row gap-8">
                {/* Order Meta & Seller Info */}
                <div className="flex-1 flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-48 aspect-square rounded-3xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={order.request?.listing?.images} alt="Waste" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Order #{order.order_id}</span>
                      <span className={cn(
                        "text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest",
                        orderStatusColors[order.status] || 'bg-slate-100'
                      )}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {order.request?.listing?.category?.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-sm">{order.farmer?.farm_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium">{order.farmer?.city}, {order.farmer?.state}</span>
                      </div>
                    </div>

                    {order.pickup_schedule && order.pickup_schedule.status === 'pending' && (
                       <div className="mt-6 bg-amber-50 p-6 rounded-3xl border border-amber-100">
                          <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Clock className="w-4 h-4" />
                             Action Required: Confirm Pickup
                          </h4>
                          <p className="text-xs text-amber-700 mb-4">The farmer has proposed slots. Please select one to enable logistics.</p>
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-amber-700 transition-all"
                          >
                             Review Proposed Slots
                          </button>
                       </div>
                    )}

                    {order.pickup_schedule?.status === 'confirmed' && (
                       <div className="mt-6 bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                          <h4 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <CheckCircle2 className="w-4 h-4" />
                             Pickup Scheduled
                          </h4>
                          <p className="text-xs text-emerald-700 font-bold">
                             Confirmed for: {new Date(order.pickup_schedule.confirmed_slot).toLocaleString()}
                          </p>
                       </div>
                    )}
                  </div>
                </div>

                {/* Logistics & Payment Summary */}
                <div className="w-full xl:w-96 flex flex-col gap-4 border-t xl:border-t-0 xl:border-l border-slate-100 pt-8 xl:pt-0 xl:pl-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                        {order.status === 'confirmed' ? 'Total Payable' : 'Total Paid'}
                      </p>
                      <p className="text-xl font-bold text-emerald-600 flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {order.total_amount}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Quantity</p>
                      <p className="text-xl font-bold text-slate-700 flex items-center gap-1">
                        {order.quantity}
                        <span className="text-xs opacity-50">{order.request?.listing?.category?.unit}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <span className={cn(order.status !== 'confirmed' && 'text-emerald-500')}>Paid</span>
                      <span className={cn((order.status === 'in_transit' || order.status === 'delivered') && 'text-emerald-500')}>In Transit</span>
                      <span className={cn(order.status === 'closed' && 'text-emerald-500')}>Delivered</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex gap-1 p-0.5">
                       <div className={cn("h-full bg-emerald-500 rounded-full transition-all duration-700", order.status !== 'confirmed' ? 'w-1/3' : 'w-4')} />
                       <div className={cn("h-full bg-emerald-500 rounded-full transition-all duration-700 delay-300", (order.status === 'in_transit' || order.status === 'delivered' || order.status === 'closed') ? 'w-1/3' : 'w-0')} />
                       <div className={cn("h-full bg-emerald-500 rounded-full transition-all duration-700 delay-500", order.status === 'closed' ? 'w-1/3' : 'w-0')} />
                    </div>
                  </div>

                  {order.status === 'confirmed' && (
                    <button 
                      onClick={() => setViewingSummary(order)}
                      className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                    >
                      <IndianRupee className="w-4 h-4" />
                      View Summary & Pay
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <button 
                      onClick={() => handleConfirmDelivery(order.order_id)}
                      disabled={isConfirmingDelivery}
                      className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                    >
                      {isConfirmingDelivery ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Confirm Delivery
                    </button>
                  )}

                  {order.status === 'in_transit' && (
                    <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                      <Truck className="w-4 h-4" />
                      Track Shipment
                    </button>
                  )}
                  
                  {order.status === 'closed' && (
                    <div className="bg-slate-50 text-slate-500 py-3 rounded-xl font-bold text-xs text-center border border-slate-100">
                      Transaction Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Summary Modal */}
      {viewingSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setViewingSummary(null)}
              className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-2xl transition-colors z-10"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <div className="p-10">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Summary</h2>
                <p className="text-slate-500 font-bold text-sm">Review details before payment</p>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                         <Package className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">Waste Cost ({viewingSummary.quantity} {viewingSummary.request?.listing?.category?.unit})</span>
                   </div>
                   <span className="font-black text-slate-900 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {(Number(viewingSummary.final_price) * Number(viewingSummary.quantity)).toFixed(2)}
                   </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                         <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">Logistics & Delivery</span>
                   </div>
                   <span className="font-black text-slate-900 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {Number(viewingSummary.delivery_cost).toFixed(2)}
                   </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                         <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">Platform Commission ({settings?.commission_rate || '5.0'}%)</span>
                   </div>
                   <span className="font-black text-slate-900 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {Number(viewingSummary.platform_commission).toFixed(2)}
                   </span>
                </div>

                <div className="h-px bg-slate-100 my-4" />

                <div className="flex justify-between items-center px-4">
                   <span className="text-lg font-black text-slate-900">Total Payable</span>
                   <span className="text-3xl font-black text-emerald-600 flex items-center gap-1">
                      <IndianRupee className="w-6 h-6" />
                      {Number(viewingSummary.total_amount).toFixed(2)}
                   </span>
                </div>
              </div>

              <button 
                onClick={() => handlePayment(viewingSummary)}
                disabled={isInitiatingPayment}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {isInitiatingPayment ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <IndianRupee className="w-5 h-5" />
                    Complete Secure Payment
                  </>
                )}
              </button>
              
              <p className="text-center text-[10px] text-slate-400 font-bold mt-6 flex items-center justify-center gap-2">
                 <Truck className="w-3 h-3" />
                 Secured Escrow Payment via Razorpay
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Select Slot Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl transition-colors z-10"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Select Slot</h2>
                  <p className="text-slate-500">Pick a time for the pickup.</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedOrder.pickup_schedule?.proposed_slots.map((slot: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleConfirm(slot)}
                    disabled={isConfirming}
                    className="w-full p-6 text-left border-2 border-slate-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group flex items-center justify-between"
                  >
                    <div>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Option {index + 1}</p>
                       <p className="font-bold text-slate-700">{new Date(slot).toLocaleString()}</p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              <div className="mt-8 bg-slate-50 p-4 rounded-2xl text-xs text-slate-500 leading-relaxed italic">
                 Once confirmed, this order will be visible to our logistics partners for pickup.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
