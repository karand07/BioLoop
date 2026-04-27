import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { useWaste } from '../../hooks/useWaste';
import { Tag, Plus, Trash2, Edit3, Loader2, IndianRupee, Package, X } from 'lucide-react';


export default function AdminCategories() {
  const { categories, isCategoriesLoading } = useWaste();
  const { createCategory, updateCategory, deleteCategory, isMutating } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_ref_price: 0,
    max_ref_price: 0,
    unit: 'kg',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory(formData);
    setIsAdding(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory({ id: editingCategory.category_id, formData });
      setEditingCategory(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', min_ref_price: 0, max_ref_price: 0, unit: 'kg' });
  };

  const openEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description,
      min_ref_price: Number(cat.min_ref_price),
      max_ref_price: Number(cat.max_ref_price),
      unit: cat.unit,
    });
  };

  if (isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Waste Categories</h1>
          <p className="text-slate-500 mt-1">Manage standard types of bio-waste supported on the platform.</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); resetForm(); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-200"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((cat: any) => (
          <div key={cat.category_id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900">
                <Tag className="w-7 h-7" />
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={() => openEdit(cat)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                 >
                    <Edit3 className="w-5 h-5" />
                 </button>
                 <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this category?')) {
                      deleteCategory(cat.category_id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                 >
                    <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2">{cat.description}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
               <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                     <IndianRupee className="w-3 h-3" /> Price Range
                  </p>
                  <p className="text-sm font-bold text-slate-700">₹{cat.min_ref_price} - {cat.max_ref_price}</p>
               </div>
               <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                     <Package className="w-3 h-3" /> Standard Unit
                  </p>
                  <p className="text-sm font-bold text-slate-700 uppercase">{cat.unit}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      {(isAdding || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => { setIsAdding(false); setEditingCategory(null); }}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl transition-colors z-10"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isAdding ? 'New Category' : 'Edit Category'}
              </h2>
              
              <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                    placeholder="e.g. Rice Husk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium min-h-[100px]"
                    placeholder="Briefly describe this waste type..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Min Price</label>
                    <input
                      type="number"
                      required
                      value={formData.min_ref_price}
                      onChange={(e) => setFormData({ ...formData, min_ref_price: parseFloat(e.target.value) })}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Max Price</label>
                    <input
                      type="number"
                      required
                      value={formData.max_ref_price}
                      onChange={(e) => setFormData({ ...formData, max_ref_price: parseFloat(e.target.value) })}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Standard Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium appearance-none"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="MT">Metric Ton (MT)</option>
                    <option value="bag">Bag</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isMutating}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isMutating ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAdding ? 'Create Category' : 'Save Changes')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
