import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Star,
  Eye,
  EyeOff,
  Copy,
  Edit2,
  Trash2,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { IProduct, ICategory } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/admin/ConfirmModal.js';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<IProduct | null>(null);

  const { success, error } = useToast();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params: any = { limit: 150, admin: 'true' };
      if (search.trim()) params.search = search.trim();
      if (selectedCat) params.category = selectedCat;

      const [prodsRes, catsRes] = await Promise.all([
        api.getProducts(params),
        api.getCategories(),
      ]);

      if (prodsRes.data.success) setProducts(prodsRes.data.data);
      if (catsRes.data.success) setCategories(catsRes.data.data);
    } catch (err) {
      error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCat]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleToggleFeature = async (product: IProduct) => {
    try {
      const res = await api.toggleProductFeature(product._id);
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, featured: !p.featured } : p))
        );
        success(res.data.message);
      }
    } catch (err) {
      error('Failed to toggle featured status');
    }
  };

  const handleToggleVisibility = async (product: IProduct) => {
    try {
      const res = await api.toggleProductVisibility(product._id);
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, visible: !p.visible } : p))
        );
        success(res.data.message);
      }
    } catch (err) {
      error('Failed to toggle visibility');
    }
  };

  const handleDuplicate = async (product: IProduct) => {
    try {
      const res = await api.duplicateProduct(product._id);
      if (res.data.success) {
        success('Product duplicated successfully');
        fetchProducts();
      }
    } catch (err) {
      error('Failed to duplicate product');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.deleteProduct(deleteTarget._id);
      if (res.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        success('Product deleted successfully');
        setDeleteTarget(null);
      }
    } catch (err) {
      error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-showroom-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
            CATALOG MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
            PRODUCTS ({products.length})
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="px-4 py-2.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-showroom-bronze" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 border border-showroom-border flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by SKU, Product Name, Material, Finish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-showroom-bg border border-showroom-border pl-9 pr-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
            />
            <Search className="w-4 h-4 text-showroom-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-showroom-sand/60 hover:bg-showroom-sand text-showroom-charcoal text-xs font-bold uppercase tracking-wider"
          >
            Search
          </button>
        </form>

        {/* Category Dropdown */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <Filter className="w-4 h-4 text-showroom-muted shrink-0" />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full md:w-56 bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-showroom-border overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-showroom-sand/30 border-b border-showroom-border text-[10px] font-bold uppercase tracking-widest text-showroom-muted">
              <th className="p-3.5">Image</th>
              <th className="p-3.5">Product Name & SKU</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Finish & Size</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-center">Featured</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-showroom-sand/60">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-showroom-muted">
                  Loading catalog inventory...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((p) => {
                const categoryLabel =
                  typeof p.category === 'object' ? p.category.name : 'Category';
                return (
                  <tr key={p._id} className="hover:bg-showroom-sand/10 transition-colors">
                    {/* Image */}
                    <td className="p-3 w-16">
                      <div className="w-12 h-12 bg-showroom-ivory border border-showroom-border overflow-hidden">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=200&q=85'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Name, Short Name & SKU */}
                    <td className="p-3 min-w-[220px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase text-showroom-charcoal block line-clamp-1">
                          {p.name}
                        </span>
                        {(p.shortName || p.displayName) && (
                          <span className="px-1.5 py-0.5 bg-showroom-sand text-showroom-charcoal text-[9px] font-mono font-bold uppercase rounded-sm shrink-0 border border-showroom-border">
                            {p.shortName || p.displayName}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-showroom-muted">
                        SKU: {p.sku}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="p-3 text-showroom-charcoal font-medium">
                      {categoryLabel}
                    </td>

                    {/* Finish & Size */}
                    <td className="p-3 text-showroom-charcoal">
                      <span className="block font-bold">{p.finish}</span>
                      <span className="text-[10px] text-showroom-muted font-mono">{p.size}</span>
                    </td>

                    {/* Visibility */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleVisibility(p)}
                        className={`p-1.5 rounded transition-colors ${
                          p.visible
                            ? 'text-green-800 bg-green-50 hover:bg-green-100'
                            : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                        }`}
                        title={p.visible ? 'Visible on catalog (Click to hide)' : 'Hidden (Click to show)'}
                      >
                        {p.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleFeature(p)}
                        className={`p-1.5 rounded transition-colors ${
                          p.featured
                            ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                            : 'text-gray-300 hover:text-amber-500'
                        }`}
                        title={p.featured ? 'Featured on Homepage' : 'Not Featured'}
                      >
                        <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-showroom-muted hover:text-showroom-charcoal"
                          title="View live in showroom"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 text-showroom-muted hover:text-showroom-charcoal"
                          title="Duplicate product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          className="p-1.5 text-showroom-muted hover:text-showroom-charcoal"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 text-red-600 hover:text-red-800"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-showroom-muted">
                  No products found. Click "Add New Product" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Architectural Product"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Permanently"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
