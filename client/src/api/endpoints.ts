import axiosClient from './axiosClient.js';
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

export const api = {
  // Products
  getProducts: (params?: Record<string, any>) =>
    axiosClient.get<{ success: boolean; data: IProduct[]; pagination: any }>('/products', { params }),
  getProductBySlug: (slug: string) =>
    axiosClient.get<{ success: boolean; data: IProduct }>(`/products/slug/${slug}`),
  getRelatedProducts: (id: string) =>
    axiosClient.get<{ success: boolean; data: IProduct[] }>(`/products/${id}/related`),
  getFilterOptions: (categorySlug?: string) =>
    axiosClient.get<{ success: boolean; data: any }>('/products/filters', { params: { categorySlug } }),
  createProduct: (data: Partial<IProduct>) =>
    axiosClient.post<{ success: boolean; message: string; data: IProduct }>('/products', data),
  updateProduct: (id: string, data: Partial<IProduct>) =>
    axiosClient.put<{ success: boolean; message: string; data: IProduct }>(`/products/${id}`, data),
  deleteProduct: (id: string) =>
    axiosClient.delete<{ success: boolean; message: string }>(`/products/${id}`),
  toggleProductFeature: (id: string) =>
    axiosClient.patch<{ success: boolean; message: string; data: IProduct }>(`/products/${id}/toggle-feature`),
  toggleProductVisibility: (id: string) =>
    axiosClient.patch<{ success: boolean; message: string; data: IProduct }>(`/products/${id}/toggle-visibility`),
  duplicateProduct: (id: string) =>
    axiosClient.post<{ success: boolean; message: string; data: IProduct }>(`/products/${id}/duplicate`),

  // Categories
  getCategories: (params?: { visibleOnly?: boolean }) =>
    axiosClient.get<{ success: boolean; data: ICategory[] }>('/categories', { params }),
  getCategoryBySlug: (slug: string) =>
    axiosClient.get<{ success: boolean; data: ICategory }>(`/categories/slug/${slug}`),
  createCategory: (data: Partial<ICategory>) =>
    axiosClient.post<{ success: boolean; message: string; data: ICategory }>('/categories', data),
  updateCategory: (id: string, data: Partial<ICategory>) =>
    axiosClient.put<{ success: boolean; message: string; data: ICategory }>(`/categories/${id}`, data),
  deleteCategory: (id: string) =>
    axiosClient.delete<{ success: boolean; message: string }>(`/categories/${id}`),

  // Collections
  getCollections: (params?: { visibleOnly?: boolean; featuredOnly?: boolean }) =>
    axiosClient.get<{ success: boolean; data: ICollection[] }>('/collections', { params }),
  getCollectionBySlug: (slug: string) =>
    axiosClient.get<{ success: boolean; data: ICollection }>(`/collections/slug/${slug}`),
  createCollection: (data: Partial<ICollection>) =>
    axiosClient.post<{ success: boolean; message: string; data: ICollection }>('/collections', data),
  updateCollection: (id: string, data: Partial<ICollection>) =>
    axiosClient.put<{ success: boolean; message: string; data: ICollection }>(`/collections/${id}`, data),
  deleteCollection: (id: string) =>
    axiosClient.delete<{ success: boolean; message: string }>(`/collections/${id}`),

  // Brands
  getBrands: (params?: { visibleOnly?: boolean }) =>
    axiosClient.get<{ success: boolean; data: IBrand[] }>('/brands', { params }),
  createBrand: (data: Partial<IBrand>) =>
    axiosClient.post<{ success: boolean; message: string; data: IBrand }>('/brands', data),
  updateBrand: (id: string, data: Partial<IBrand>) =>
    axiosClient.put<{ success: boolean; message: string; data: IBrand }>(`/brands/${id}`, data),
  deleteBrand: (id: string) =>
    axiosClient.delete<{ success: boolean; message: string }>(`/brands/${id}`),

  // Homepage Config
  getHomepageConfig: () =>
    axiosClient.get<{ success: boolean; data: IHomepageConfig }>('/homepage'),
  updateHomepageConfig: (data: Partial<IHomepageConfig>) =>
    axiosClient.put<{ success: boolean; message: string; data: IHomepageConfig }>('/homepage', data),
  reorderHomepageSections: (sections: any[]) =>
    axiosClient.post<{ success: boolean; message: string; data: any[] }>('/homepage/reorder', { sections }),

  // Gallery
  getGallery: (params?: { category?: string; featuredOnly?: boolean; visibleOnly?: boolean }) =>
    axiosClient.get<{ success: boolean; data: IGalleryItem[] }>('/gallery', { params }),
  createGalleryItem: (data: Partial<IGalleryItem>) =>
    axiosClient.post<{ success: boolean; message: string; data: IGalleryItem }>('/gallery', data),
  updateGalleryItem: (id: string, data: Partial<IGalleryItem>) =>
    axiosClient.put<{ success: boolean; message: string; data: IGalleryItem }>(`/gallery/${id}`, data),
  deleteGalleryItem: (id: string) =>
    axiosClient.delete<{ success: boolean; message: string }>(`/gallery/${id}`),

  // Navigation
  getNavigation: () =>
    axiosClient.get<{ success: boolean; data: INavigation }>('/navigation'),
  updateNavigation: (items: any[]) =>
    axiosClient.put<{ success: boolean; message: string; data: INavigation }>('/navigation', { items }),

  // Site Settings
  getSiteSettings: () =>
    axiosClient.get<{ success: boolean; data: ISiteSettings }>('/settings'),
  updateSiteSettings: (data: Partial<ISiteSettings>) =>
    axiosClient.put<{ success: boolean; message: string; data: ISiteSettings }>('/settings', data),

  // Enquiries
  submitEnquiry: (data: Partial<IEnquiry>) =>
    axiosClient.post<{ success: boolean; message: string; data: IEnquiry }>('/enquiries', data),
  getEnquiries: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    axiosClient.get<{ success: boolean; data: IEnquiry[]; pagination: any }>('/enquiries', { params }),
  updateEnquiryStatus: (id: string, status: string, notes?: string) =>
    axiosClient.patch<{ success: boolean; message: string; data: IEnquiry }>(`/enquiries/${id}/status`, {
      status,
      notes,
    }),
  deleteEnquiry: (id: string) =>
    axiosClient.delete<{ success: boolean; message: string }>(`/enquiries/${id}`),

  // Media Uploads
  uploadSingleImage: (formData: FormData) =>
    axiosClient.post<{ success: boolean; message: string; url: string; publicId: string }>(
      '/upload/single',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),
  uploadMultipleImages: (formData: FormData) =>
    axiosClient.post<{ success: boolean; message: string; urls: string[]; data: any[] }>(
      '/upload/multiple',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),

  // Media Library
  getMedia: (params?: { category?: string; search?: string; isVideo?: boolean }) =>
    axiosClient.get<{ success: boolean; data: IMediaItem[] }>('/media', { params }),
  createMedia: (formData: FormData) =>
    axiosClient.post<{ success: boolean; message: string; data: IMediaItem }>('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMedia: (id: string) =>
    axiosClient.delete<{ success: boolean; message: string }>(`/media/${id}`),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    axiosClient.post<{ success: boolean; token: string; user: any; message: string }>('/auth/login', credentials),
  getProfile: () =>
    axiosClient.get<{ success: boolean; user: any }>('/auth/profile'),
};

