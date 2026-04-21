import { ShoppingBag, Calendar, IndianRupee, Package, Truck, MoreVertical, Loader2 } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { cn } from '../../lib/utils';

const orderStatusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function FarmerOrders() {
  const { orders, isOrdersLoading } = useOrders();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-500 mt-1">Track and manage your finalized sales.</p>
      </div>

      {isOrdersLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No orders found</h3>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">
            Confirmed requests will appear here as orders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order: any) => (
            <div key={order.order_id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                {/* Order Meta */}
                <div className="flex-1 flex items-center gap-6 w-full">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <Package className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Order #{order.order_id}</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                        orderStatusColors[order.status] || 'bg-slate-100'
                      )}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 truncate">
                      {order.listing?.category?.name || 'Bio Waste Order'}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        Buyer: {order.company?.company_name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount & Status */}
                <div className="flex items-center gap-8 w-full md:w-auto md:border-l border-slate-100 md:pl-8 pt-4 md:pt-0">
                  <div className="flex-1 md:flex-none">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-emerald-600 flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {order.final_price }
                    </p>
                  </div>
                  <div className="flex-1 md:flex-none">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Quantity</p>
                    <p className="text-lg font-bold text-slate-700">
                      {order.quantity} <span className="text-sm font-medium text-slate-400">{order.listing?.category?.unit}</span>
                    </p>
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Progress Bar (Optional) */}
              <div className="px-6 pb-6 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                  <span>Ordered</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                   <div className={cn("h-full bg-emerald-500 rounded-full", order.status !== 'pending' ? 'w-1/3' : 'w-1/12')} />
                   <div className={cn("h-full bg-emerald-500 rounded-full", (order.status === 'delivered' || order.status === 'closed') ? 'w-1/3' : 'w-0')} />
                   <div className={cn("h-full bg-emerald-500 rounded-full", order.status === 'closed' ? 'w-1/3' : 'w-0')} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
