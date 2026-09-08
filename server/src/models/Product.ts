import mongoose, { Document, Schema } from 'mongoose';

export interface IProductSpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  shortName?: string;
  displayName?: string;
  videoUrl?: string;
  price?: number;
  slug: string;
  category: mongoose.Types.ObjectId | string;
  categorySlug?: string;
  subcategory?: string;
  brand?: string;
  collectionName?: string;
  material: string;
  finish: string; // e.g. Polished, Satin Matte, Flamed, Rustic, Honed, High Gloss
  surface?: string; // e.g. Floor, Wall, Countertop, Facade, Ceiling
  color: string;
  size: string; // e.g. 600x1200 mm, 800x1600 mm, 1200x2400 mm, 8x4 ft
  bodyType?: string; // e.g. Full Body Vitrified, Glazed Vitrified, Porcelain, Ceramic, Natural Slab, Solid Teak
  sku: string;
  description?: string;
  applications: string[]; // e.g. ['Living Room', 'Commercial', 'Bathroom', 'Kitchen', 'Exterior']
  specifications: IProductSpecification[];
  images: string[];
  installationImages: string[];
  featured: boolean;
  newArrival: boolean;
  popular: boolean;
  available: boolean;
  visible: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSpecificationSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, default: '', trim: true },
    displayName: { type: String, default: '', trim: true },
    videoUrl: { type: String, default: '', trim: true },
    price: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    categorySlug: { type: String, default: '' },
    subcategory: { type: String, default: '' },
    brand: { type: String, default: 'Architectural Heritage' },
    collectionName: { type: String, default: '' },
    material: { type: String, required: true, default: 'Ceramic' },
    finish: { type: String, required: true, default: 'Polished' },
    surface: { type: String, default: 'Universal' },
    color: { type: String, required: true, default: 'Ivory' },
    size: { type: String, required: true, default: '600x1200 mm' },
    bodyType: { type: String, default: 'Vitrified' },
    sku: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    applications: { type: [String], default: [] },
    specifications: { type: [ProductSpecificationSchema], default: [] },
    images: { type: [String], default: [] },
    installationImages: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    visible: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', sku: 'text', material: 'text', finish: 'text', brand: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
