import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig.js';
import { localStore } from './localStore.js';
import {
  IProduct,
  ICategory,
  ICollection,
  IBrand,
  IHomepageConfig,
  ISiteSettings,
} from '../types/index.js';
import { DEFAULT_HOMEPAGE_CONFIG } from '../data/showroomCatalogData.js';

// Cloud Document Collections in Firestore
const DOC_PRODUCTS = 'showroom_products';
const DOC_HOMEPAGE = 'showroom_homepage';
const DOC_CATEGORIES = 'showroom_categories';
const DOC_COLLECTIONS = 'showroom_collections';
const DOC_BRANDS = 'showroom_brands';
const DOC_SETTINGS = 'showroom_settings';
const DOC_NAVIGATION = 'showroom_navigation';
const DOC_GALLERY = 'showroom_gallery';
const DOC_MEDIA = 'showroom_media';

export const cloudStore = {
  // Sync all local modifications up to Firestore Cloud Database
  syncLocalToCloud: async (): Promise<boolean> => {
    try {
      const prods = localStore.getProducts().data;
      const homepage = localStore.getHomepageConfig() || DEFAULT_HOMEPAGE_CONFIG;
      const categories = localStore.getCategories();
      const collections = localStore.getCollections();
      const brands = localStore.getBrands();
      const settings = localStore.getSettings();
      const navigation = localStore.getNavigation();
      const gallery = localStore.getGallery();
      const media = localStore.getMedia();

      await Promise.all([
        setDoc(doc(db, 'cms', DOC_PRODUCTS), { items: prods, updatedAt: new Date().toISOString() }),
        setDoc(doc(db, 'cms', DOC_HOMEPAGE), { config: homepage, updatedAt: new Date().toISOString() }),
        setDoc(doc(db, 'cms', DOC_CATEGORIES), { items: categories, updatedAt: new Date().toISOString() }),
        setDoc(doc(db, 'cms', DOC_COLLECTIONS), { items: collections, updatedAt: new Date().toISOString() }),
        setDoc(doc(db, 'cms', DOC_BRANDS), { items: brands, updatedAt: new Date().toISOString() }),
        setDoc(doc(db, 'cms', DOC_GALLERY), { items: gallery, updatedAt: new Date().toISOString() }),
        setDoc(doc(db, 'cms', DOC_MEDIA), { items: media, updatedAt: new Date().toISOString() }),
        settings ? setDoc(doc(db, 'cms', DOC_SETTINGS), { settings, updatedAt: new Date().toISOString() }) : Promise.resolve(),
        navigation ? setDoc(doc(db, 'cms', DOC_NAVIGATION), { navigation, updatedAt: new Date().toISOString() }) : Promise.resolve(),
      ]);

      return true;
    } catch (err) {
      console.warn('Could not sync to cloud Firestore:', err);
      return false;
    }
  },

  // Pull latest cloud state down to local storage
  pullCloudToLocal: async (): Promise<boolean> => {
    try {
      const [prodsSnap, homeSnap, catsSnap, colsSnap, brandsSnap, setSnap, navSnap] = await Promise.all([
        getDoc(doc(db, 'cms', DOC_PRODUCTS)).catch(() => null),
        getDoc(doc(db, 'cms', DOC_HOMEPAGE)).catch(() => null),
        getDoc(doc(db, 'cms', DOC_CATEGORIES)).catch(() => null),
        getDoc(doc(db, 'cms', DOC_COLLECTIONS)).catch(() => null),
        getDoc(doc(db, 'cms', DOC_BRANDS)).catch(() => null),
        getDoc(doc(db, 'cms', DOC_SETTINGS)).catch(() => null),
        getDoc(doc(db, 'cms', DOC_NAVIGATION)).catch(() => null),
      ]);

      let updatedAny = false;

      if (prodsSnap && prodsSnap.exists() && prodsSnap.data()?.items) {
        localStorage.setItem('showroom_products_db', JSON.stringify(prodsSnap.data().items));
        updatedAny = true;
      }
      if (homeSnap && homeSnap.exists() && homeSnap.data()?.config) {
        localStorage.setItem('showroom_homepage_db', JSON.stringify(homeSnap.data().config));
        updatedAny = true;
      }
      if (catsSnap && catsSnap.exists() && catsSnap.data()?.items) {
        localStorage.setItem('showroom_categories_db', JSON.stringify(catsSnap.data().items));
        updatedAny = true;
      }
      if (colsSnap && colsSnap.exists() && colsSnap.data()?.items) {
        localStorage.setItem('showroom_collections_db', JSON.stringify(colsSnap.data().items));
        updatedAny = true;
      }
      if (brandsSnap && brandsSnap.exists() && brandsSnap.data()?.items) {
        localStorage.setItem('showroom_brands_db', JSON.stringify(brandsSnap.data().items));
        updatedAny = true;
      }
      if (setSnap && setSnap.exists() && setSnap.data()?.settings) {
        localStorage.setItem('showroom_settings_db', JSON.stringify(setSnap.data().settings));
        updatedAny = true;
      }
      if (navSnap && navSnap.exists() && navSnap.data()?.navigation) {
        localStorage.setItem('showroom_navigation_db', JSON.stringify(navSnap.data().navigation));
        updatedAny = true;
      }

      return updatedAny;
    } catch (err) {
      console.warn('Could not pull from cloud Firestore:', err);
      return false;
    }
  },

  // Save single entity to cloud in background
  saveHomepageConfig: async (cfg: Partial<IHomepageConfig>) => {
    try {
      const full = localStore.saveHomepageConfig(cfg);
      await setDoc(doc(db, 'cms', DOC_HOMEPAGE), { config: full, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Firestore homepage write error:', err);
    }
  },

  saveProduct: async (prod: Partial<IProduct>) => {
    try {
      const saved = localStore.saveProduct(prod);
      const prods = localStore.getProducts().data;
      await setDoc(doc(db, 'cms', DOC_PRODUCTS), { items: prods, updatedAt: new Date().toISOString() });
      return saved;
    } catch (err) {
      console.warn('Firestore product write error:', err);
    }
  },

  deleteProduct: async (id: string) => {
    try {
      localStore.deleteProduct(id);
      const prods = localStore.getProducts().data;
      await setDoc(doc(db, 'cms', DOC_PRODUCTS), { items: prods, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Firestore product delete error:', err);
    }
  },

  saveCategory: async (cat: Partial<ICategory>) => {
    try {
      const saved = localStore.saveCategory(cat);
      const cats = localStore.getCategories();
      await setDoc(doc(db, 'cms', DOC_CATEGORIES), { items: cats, updatedAt: new Date().toISOString() });
      return saved;
    } catch (err) {
      console.warn('Firestore category write error:', err);
    }
  },

  saveCollection: async (col: Partial<ICollection>) => {
    try {
      const saved = localStore.saveCollection(col);
      const cols = localStore.getCollections();
      await setDoc(doc(db, 'cms', DOC_COLLECTIONS), { items: cols, updatedAt: new Date().toISOString() });
      return saved;
    } catch (err) {
      console.warn('Firestore collection write error:', err);
    }
  },

  saveBrand: async (brand: Partial<IBrand>) => {
    try {
      const saved = localStore.saveBrand(brand);
      const brands = localStore.getBrands();
      await setDoc(doc(db, 'cms', DOC_BRANDS), { items: brands, updatedAt: new Date().toISOString() });
      return saved;
    } catch (err) {
      console.warn('Firestore brand write error:', err);
    }
  },

  saveSettings: async (settings: Partial<ISiteSettings>) => {
    try {
      const saved = localStore.saveSettings(settings);
      await setDoc(doc(db, 'cms', DOC_SETTINGS), { settings: saved, updatedAt: new Date().toISOString() });
      return saved;
    } catch (err) {
      console.warn('Firestore settings write error:', err);
    }
  },

  saveNavigation: async (items: any[]) => {
    try {
      const saved = localStore.saveNavigation(items);
      await setDoc(doc(db, 'cms', DOC_NAVIGATION), { navigation: saved, updatedAt: new Date().toISOString() });
      return saved;
    } catch (err) {
      console.warn('Firestore navigation write error:', err);
    }
  },
};
