import { useAdmin } from '../../hooks/useAdmin';
import { ShoppingCart, Truck, IndianRupee, Package, Loader2, MoreVertical, Building2} from 'lucide-react';
import { cn } from '../../lib/utils';

const orderStatusColors: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
  disputed: 'bg-red-100 text-red-800 border-red-200',
};

export default function AdminOrders() {
  const { orders, isOrdersLoading } = useAdmin();

  if (isOrdersLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Global Orders</h1>
        <p className="text-slate-500 mt-1">Monitor all marketplace transactions and logistics status.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parties (Farmer ➔ Buyer)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waste Detail</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financials</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order: any) => (
                <tr key={order.order_id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">#{order.order_id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                           <Building2 className="w-3 h-3" />
                        </div>
                        <span className="font-bold text-slate-700 truncate">{order.farmer?.farm_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                           <Building2 className="w-3 h-3" />
                        </div>
                        <span className="font-bold text-slate-700 truncate">{order.company?.company_name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                       <p className="font-bold text-slate-900">{order.request?.listing?.category?.name}</p>
                       <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                          <Package className="w-3 h-3" /> {order.quantity} {order.request?.listing?.category?.unit}
                       </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <p className="text-sm font-black text-emerald-600 flex items-center gap-1">
                          <IndianRupee className="w-3 h-3" /> {order.total_amount}
                       </p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          Comm: ₹{order.platform_commission}
                       </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                      orderStatusColors[order.status] || 'bg-slate-100'
                    )}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                          <Truck className="w-5 h-5" />
                       </button>
                       <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
             <div className="py-20 text-center text-slate-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">No orders logged</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
