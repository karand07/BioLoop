import React, { useState } from 'react';
import { ShoppingBag, Calendar, IndianRupee, Package, Truck , Loader2, Clock, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { cn } from '../../lib/utils';

const orderStatusColors: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function FarmerOrders() {
  const { orders, isOrdersLoading, proposeSlots, isProposing } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [slots, setSlots] = useState<string[]>(['']);

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredSlots = slots.filter(s => s !== '');
    if (filteredSlots.length === 0) return;

    proposeSlots({ orderId: selectedOrder.order_id, slots: filteredSlots });
    setSelectedOrder(null);
    setSlots(['']);
  };

  const addSlot = () => setSlots([...slots, '']);
  const removeSlot = (index: number) => setSlots(slots.filter((_, i) => i !== index));
  const updateSlot = (index: number, val: string) => {
    const newSlots = [...slots];
    newSlots[index] = val;
    setSlots(newSlots);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales Orders</h1>
          <p className="text-slate-500 mt-1">Manage finalized sales and coordinate logistics.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
          Farmer Portal
        </div>
      </div>

      {isOrdersLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200">
          <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900">No orders yet</h3>
          <p className="text-slate-500 mt-2">Active sales will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order: any) => (
            <div key={order.order_id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              <div className="p-8 flex flex-col lg:flex-row items-center gap-8">
                {/* Order Meta */}
                <div className="flex-1 flex items-center gap-6 w-full">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
                    <img src={order.request?.listing?.images} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Order #{order.order_id}</span>
                      <span className={cn(
                        "text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest",
                        orderStatusColors[order.status] || 'bg-slate-100'
                      )}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 truncate">
                      {order.request?.listing?.category?.name}
                    </h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <Truck className="w-4 h-4 text-emerald-500" />
                        Buyer: {order.company?.company_name}
                      </span>
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        Ordered {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center gap-8 w-full lg:w-auto lg:border-l lg:border-slate-100 lg:pl-8 pt-6 lg:pt-0">
                  <div className="flex-1 lg:flex-none">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Earnings</p>
                    <p className="text-2xl font-black text-emerald-600 flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {order.total_amount}
                    </p>
                  </div>
                  <div className="flex-1 lg:flex-none">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Quantity</p>
                    <p className="text-xl font-black text-slate-700">
                      {order.quantity} <span className="text-xs font-bold text-slate-400">{order.request?.listing?.category?.unit}</span>
                    </p>
                  </div>
                  
                  {!order.pickup_schedule && order.status === 'in_transit' && (
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Propose Pickup
                    </button>
                  )}
                  {order.pickup_schedule && (
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Pickup Status</span>
                       <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          {order.pickup_schedule.status.replace('_', ' ')}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Propose Slots Modal */}
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
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Propose Pickup</h2>
                  <p className="text-slate-500">Provide 1-3 available time slots.</p>
                </div>
              </div>

              <form onSubmit={handlePropose} className="space-y-6">
                <div className="space-y-3">
                  {slots.map((slot, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1 relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="datetime-local"
                          required
                          value={slot}
                          onChange={(e) => updateSlot(index, e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-sm"
                        />
                      </div>
                      {slots.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeSlot(index)}
                          className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {slots.length < 3 && (
                    <button 
                      type="button"
                      onClick={addSlot}
                      className="w-full py-3 border border-dashed border-slate-200 text-slate-500 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Slot
                    </button>
                  )}
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                   <Package className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                   <p className="text-xs text-amber-700 leading-relaxed">
                     The buyer will select one of these slots. Logistics partners will be notified once a slot is confirmed.
                   </p>
                </div>

                <button
                  type="submit"
                  disabled={isProposing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isProposing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send Proposals
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
