import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Layers } from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { ICategory, ICollection, IBrand, IProductSpecification } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';
import { MediaUploader } from '../../components/admin/MediaUploader.js';

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('Architectural Heritage');
  const [collectionName, setCollectionName] = useState('');
  const [material, setMaterial] = useState('Glazed Vitrified Porcelain');
  const [finish, setFinish] = useState('Mirror Polished');
  const [surface, setSurface] = useState('Floor & Wall');
  const [color, setColor] = useState('Warm Ivory');
  const [size, setSize] = useState('600x1200 mm');
  const [bodyType, setBodyType] = useState('9mm Vitrified Body');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [applicationsInput, setApplicationsInput] = useState('Living Rooms, Grand Lobbies, Master Bathrooms');
  const [specifications, setSpecifications] = useState<IProductSpecification[]>([
    { key: 'Thickness', value: '9 mm' },
    { key: 'Water Absorption', value: '< 0.05%' },
    { key: 'Surface Hardness', value: 'MOHS 7' },
  ]);
  const [images, setImages] = useState<string[]>([]);
  const [installationImages, setInstallationImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [popular, setPopular] = useState(false);
  const [available, setAvailable] = useState(true);
  const [visible, setVisible] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  const { success, error } = useToast();
  const navigate = useNavigate();

  // Helper to auto-shorten name to max 2 words
  const handleAutoShorten = () => {
    if (!name.trim()) return;
    const cleaned = name
      .replace(/^premium\s+/i, '')
      .replace(/^exotic\s+/i, '')
      .replace(/^luxury\s+/i, '')
      .replace(/^natural\s+/i, '')
      .replace(/^solid\s+/i, '')
      .replace(/^traditional\s+/i, '')
      .replace(/^\d+x\d+\s*(mm)?\s*/i, '')
      .replace(/^\d+mm\s*/i, '')
      .trim();
    const words = cleaned.split(/\s+/).filter(Boolean);
    const suggested = words.slice(0, 2).join(' ');
    setShortName(suggested);
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catsRes, colsRes, brandsRes] = await Promise.all([
          api.getCategories(),
          api.getCollections(),
          api.getBrands(),
        ]);
        if (catsRes.data.success) {
          setCategories(catsRes.data.data);
          if (!category && catsRes.data.data.length > 0) {
            setCategory(catsRes.data.data[0]._id);
          }
        }
        if (colsRes.data.success) setCollections(colsRes.data.data);
        if (brandsRes.data.success) setBrands(brandsRes.data.data);

        // If editing existing product, load details
        if (isEditMode && id) {
          setIsLoading(true);
          const prodRes = await api.getProducts({ admin: 'true' });
          if (prodRes.data.success) {
            const current = prodRes.data.data.find((p) => p._id === id);
            if (current) {
              setName(current.name);
              setShortName(current.shortName || current.displayName || '');
              setVideoUrl(current.videoUrl || '');
              setPrice(current.price !== undefined ? current.price : '');
              setSlug(current.slug);
              setCategory(typeof current.category === 'object' ? current.category._id : current.category);
              setSubcategory(current.subcategory || '');
              setBrand(current.brand || 'Architectural Heritage');
              setCollectionName(current.collectionName || '');
              setMaterial(current.material);
              setFinish(current.finish);
              setSurface(current.surface || 'Floor & Wall');
              setColor(current.color);
              setSize(current.size);
              setBodyType(current.bodyType || '');
              setSku(current.sku);
              setDescription(current.description || '');
              setApplicationsInput(current.applications ? current.applications.join(', ') : '');
              setSpecifications(current.specifications || []);
              setImages(current.images || []);
              setInstallationImages(current.installationImages || []);
              setFeatured(current.featured);
              setNewArrival(current.newArrival);
              setPopular(current.popular);
              setAvailable(current.available);
              setVisible(current.visible);
              setDisplayOrder(current.displayOrder || 0);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [id, isEditMode]);

  const handleAddSpec = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecifications(specifications.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) => {
    const updated = [...specifications];
    updated[idx][field] = val;
    setSpecifications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category || !sku.trim()) {
      error('Product Name, Category, and SKU are required');
      return;
    }

    // Validate 2 words maximum on shortName if provided
    if (shortName.trim()) {
      const words = shortName.trim().split(/\s+/).filter(Boolean);
      if (words.length > 2) {
        error('Short Display Name must contain a MAXIMUM OF 2 WORDS (e.g. "Black Galaxy")');
        return;
      }
    }

    setIsSaving(true);
    const parsedApps = applicationsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      shortName: shortName.trim() || undefined,
      displayName: shortName.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      price: price !== '' ? Number(price) : undefined,
      slug: slug.trim() || undefined,
      category,
      subcategory: subcategory.trim(),
      brand: brand.trim(),
      collectionName: collectionName.trim(),
      material: material.trim(),
      finish: finish.trim(),
      surface: surface.trim(),
      color: color.trim(),
      size: size.trim(),
      bodyType: bodyType.trim(),
      sku: sku.trim(),
      description: description.trim(),
      applications: parsedApps,
      specifications: specifications.filter((s) => s.key && s.value),
      images,
      installationImages,
      featured,
      newArrival,
      popular,
      available,
      visible,
      displayOrder: Number(displayOrder) || 0,
    };

    try {
      if (isEditMode && id) {
        const res = await api.updateProduct(id, payload);
        if (res.data.success) {
          success('Product updated successfully');
          navigate('/admin/products');
        }
      } else {
        const res = await api.createProduct(payload);
        if (res.data.success) {
          success('Product created successfully');
          navigate('/admin/products');
        }
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs uppercase font-bold tracking-widest text-showroom-muted">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-showroom-border">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 bg-white border border-showroom-border hover:bg-showroom-sand/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block">
              {isEditMode ? 'EDIT PRODUCT' : 'NEW PRODUCT CREATION'}
            </span>
            <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
              {isEditMode ? `Edit: ${name}` : 'Catalog New Architectural Material'}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-showroom-bronze" />
          <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Attributes Card */}
        <div className="bg-white p-6 border border-showroom-border space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal pb-2 border-b border-showroom-sand/60 flex items-center justify-between">
            <span>1. Core Architectural Identification</span>
            <span className="text-[10px] text-showroom-muted font-normal">
              Main page displays maximum 2-word short name
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Full Catalog Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Exotic Calacatta Oro Supremo 20mm Sintered Slab"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                SKU / Material Code *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. TIL-CAL-2400"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Short Display Name (Max 2 Words for Homepage) */}
          <div className="p-3.5 bg-showroom-sand/25 border border-showroom-border rounded-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-bronze">
                Main Page Short Display Name (MAXIMUM 2 WORDS)
              </label>
              <button
                type="button"
                onClick={handleAutoShorten}
                className="text-[10px] font-bold uppercase tracking-wider text-showroom-charcoal hover:text-showroom-bronze hover:underline"
              >
                ✨ Auto-Suggest 2-Word Name
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. Calacatta Gold (Max 2 words)"
                className="flex-1 bg-white border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none font-bold"
              />
              {shortName && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-showroom-charcoal text-white text-[10px] font-mono font-bold uppercase rounded-sm shrink-0">
                  <span>Preview:</span>
                  <span className="text-showroom-gold">{shortName}</span>
                </div>
              )}
            </div>
            <p className="text-[10px] text-showroom-muted mt-1">
              This short 2-word title will be prioritized in the homepage carousel, chapters, and visual cards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Category *
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Subcategory
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Large Format Porcelain / Pivot Door"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Varmora / Kajaria / Legrand"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Surface Finish *
              </label>
              <input
                type="text"
                required
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                placeholder="e.g. Mirror Polished / Satin Matte / Leathered"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Dimensions / Size *
              </label>
              <input
                type="text"
                required
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 1200x2400 mm / 8x4 ft"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Material Spec *
              </label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Sintered Porcelain / Solid Teak"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Color Tone
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Warm White & Gold / Pitch Black"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Master Collection Name (Optional)
              </label>
              <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="e.g. CALACATTA & STATUARIO GRANDE"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Body Type / Sintering Grade
              </label>
              <input
                type="text"
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                placeholder="e.g. 9mm Compact Porcelain / BWP Marine Grade"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
                Indicative Price (₹ / Sq.ft or Piece)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 450"
                className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Media & Video Upload Card */}
        <div className="bg-white p-6 border border-showroom-border space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal pb-2 border-b border-showroom-sand/60">
            2. High-Res Visuals & Showcase Video (Drag & Drop)
          </h2>

          {/* Main Gallery (Images & Videos) */}
          <MediaUploader
            media={images}
            onChange={setImages}
            maxFiles={10}
            label="Product Photography, Slab Visuals & Video Clips"
            hint="Drag & drop high-res photography (.jpg, .png, .webp) or short loop videos (.mp4, .webm)"
          />

          {/* Installation Room Images */}
          <div className="pt-4 border-t border-showroom-sand/60">
            <MediaUploader
              media={installationImages}
              onChange={setInstallationImages}
              maxFiles={4}
              label="Installed Room / Application Photography"
              hint="Real interior architectural photos showing this material applied in finished spaces"
            />
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="bg-white p-6 border border-showroom-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-showroom-sand/60">
            <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal">
              3. Architectural Technical Specifications
            </h2>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-[10px] uppercase font-bold text-showroom-bronze hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Specification Field</span>
            </button>
          </div>

          <div className="space-y-3">
            {specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Parameter (e.g. Thickness, Water Absorption, MOHS Hardness)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="flex-1 bg-showroom-bg border border-showroom-border px-3 py-1.5 text-xs text-showroom-charcoal focus:outline-none font-medium"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 9 mm, < 0.05%, Grade 7)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="flex-1 bg-showroom-bg border border-showroom-border px-3 py-1.5 text-xs text-showroom-charcoal focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="p-1.5 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-charcoal mb-1">
              Applications (Comma Separated)
            </label>
            <input
              type="text"
              value={applicationsInput}
              onChange={(e) => setApplicationsInput(e.target.value)}
              placeholder="e.g. Living Rooms, Grand Lobbies, Master Bathrooms, Countertops"
              className="w-full bg-showroom-bg border border-showroom-border px-3 py-2 text-xs text-showroom-charcoal focus:outline-none"
            />
          </div>
        </div>

        {/* Display Toggles */}
        <div className="bg-white p-6 border border-showroom-border">
          <h2 className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal pb-3 mb-4 border-b border-showroom-sand/60">
            4. Catalog Visibility & Placement
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 text-xs font-bold uppercase text-showroom-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="w-4 h-4 accent-showroom-bronze"
              />
              <span>Visible on Catalog</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold uppercase text-showroom-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-showroom-bronze"
              />
              <span>Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold uppercase text-showroom-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
                className="w-4 h-4 accent-showroom-bronze"
              />
              <span>New Arrival Tag</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold uppercase text-showroom-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="w-4 h-4 accent-showroom-bronze"
              />
              <span>Available in Stock</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 border border-showroom-border text-showroom-charcoal text-xs font-bold uppercase tracking-wider hover:bg-showroom-sand/50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-showroom-bronze" />
            <span>{isSaving ? 'Saving Material...' : 'Save Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
