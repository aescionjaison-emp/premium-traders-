import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { IGalleryItem } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/admin/ConfirmModal.js';
import { MediaUploader } from '../../components/admin/MediaUploader.js';
import { ImageUploader } from '../../components/admin/ImageUploader.js';

export const AdminGalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<IGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IGalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IGalleryItem | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tiles');
  const [locationOrSpace, setLocationOrSpace] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [displayOrder, setDisplayOrder] = useState(0);

  const { success, error } = useToast();

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const res = await api.getGallery();
      if (res.data.success) {
        setGallery(res.data.data);
      }
    } catch (err) {
      error('Failed to load gallery');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openModal = (item?: IGalleryItem) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title);
      setCategory(item.category || 'Tiles');
      setLocationOrSpace(item.locationOrSpace || '');
      setImages(item.image ? [item.image] : []);
      setDisplayOrder(item.displayOrder || 0);
    } else {
      setEditingItem(null);
      setTitle('');
      setCategory('Tiles');
      setLocationOrSpace('');
      setImages([]);
      setDisplayOrder(gallery.length + 1);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || images.length === 0) {
      error('Title and Image are required');
      return;
    }

    const payload = {
      title: title.trim(),
      category,
      locationOrSpace: locationOrSpace.trim(),
      image: images[0],
      displayOrder: Number(displayOrder) || 0,
      visible: true,
    };

    try {
      if (editingItem) {
        await api.updateGalleryItem(editingItem._id, payload);
        success('Gallery item updated');
      } else {
        await api.createGalleryItem(payload);
        success('Gallery item created');
      }
      setIsModalOpen(false);
      fetchGallery();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save gallery item');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteGalleryItem(deleteTarget._id);
      success('Gallery item deleted');
      setDeleteTarget(null);
      fetchGallery();
    } catch (err) {
      error('Failed to delete gallery item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-showroom-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            PORTFOLIO SHOWCASE
          </span>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
            SPACES & GALLERY ({gallery.length})
          </h1>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4 text-showroom-bronze" />
          <span>Upload Space Photo</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-showroom-border overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] bg-showroom-ivory overflow-hidden">
              <img src={item.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-showroom-charcoal text-white text-[9px] font-bold uppercase px-2 py-0.5">
                {item.category}
              </div>
            </div>

            <div className="p-4 space-y-1">
              <h3 className="font-serif text-sm font-bold uppercase text-showroom-charcoal line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-showroom-muted font-mono truncate">
                {item.locationOrSpace || 'Showroom Architectural'}
              </p>
            </div>

            <div className="p-3 bg-showroom-sand/20 border-t border-showroom-sand/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-showroom-muted">
                Order: {item.displayOrder}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(item)}
                  className="p-1 text-showroom-muted hover:text-showroom-charcoal"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-showroom-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-showroom-border">
              <h3 className="font-serif text-lg font-bold uppercase text-showroom-charcoal">
                {editingItem ? 'Edit Space Photo' : 'Upload Space Photo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-showroom-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                  Title / Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Minimalist Villa Living with Statuario Slab"
                  className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Category Tag
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                  >
                    <option value="Tiles">Tiles</option>
                    <option value="Granite">Granite</option>
                    <option value="Wood">Wood</option>
                    <option value="Interior">Interior</option>
                    <option value="Showroom">Showroom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Location / Space Reference
                  </label>
                  <input
                    type="text"
                    value={locationOrSpace}
                    onChange={(e) => setLocationOrSpace(e.target.value)}
                    placeholder="e.g. Indiranagar, Bengaluru"
                    className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                  />
                </div>
              </div>

              <ImageUploader
                images={images}
                onChange={setImages}
                maxImages={1}
                label="Space Photography"
              />

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
                  <span>Save Space</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Space Photo"
        message={`Delete "${deleteTarget?.title}"?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
