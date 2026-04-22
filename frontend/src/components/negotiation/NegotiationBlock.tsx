import { useState } from 'react';
import { MessageSquare, IndianRupee, Loader2, CheckCircle2, History, Send } from 'lucide-react';
import { useNegotiation } from '../../hooks/useNegotiation';
import { cn } from '../../lib/utils';

interface NegotiationBlockProps {
  requestId: number;
  currentPrice: number;
  unit: string;
  role: 'farmer' | 'company';
  onStatusUpdate: () => void;
}

export default function NegotiationBlock({ requestId, currentPrice, unit, role, onStatusUpdate }: NegotiationBlockProps) {
  const { history, isHistoryLoading, sendOffer, isSending, finalize, isFinalizing } = useNegotiation(requestId);
  const [newPrice, setNewPrice] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);

  const lastOffer = history[history.length - 1];
  const isMyTurn = lastOffer ? (role === 'farmer' ? lastOffer.proposed_by === 'company' : lastOffer.proposed_by === 'farmer') : (role === 'farmer');

  const handleSendOffer = () => {
    if (!newPrice) return;
    sendOffer({ requestId, price: parseFloat(newPrice), message }, {
      onSuccess: () => {
        setNewPrice('');
        setMessage('');
        onStatusUpdate();
      }
    });
  };

  const handleAccept = () => {
    finalize(requestId, {
      onSuccess: () => {
        onStatusUpdate();
      }
    });
  };

  if (isHistoryLoading) return <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-emerald-500" /></div>;

  return (
    <div className="mt-6 space-y-4 animate-in slide-in-from-top-2">
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-bold">Negotiation Loop</h4>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <History className="w-3 h-3" />
            {showHistory ? 'Hide History' : 'View History'}
          </button>
        </div>

        {showHistory && (
          <div className="mb-6 space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar relative z-10">
            {history.map((h: any, i: number) => (
              <div key={i} className={cn(
                "p-3 rounded-2xl text-xs flex justify-between items-center",
                h.proposed_by === role ? "bg-white/5 ml-8" : "bg-emerald-500/10 mr-8"
              )}>
                <div>
                   <p className="font-bold opacity-60 uppercase tracking-tighter text-[8px] mb-1">
                      {h.proposed_by === 'farmer' ? 'Farmer' : 'Company'} Offered
                   </p>
                   <p className="font-black text-sm">₹{h.proposed_price}/{unit}</p>
                   {h.message && <p className="text-slate-400 mt-1 italic">"{h.message}"</p>}
                </div>
                <p className="text-[8px] text-slate-500 uppercase">{new Date(h.created_at).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        )}

        {!isMyTurn ? (
          <div className="text-center py-4 bg-white/5 rounded-2xl border border-white/5">
             <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
             <p className="text-sm font-bold text-slate-400">Waiting for {role === 'farmer' ? 'Company' : 'Farmer'}'s response...</p>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                   <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                    type="number" 
                    placeholder={`Counter offer (Current: ₹${currentPrice})`}
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                   />
                </div>
                <button 
                  onClick={handleAccept}
                  disabled={isFinalizing || !lastOffer}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {isFinalizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Accept Last Offer
                </button>
             </div>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add a message (optional)" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm outline-none focus:border-emerald-500/50"
                />
                <button 
                  onClick={handleSendOffer}
                  disabled={isSending || !newPrice}
                  className="bg-white text-slate-900 p-3 rounded-2xl hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
