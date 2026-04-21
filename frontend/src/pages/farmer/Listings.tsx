import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, IndianRupee, Package, Calendar} from 'lucide-react';
import { useWaste } from '../../hooks/useWaste';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  sold: 'bg-blue-100 text-blue-800 border-blue-200',
  expired: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function FarmerListings() {
  const { myListings, isListingsLoading, deleteListing, refetchListings } = useWaste();

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this listing?')) {
      await deleteListing(id);
      refetchListings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
          <p className="text-slate-500 mt-1">You have {myListings.length} total listings.</p>
        </div>
        <Link 
          to="/farmer/create-listing" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Create New Listing
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search listings..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
        <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Listings Grid */}
      {isListingsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : myListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No listings yet</h3>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">
            You haven't listed any bio-waste yet. Click the button above to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((listing: any) => (
            <div key={listing.listing_id} className="eco-card overflow-hidden group">
              {/* Image Header */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img 
                  src={listing.images} 
                  alt={listing.description} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={cn(
                  "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                  statusColors[listing.status] || 'bg-slate-100'
                )}>
                  {listing.status}
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white">
                    <MoreVertical className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{listing.category?.name || 'Bio Waste'}</h3>
                    <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(listing.available_from).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-600 font-bold flex items-center justify-end">
                      <IndianRupee className="w-4 h-4" />
                      {listing.asking_price}
                    </div>
                    <div className="text-slate-400 text-xs">per {listing.category?.unit || 'unit'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-3 border-y border-slate-50">
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Quantity</p>
                    <p className="text-sm font-bold text-slate-700">{listing.quantity} {listing.category?.unit}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100" />
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Created</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(listing.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link 
                    to={`/farmer/edit-listing/${listing.listing_id}`}
                    className="flex-1 bg-slate-50 text-slate-600 hover:bg-slate-100 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(listing.listing_id)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
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
