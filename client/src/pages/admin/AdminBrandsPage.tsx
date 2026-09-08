import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { IBrand } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/admin/ConfirmModal.js';
import { MediaUploader } from '../../components/admin/MediaUploader.js';

export const AdminBrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IBrand | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tiles');
  const [logo, setLogo] = useState<string[]>([]);
  const [displayOrder, setDisplayOrder] = useState(0);

  const { success, error } = useToast();

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await api.getBrands();
      if (res.data && res.data.success && res.data.data && res.data.data.length > 0) {
        setBrands(res.data.data);
      } else {
        const { DEFAULT_BRANDS } = await import('../../data/showroomCatalogData.js');
        setBrands(DEFAULT_BRANDS);
      }
    } catch (err) {
      const { DEFAULT_BRANDS } = await import('../../data/showroomCatalogData.js');
      setBrands(DEFAULT_BRANDS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openModal = (b?: IBrand) => {
    if (b) {
      setEditingBrand(b);
      setName(b.name);
      setCategory(b.category || 'Tiles');
      setLogo(b.logo ? [b.logo] : []);
      setDisplayOrder(b.displayOrder || 0);
    } else {
      setEditingBrand(null);
      setName('');
      setCategory('Tiles');
      setLogo([]);
      setDisplayOrder(brands.length + 1);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Brand name is required');
      return;
    }

    const payload = {
      name: name.trim(),
      category,
      logo: logo[0] || '',
      displayOrder: Number(displayOrder) || 0,
    };

    try {
      if (editingBrand) {
        await api.updateBrand(editingBrand._id, payload);
        success('Brand updated');
      } else {
        await api.createBrand(payload);
        success('Brand created');
      }
      setIsModalOpen(false);
      fetchBrands();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save brand');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteBrand(deleteTarget._id);
      success('Brand deleted');
      setDeleteTarget(null);
      fetchBrands();
    } catch (err) {
      error('Failed to delete brand');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-showroom-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            MANUFACTURER & PARTNERS
          </span>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
            BRANDS ({brands.length})
          </h1>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4 text-showroom-bronze" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="bg-white border border-showroom-border overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-showroom-sand/30 border-b border-showroom-border text-[10px] font-bold uppercase tracking-widest text-showroom-muted">
              <th className="p-3.5">Brand Name</th>
              <th className="p-3.5">Discipline</th>
              <th className="p-3.5">Display Order</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-showroom-sand/60">
            {brands.map((b) => (
              <tr key={b._id} className="hover:bg-showroom-sand/10 transition-colors">
                <td className="p-3 font-bold uppercase text-showroom-charcoal">
                  {b.name}
                </td>
                <td className="p-3 text-showroom-muted uppercase font-medium">
                  {b.category}
                </td>
                <td className="p-3 font-mono font-bold text-showroom-charcoal">
                  {b.displayOrder}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal(b)}
                      className="p-1.5 text-showroom-muted hover:text-showroom-charcoal"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(b)}
                      className="p-1.5 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-showroom-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-showroom-border">
              <h3 className="font-serif text-lg font-bold uppercase text-showroom-charcoal">
                {editingBrand ? 'Edit Brand' : 'Add Brand'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-showroom-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Varmora Granito"
                  className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                  Discipline Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                >
                  <option value="Tiles">Tiles</option>
                  <option value="Granite">Granite & Natural Stone</option>
                  <option value="Wood">Wood & Veneers</option>
                  <option value="Electrical">Electrical & Lighting</option>
                  <option value="General">General Showroom Partner</option>
                </select>
              </div>

              <div>
                <MediaUploader
                  media={logo}
                  onChange={setLogo}
                  maxFiles={1}
                  acceptType="image"
                  label="Brand Logo (Drag & Drop)"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-showroom-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-showroom-border text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-showroom-charcoal text-white text-xs font-bold uppercase flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-showroom-bronze" />
                  <span>Save Brand</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Brand"
        message={`Delete "${deleteTarget?.name}"?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
