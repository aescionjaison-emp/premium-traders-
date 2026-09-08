import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { ICategory } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/admin/ConfirmModal.js';
import { MediaUploader } from '../../components/admin/MediaUploader.js';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<ICategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ICategory | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [textureImages, setTextureImages] = useState<string[]>([]);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [visible, setVisible] = useState(true);

  const { success, error } = useToast();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCategories();
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setName('');
    setSubtitle('');
    setDescription('');
    setImages([]);
    setTextureImages([]);
    setDisplayOrder(categories.length + 1);
    setVisible(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: ICategory) => {
    setEditingCat(cat);
    setName(cat.name);
    setSubtitle(cat.subtitle || '');
    setDescription(cat.description || '');
    setImages(cat.image ? [cat.image] : []);
    setTextureImages(cat.textureImage ? [cat.textureImage] : []);
    setDisplayOrder(cat.displayOrder || 0);
    setVisible(cat.visible);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Category name is required');
      return;
    }

    const payload = {
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim(),
      image: images[0] || '',
      textureImage: textureImages[0] || '',
      displayOrder: Number(displayOrder) || 0,
      visible,
    };

    try {
      if (editingCat) {
        const res = await api.updateCategory(editingCat._id, payload);
        if (res.data.success) {
          success('Category updated successfully');
        }
      } else {
        const res = await api.createCategory(payload);
        if (res.data.success) {
          success('Category created successfully');
        }
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.deleteCategory(deleteTarget._id);
      if (res.data.success) {
        success('Category deleted successfully');
        setDeleteTarget(null);
        fetchCategories();
      }
    } catch (err) {
      error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-showroom-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            STRUCTURE & DISCIPLINES
          </span>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
            CATEGORIES ({categories.length})
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4 text-showroom-bronze" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-showroom-border overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-showroom-sand/30 border-b border-showroom-border text-[10px] font-bold uppercase tracking-widest text-showroom-muted">
              <th className="p-3.5">Image</th>
              <th className="p-3.5">Category Name</th>
              <th className="p-3.5">Slug</th>
              <th className="p-3.5">Order</th>
              <th className="p-3.5 text-center">Visibility</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-showroom-sand/60">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-showroom-muted">
                  Loading categories...
                </td>
              </tr>
            ) : categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-showroom-sand/10 transition-colors">
                <td className="p-3 w-16">
                  <div className="w-12 h-12 bg-showroom-ivory border border-showroom-border overflow-hidden">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=200&q=85'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-3 font-bold uppercase text-showroom-charcoal">
                  {cat.name}
                  {cat.description && (
                    <p className="text-[11px] font-normal text-showroom-muted line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </td>
                <td className="p-3 font-mono text-[11px] text-showroom-muted">
                  {cat.slug}
                </td>
                <td className="p-3 font-mono font-bold text-showroom-charcoal">
                  {cat.displayOrder}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase ${
                      cat.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.visible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-showroom-muted hover:text-showroom-charcoal"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1.5 text-red-600 hover:text-red-800"
                      title="Delete Category"
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

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-showroom-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-showroom-border">
              <h3 className="font-serif text-lg font-bold uppercase text-showroom-charcoal">
                {editingCat ? `Edit Category: ${editingCat.name}` : 'New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-showroom-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. GRANITE"
                    className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                    Short Subtitle (Main Page)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Natural Stone / Modern Surfaces"
                    className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of materials in this discipline..."
                  className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MediaUploader
                  media={images}
                  onChange={setImages}
                  maxFiles={1}
                  acceptType="image"
                  label="Cover Image (Drag & Drop)"
                />

                <MediaUploader
                  media={textureImages}
                  onChange={setTextureImages}
                  maxFiles={1}
                  acceptType="image"
                  label="Texture / Close-up (Drag & Drop)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase text-showroom-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={(e) => setVisible(e.target.checked)}
                      className="w-4 h-4 accent-showroom-bronze"
                    />
                    <span>Visible in Menu</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-showroom-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-showroom-border text-xs font-bold uppercase text-showroom-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-showroom-bronze" />
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${deleteTarget?.name}"? Associated products may become uncategorized.`}
        confirmText="Delete Category"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
