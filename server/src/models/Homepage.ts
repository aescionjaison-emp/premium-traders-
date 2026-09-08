import mongoose, { Document, Schema } from 'mongoose';

export interface IHeroSlide {
  smallLabel: string;
  heading: string;
  subheading?: string;
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
  desc?: string;
  tagline?: string;
  link?: string;
  image: string;
  textureImage?: string;
  imageTexture?: string;
  highlight?: string;
  imageSpace?: string;
  accent?: string;
}

export interface ICategoryChapterItem {
  id?: string;
  num?: string;
  number?: string;
  name?: string;
  heading?: string;
  tagline?: string;
  subLabel?: string;
  title?: string;
  desc?: string;
  link?: string;
  coverImage?: string;
  image?: string;
  textureImage?: string;
  spaceImage?: string;
  finishes?: string[];
  visible?: boolean;
}

export interface ICategoryChapters {
  granite: ICategoryChapterItem;
  tiles: ICategoryChapterItem;
  wood: ICategoryChapterItem;
  electrical: ICategoryChapterItem;
}

export interface IExploreMaterialItem {
  id: string;
  category: string;
  name: string;
  subtitle?: string;
  link?: string;
  image: string;
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

export interface IHomepage extends Document {
  heroSlides: IHeroSlide[];
  materialsComeToLife: IMaterialsLifeSlide[];
  categoryChapters: ICategoryChapters;
  exploreMaterials: IExploreMaterialItem[];
  sections: IHomepageSection[];
  featuredProductIds: mongoose.Types.ObjectId[];
  featuredCollectionIds: mongoose.Types.ObjectId[];
  updatedAt: Date;
}

const HeroSlideSchema = new Schema(
  {
    smallLabel: { type: String, default: 'Premium Materials' },
    heading: { type: String, default: 'Beautiful Spaces.' },
    subheading: { type: String, default: '' },
    image: { type: String, required: true },
    mobileImage: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    ctaText: { type: String, default: 'Explore Collection' },
    ctaLink: { type: String, default: '/catalog' },
    badge: { type: String, default: '' },
  },
  { _id: false, strict: false }
);

const MaterialsLifeSlideSchema = new Schema(
  {
    num: { type: String, default: '01' },
    category: { type: String, default: 'GRANITE' },
    name: { type: String, default: 'Natural Stone' },
    headline: { type: String, default: 'Natural Stone' },
    desc: { type: String, default: '' },
    tagline: { type: String, default: '' },
    link: { type: String, default: '/granite' },
    image: { type: String, default: '' },
    textureImage: { type: String, default: '' },
    imageTexture: { type: String, default: '' },
    highlight: { type: String, default: '' },
    imageSpace: { type: String, default: '' },
    accent: { type: String, default: '#D4AF37' },
  },
  { _id: false, strict: false }
);

const CategoryChapterItemSchema = new Schema(
  {
    id: { type: String, default: '' },
    num: { type: String, default: '01' },
    number: { type: String, default: '01' },
    name: { type: String, default: 'Collection' },
    heading: { type: String, default: 'Collection' },
    tagline: { type: String, default: 'Material' },
    subLabel: { type: String, default: 'Material' },
    title: { type: String, default: 'Material Name' },
    desc: { type: String, default: '' },
    link: { type: String, default: '/catalog' },
    coverImage: { type: String, default: '' },
    image: { type: String, default: '' },
    textureImage: { type: String, default: '' },
    spaceImage: { type: String, default: '' },
    finishes: { type: [String], default: [] },
    visible: { type: Boolean, default: true },
  },
  { _id: false, strict: false }
);

const CategoryChaptersSchema = new Schema(
  {
    granite: { type: CategoryChapterItemSchema, default: () => ({}) },
    tiles: { type: CategoryChapterItemSchema, default: () => ({}) },
    wood: { type: CategoryChapterItemSchema, default: () => ({}) },
    electrical: { type: CategoryChapterItemSchema, default: () => ({}) },
  },
  { _id: false, strict: false }
);

const ExploreMaterialItemSchema = new Schema(
  {
    id: { type: String, required: true },
    category: { type: String, default: 'Granite' },
    name: { type: String, required: true },
    subtitle: { type: String, default: '' },
    link: { type: String, default: '/catalog' },
    image: { type: String, required: true },
  },
  { _id: false, strict: false }
);

const HomepageSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    displayOrder: { type: Number, required: true },
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false, strict: false }
);

const HomepageSchema: Schema<IHomepage> = new Schema(
  {
    heroSlides: { type: [HeroSlideSchema], default: [] },
    materialsComeToLife: { type: [MaterialsLifeSlideSchema], default: [] },
    categoryChapters: { type: CategoryChaptersSchema, default: () => ({}) },
    exploreMaterials: { type: [ExploreMaterialItemSchema], default: [] },
    sections: { type: [HomepageSectionSchema], default: [] },
    featuredProductIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    featuredCollectionIds: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
  },
  { timestamps: true, strict: false }
);

export const Homepage = mongoose.model<IHomepage>('Homepage', HomepageSchema);


