import {
  IProduct,
  ICategory,
  ICollection,
  IBrand,
  IGalleryItem,
  IHomepageConfig,
  INavigation,
  ISiteSettings,
  IEnquiry,
  IMediaItem,
} from '../types/index.js';
import {
  MASTER_SHOWROOM_PRODUCTS,
  DEFAULT_CATEGORIES,
  DEFAULT_COLLECTIONS,
  DEFAULT_BRANDS,
} from '../data/showroomCatalogData.js';

// Keys
const K_PRODUCTS = 'showroom_products_db';
const K_CATEGORIES = 'showroom_categories_db';
const K_COLLECTIONS = 'showroom_collections_db';
const K_BRANDS = 'showroom_brands_db';
const K_HOMEPAGE = 'showroom_homepage_db';
const K_SETTINGS = 'showroom_settings_db';
const K_NAVIGATION = 'showroom_navigation_db';
const K_ENQUIRIES = 'showroom_enquiries_db';

export const localStore = {
  // --- Products ---
  getProducts: (params?: Record<string, any>): { data: IProduct[]; pagination: any } => {
    let prods: IProduct[] = [];
    const saved = localStorage.getItem(K_PRODUCTS);
    if (saved) {
      try {
        prods = JSON.parse(saved);
      } catch {
        prods = [...MASTER_SHOWROOM_PRODUCTS];
      }
    } else {
      prods = [...MASTER_SHOWROOM_PRODUCTS];
      localStorage.setItem(K_PRODUCTS, JSON.stringify(prods));
    }

    if (params?.category) {
      prods = prods.filter(
        (p) =>
          p.categorySlug === params.category ||
          (typeof p.category === 'object' && (p.category?._id === params.category || p.category?.slug === params.category)) ||
          p.category === params.category
      );
    }
    if (params?.categorySlug) {
      prods = prods.filter(
        (p) =>
          p.categorySlug === params.categorySlug ||
          (typeof p.category === 'object' && p.category?.slug === params.categorySlug)
      );
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      prods = prods.filter((p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }

    return { data: prods, pagination: { total: prods.length, page: 1, limit: params?.limit || 100 } };
  },

  getProductBySlug: (slug: string): IProduct | null => {
    const { data } = localStore.getProducts();
    return (
      data.find(
        (p) =>
          p.slug === slug ||
          p.sku?.toLowerCase() === slug.toLowerCase() ||
          p.name.toLowerCase() === slug.replace(/-/g, ' ').toLowerCase()
      ) || null
    );
  },

  saveProduct: (prod: Partial<IProduct>): IProduct => {
    const { data } = localStore.getProducts();
    const id = prod._id || `prod-custom-${Date.now()}`;
    const slug = prod.slug || (prod.name ? prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);
    const newProd: IProduct = {
      _id: id,
      name: prod.name || 'New Material',
      slug,
      category: prod.category || 'cat-tiles',
      categorySlug: prod.categorySlug || 'tiles',
      material: prod.material || '',
      finish: prod.finish || '',
      surface: prod.surface || '',
      color: prod.color || '',
      size: prod.size || '',
      bodyType: prod.bodyType || '',
      sku: prod.sku || `SKU-${Date.now().toString().slice(-4)}`,
      description: prod.description || '',
      specifications: prod.specifications || [],
      images: prod.images && prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85'],
      featured: prod.featured ?? true,
      visible: prod.visible ?? true,
      newArrival: prod.newArrival ?? false,
      popular: prod.popular ?? false,
      available: prod.available ?? true,
      displayOrder: prod.displayOrder || data.length + 1,
      ...prod,
      applications: prod.applications && prod.applications.length > 0 ? prod.applications : [],
    };

    const existingIdx = data.findIndex((p) => p._id === id);
    if (existingIdx >= 0) {
      data[existingIdx] = newProd;
    } else {
      data.unshift(newProd);
    }
    localStorage.setItem(K_PRODUCTS, JSON.stringify(data));
    return newProd;
  },

  deleteProduct: (id: string) => {
    const { data } = localStore.getProducts();
    const filtered = data.filter((p) => p._id !== id);
    localStorage.setItem(K_PRODUCTS, JSON.stringify(filtered));
  },

  // --- Categories ---
  getCategories: (): ICategory[] => {
    const saved = localStorage.getItem(K_CATEGORIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_CATEGORIES;
      }
    }
    localStorage.setItem(K_CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  },

  saveCategory: (cat: Partial<ICategory>): ICategory => {
    const cats = localStore.getCategories();
    const id = cat._id || `cat-${Date.now()}`;
    const slug = cat.slug || (cat.name ? cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);
    const newCat: ICategory = {
      _id: id,
      name: cat.name || 'Category',
      slug,
      description: cat.description || '',
      image: cat.image || 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85',
      featured: cat.featured ?? true,
      visible: cat.visible ?? true,
      displayOrder: cat.displayOrder || cats.length + 1,
      ...cat,
    };
    const idx = cats.findIndex((c) => c._id === id);
    if (idx >= 0) cats[idx] = newCat;
    else cats.push(newCat);
    localStorage.setItem(K_CATEGORIES, JSON.stringify(cats));
    return newCat;
  },

  deleteCategory: (id: string) => {
    const cats = localStore.getCategories().filter((c) => c._id !== id);
    localStorage.setItem(K_CATEGORIES, JSON.stringify(cats));
  },

  // --- Collections ---
  getCollections: (): ICollection[] => {
    const saved = localStorage.getItem(K_COLLECTIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_COLLECTIONS;
      }
    }
    localStorage.setItem(K_COLLECTIONS, JSON.stringify(DEFAULT_COLLECTIONS));
    return DEFAULT_COLLECTIONS;
  },

  saveCollection: (col: Partial<ICollection>): ICollection => {
    const cols = localStore.getCollections();
    const id = col._id || `col-${Date.now()}`;
    const slug = col.slug || (col.name ? col.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);
    const newCol: ICollection = {
      _id: id,
      name: col.name || 'Collection',
      slug,
      categorySlug: col.categorySlug || 'tiles',
      description: col.description || '',
      image: col.image || 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85',
      featured: col.featured ?? true,
      visible: col.visible ?? true,
      displayOrder: col.displayOrder || cols.length + 1,
      ...col,
    };
    const idx = cols.findIndex((c) => c._id === id);
    if (idx >= 0) cols[idx] = newCol;
    else cols.push(newCol);
    localStorage.setItem(K_COLLECTIONS, JSON.stringify(cols));
    return newCol;
  },

  deleteCollection: (id: string) => {
    const cols = localStore.getCollections().filter((c) => c._id !== id);
    localStorage.setItem(K_COLLECTIONS, JSON.stringify(cols));
  },

  // --- Brands ---
  getBrands: (): IBrand[] => {
    const saved = localStorage.getItem(K_BRANDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_BRANDS;
      }
    }
    localStorage.setItem(K_BRANDS, JSON.stringify(DEFAULT_BRANDS));
    return DEFAULT_BRANDS;
  },

  saveBrand: (b: Partial<IBrand>): IBrand => {
    const brands = localStore.getBrands();
    const id = b._id || `brand-${Date.now()}`;
    const slug = b.slug || (b.name ? b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);
    const newBrand: IBrand = {
      _id: id,
      name: b.name || 'Brand',
      slug,
      categorySlug: b.categorySlug || 'tiles',
      logo: b.logo || '',
      featured: b.featured ?? true,
      visible: b.visible ?? true,
      displayOrder: b.displayOrder || brands.length + 1,
      ...b,
    };
    const idx = brands.findIndex((item) => item._id === id);
    if (idx >= 0) brands[idx] = newBrand;
    else brands.push(newBrand);
    localStorage.setItem(K_BRANDS, JSON.stringify(brands));
    return newBrand;
  },

  deleteBrand: (id: string) => {
    const brands = localStore.getBrands().filter((b) => b._id !== id);
    localStorage.setItem(K_BRANDS, JSON.stringify(brands));
  },

  // --- Homepage Config ---
  getHomepageConfig: (): IHomepageConfig | null => {
    const saved = localStorage.getItem(K_HOMEPAGE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  saveHomepageConfig: (cfg: Partial<IHomepageConfig>): IHomepageConfig => {
    const current = localStore.getHomepageConfig() || {};
    const updated = { ...current, ...cfg } as IHomepageConfig;
    localStorage.setItem(K_HOMEPAGE, JSON.stringify(updated));
    return updated;
  },

  // --- Settings ---
  getSettings: (): ISiteSettings | null => {
    const saved = localStorage.getItem(K_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  saveSettings: (settings: Partial<ISiteSettings>): ISiteSettings => {
    const current = localStore.getSettings() || {};
    const updated = { ...current, ...settings } as ISiteSettings;
    localStorage.setItem(K_SETTINGS, JSON.stringify(updated));
    return updated;
  },

  // --- Navigation ---
  getNavigation: (): INavigation | null => {
    const saved = localStorage.getItem(K_NAVIGATION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  saveNavigation: (items: any[]): INavigation => {
    const nav: INavigation = { items };
    localStorage.setItem(K_NAVIGATION, JSON.stringify(nav));
    return nav;
  },

  // --- Enquiries ---
  getEnquiries: (): IEnquiry[] => {
    const saved = localStorage.getItem(K_ENQUIRIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  },

  addEnquiry: (enq: Partial<IEnquiry>): IEnquiry => {
    const list = localStore.getEnquiries();
    const newEnq: IEnquiry = {
      _id: `enq-${Date.now()}`,
      name: enq.name || 'Anonymous Client',
      phone: enq.phone || '',
      email: enq.email || '',
      productName: enq.productName || '',
      productSku: enq.productSku || '',
      category: enq.category || '',
      projectType: enq.projectType || 'Residential',
      quantity: enq.quantity || '',
      message: enq.message || '',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...enq,
    };
    list.unshift(newEnq);
    localStorage.setItem(K_ENQUIRIES, JSON.stringify(list));
    return newEnq;
  },

  updateEnquiryStatus: (id: string, status: string, notes?: string): IEnquiry | null => {
    const list = localStore.getEnquiries();
    const item = list.find((e) => e._id === id);
    if (item) {
      item.status = status as any;
      if (notes) item.notes = notes;
      item.updatedAt = new Date().toISOString();
      localStorage.setItem(K_ENQUIRIES, JSON.stringify(list));
      return item;
    }
    return null;
  },

  deleteEnquiry: (id: string) => {
    const list = localStore.getEnquiries().filter((e) => e._id !== id);
    localStorage.setItem(K_ENQUIRIES, JSON.stringify(list));
  },
};
