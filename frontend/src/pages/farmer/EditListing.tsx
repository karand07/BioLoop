import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Package, IndianRupee, FileText, Calendar, Loader2, ArrowRight, Check, ArrowLeft } from 'lucide-react';
import { useWaste } from '../../hooks/useWaste';
import { cn } from '../../lib/utils';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, updateListing, isUpdating, getListingById } = useWaste();
  
  const { data: listing, isLoading: isFetching } = getListingById(Number(id));

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    category_id: '',
    quantity: '',
    asking_price: '',
    description: '',
    available_from: '',
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        category_id: listing.category_id.toString(),
        quantity: listing.quantity.toString(),
        asking_price: listing.asking_price.toString(),
        description: listing.description || '',
        available_from: new Date(listing.available_from).toISOString().split('T')[0],
      });
      setImagePreview(listing.images);
    }
  }, [listing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    if (file) data.append('file', file);
    data.append('category_id', formData.category_id);
    data.append('quantity', formData.quantity);
    data.append('asking_price', formData.asking_price);
    data.append('description', formData.description);
    data.append('available_from', formData.available_from);

    updateListing({ id: Number(id), formData: data });
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Listing</h1>
          <p className="text-slate-500 mt-1">Update your waste listing details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image Upload */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <label className="block text-sm font-semibold text-slate-700 mb-4">Listing Image</label>
            <div 
              className={cn(
                "relative aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all group",
                imagePreview ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/30"
              )}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => { setImagePreview(null); setFile(null); }}
                      className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/30 transition-all"
                    >
                      Change Image
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-emerald-500 group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Click to upload</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-500" />
                Waste Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat: any) => (
                  <button
                    key={cat.category_id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category_id: cat.category_id.toString() })}
                    className={cn(
                      "px-4 py-3 rounded-xl border-2 text-left transition-all relative",
                      formData.category_id === cat.category_id.toString()
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm"
                        : "border-slate-100 bg-slate-50 text-slate-600 hover:border-emerald-200"
                    )}
                  >
                    <div className="font-bold text-sm">{cat.name}</div>
                    <div className="text-[10px] opacity-60 truncate">{cat.unit}</div>
                    {formData.category_id === cat.category_id.toString() && (
                      <Check className="w-4 h-4 absolute top-2 right-2 text-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Asking Price</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    required
                    value={formData.asking_price}
                    onChange={(e) => setFormData({ ...formData, asking_price: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Available From
              </label>
              <input
                type="date"
                required
                value={formData.available_from}
                onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[120px]"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Save Changes
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
