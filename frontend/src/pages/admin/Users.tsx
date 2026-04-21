import { useAdmin } from '../../hooks/useAdmin';
import { Search, ShieldCheck, ShieldAlert, Ban, MoreVertical, Loader2, Mail, Phone, Calendar, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminUsers() {
  const { users, isUsersLoading, verifyUser, blockUser } = useAdmin();

  if (isUsersLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by email, role or ID..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">Export CSV</button>
           <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg">New Support Ticket</button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Join Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 flex items-center gap-2">
                           {user.email}
                           {user.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                           <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> UID: {user.id}</span>
                           <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                      user.role === 'farmer' ? 'bg-emerald-50 text-emerald-600' :
                      user.role === 'company' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {user.is_verified ? (
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                        <ShieldAlert className="w-4 h-4" />
                        Pending
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.created_at).toLocaleDateString()}
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {!user.is_verified && (
                          <button 
                            onClick={() => verifyUser(user.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                          >
                             Verify
                          </button>
                       )}
                       <button 
                        onClick={() => blockUser(user.id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Block User"
                       >
                          <Ban className="w-5 h-5" />
                       </button>
                       <button className="p-2.5 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
             <div className="py-20 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">No users found</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
