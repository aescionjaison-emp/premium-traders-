import mongoose, { Document, Schema } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  featured: boolean;
  visible: boolean;
  displayOrder: number;
  products?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema<ICollection> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    featured: { type: Boolean, default: true },
    visible: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

export const Collection = mongoose.model<ICollection>('Collection', CollectionSchema);
