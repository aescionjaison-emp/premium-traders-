import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Layers } from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { ICollection } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/admin/ConfirmModal.js';
import { MediaUploader } from '../../components/admin/MediaUploader.js';
import { ImageUploader } from '../../components/admin/ImageUploader.js';

export const AdminCollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<ICollection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ICollection | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [featured, setFeatured] = useState(true);
  const [visible, setVisible] = useState(true);

  const { success, error } = useToast();

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCollections();
      if (res.data && res.data.success && res.data.data && res.data.data.length > 0) {
        setCollections(res.data.data);
      } else {
        const { DEFAULT_COLLECTIONS } = await import('../../data/showroomCatalogData.js');
        setCollections(DEFAULT_COLLECTIONS);
      }
    } catch (err) {
      const { DEFAULT_COLLECTIONS } = await import('../../data/showroomCatalogData.js');
      setCollections(DEFAULT_COLLECTIONS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreateModal = () => {
    setEditingCol(null);
    setName('');
    setDescription('');
    setImages([]);
    setDisplayOrder(collections.length + 1);
    setFeatured(true);
    setVisible(true);
    setIsModalOpen(true);
  };

  const openEditModal = (col: ICollection) => {
    setEditingCol(col);
    setName(col.name);
    setDescription(col.description || '');
    setImages(col.image ? [col.image] : []);
    setDisplayOrder(col.displayOrder || 0);
    setFeatured(col.featured);
    setVisible(col.visible);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Collection name is required');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      image: images[0] || '',
      displayOrder: Number(displayOrder) || 0,
      featured,
      visible,
    };

    try {
      if (editingCol) {
        const res = await api.updateCollection(editingCol._id, payload);
        if (res.data.success) success('Collection updated');
      } else {
        const res = await api.createCollection(payload);
        if (res.data.success) success('Collection created');
      }
      setIsModalOpen(false);
      fetchCollections();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save collection');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.deleteCollection(deleteTarget._id);
      if (res.data.success) {
        success('Collection deleted');
        setDeleteTarget(null);
        fetchCollections();
      }
    } catch (err) {
      error('Failed to delete collection');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-showroom-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            SUITE MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
            MASTER COLLECTIONS ({collections.length})
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4 text-showroom-bronze" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-xs uppercase text-showroom-muted">
            Loading collections...
          </div>
        ) : (
          collections.map((col) => (
            <div
              key={col._id}
              className="bg-white border border-showroom-border overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-showroom-ivory overflow-hidden">
                <img
                  src={col.image || 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=85'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold uppercase text-showroom-charcoal">
                    {col.name}
                  </h3>
                  <span className="text-[10px] font-mono text-showroom-muted">
                    Order: {col.displayOrder}
                  </span>
                </div>
                {col.description && (
                  <p className="text-xs text-showroom-muted line-clamp-2">
                    {col.description}
                  </p>
                )}
              </div>

              <div className="p-3 bg-showroom-sand/20 border-t border-showroom-sand/60 flex items-center justify-between">
                <div className="flex gap-2 text-[10px] font-bold uppercase">
                  <span className={col.visible ? 'text-green-800' : 'text-gray-400'}>
                    {col.visible ? 'Visible' : 'Hidden'}
                  </span>
                  {col.featured && <span className="text-showroom-bronze">• Featured</span>}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(col)}
                    className="p-1.5 text-showroom-muted hover:text-showroom-charcoal"
                    title="Edit Collection"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(col)}
                    className="p-1.5 text-red-600 hover:text-red-800"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-showroom-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-showroom-border">
              <h3 className="font-serif text-lg font-bold uppercase text-showroom-charcoal">
                {editingCol ? `Edit Collection` : 'New Master Collection'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-showroom-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CALACATTA & STATUARIO GRANDE"
                  className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                />
              </div>

              <ImageUploader images={images} onChange={setImages} maxImages={1} label="Cover Image" />

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 accent-showroom-bronze"
                    />
                    <span>Featured</span>
                  </label>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={(e) => setVisible(e.target.checked)}
                      className="w-4 h-4 accent-showroom-bronze"
                    />
                    <span>Visible</span>
                  </label>
                </div>
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
                  <span>Save Collection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Collection"
        message={`Delete collection "${deleteTarget?.name}"?`}
        confirmText="Delete Collection"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
