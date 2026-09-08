export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  image?: string;
  textureImage?: string;
  icon?: string;
  visible: boolean;
  featured: boolean;
  displayOrder: number;
}

export interface IProductSpecification {
  key: string;
  value: string;
}

export interface IProduct {
  _id: string;
  name: string;
  shortName?: string;
  displayName?: string;
  slug: string;
  category: string | ICategory;
  categorySlug?: string;
  subcategory?: string;
  brand?: string;
  collectionName?: string;
  material: string;
  finish: string;
  surface?: string;
  color: string;
  size: string;
  bodyType?: string;
  sku: string;
  price?: number;
  description?: string;
  videoUrl?: string;
  applications: string[];
  specifications: IProductSpecification[];
  images: string[];
  installationImages?: string[];
  featured: boolean;
  newArrival: boolean;
  popular: boolean;
  available: boolean;
  visible: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICollection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  featured: boolean;
  visible: boolean;
  displayOrder: number;
  products?: IProduct[];
}

export interface IBrand {
  _id: string;
  name: string;
  logo?: string;
  category?: string;
  categorySlug?: string;
  featured?: boolean;
  visible: boolean;
  displayOrder: number;
}

export interface IGalleryItem {
  _id: string;
  title: string;
  category: string;
  image: string;
  thumbnail?: string;
  locationOrSpace?: string;
  aspectRatio?: string;
  featured: boolean;
  visible: boolean;
  displayOrder: number;
}

export interface IHeroSlide {
  smallLabel: string;
  heading: string;
  subheading: string;
  image: string;
  mobileImage?: string;
  videoUrl?: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
}

export interface IMaterialsLifeSlide {
  num: string;
  category: string;
  name: string;
  headline?: string;
  desc: string;
  image: string;
  textureImage?: string;
  imageTexture?: string;
  imageSpace?: string;
  highlight: string;
  accent: string;
  link?: string;
}

export interface ICategoryChapterItem {
  id: string;
  num: string;
  name: string;
  heading?: string;
  tagline: string;
  subLabel?: string;
  desc: string;
  coverImage: string;
  image?: string;
  textureImage: string;
  spaceImage: string;
  finishes: string[];
  link?: string;
}

export interface ICategoryChapters {
  granite: ICategoryChapterItem;
  tiles: ICategoryChapterItem;
  wood: ICategoryChapterItem;
  electrical: ICategoryChapterItem;
}

export interface IExploreMaterialItem {
  id: string;
  name: string;
  subtitle?: string;
  image: string;
  category: string;
  link?: string;
}

export interface IHomepageSection {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  visible: boolean;
  displayOrder: number;
  settings?: Record<string, any>;
}

export interface IHomepageConfig {
  _id?: string;
  heroSlides: IHeroSlide[];
  materialsComeToLife?: IMaterialsLifeSlide[];
  categoryChapters?: ICategoryChapters;
  exploreMaterials?: IExploreMaterialItem[];
  sections: IHomepageSection[];
  featuredProductIds: IProduct[];
  featuredCollectionIds: ICollection[];
}

export interface IMediaItem {
  _id: string;
  url: string;
  filename: string;
  category: string;
  mimeType: string;
  isVideo: boolean;
  size: number;
  publicId?: string;
  createdAt?: string;
}

export interface INavItem {
  label: string;
  url: string;
  categorySlug?: string;
  isExternal?: boolean;
  visible: boolean;
  displayOrder: number;
}

export interface INavigation {
  _id?: string;
  items: INavItem[];
}

export interface ISiteSettings {
  _id?: string;
  businessName: string;
  tagline?: string;
  logo?: string;
  favicon?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl?: string;
  openingHours: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  footerText?: string;
  copyrightText?: string;
}

export interface IEnquiry {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  product?: string | IProduct;
  productName?: string;
  productSku?: string;
  category?: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | string;
  avatar?: string;
}
