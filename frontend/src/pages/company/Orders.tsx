import { ShoppingBag,IndianRupee, Truck,  Loader2, Building2, MapPin } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { cn } from '../../lib/utils';

const orderStatusColors: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function CompanyOrders() {
  const { orders, isOrdersLoading } = useOrders();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
                  </div>
                </div>

                {/* Logistics & Payment Summary */}
                <div className="w-full xl:w-96 flex flex-col gap-4 border-t xl:border-t-0 xl:border-l border-slate-100 pt-8 xl:pt-0 xl:pl-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Paid</p>
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
                      <span className={cn(order.status !== 'pending' && 'text-emerald-500')}>Confirmed</span>
                      <span className={cn((order.status === 'in_transit' || order.status === 'delivered') && 'text-emerald-500')}>In Transit</span>
                      <span className={cn(order.status === 'delivered' && 'text-emerald-500')}>Delivered</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex gap-1 p-0.5">
                       <div className={cn("h-full bg-emerald-500 rounded-full transition-all duration-700", order.status !== 'pending' ? 'w-1/3' : 'w-4')} />
                       <div className={cn("h-full bg-emerald-500 rounded-full transition-all duration-700 delay-300", (order.status === 'in_transit' || order.status === 'delivered') ? 'w-1/3' : 'w-0')} />
                       <div className={cn("h-full bg-emerald-500 rounded-full transition-all duration-700 delay-500", order.status === 'delivered' ? 'w-1/3' : 'w-0')} />
                    </div>
                  </div>

                  <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4" />
                    Track Shipment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
