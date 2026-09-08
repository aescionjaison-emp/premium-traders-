import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  category: string; // 'Granite', 'Tiles', 'Wood', 'Interior', 'Showroom'
  image: string;
  thumbnail?: string;
  locationOrSpace?: string; // e.g. 'Luxury Penthouse, Mumbai'
  aspectRatio?: string; // e.g. '16:9', '4:3', '1:1', 'portrait'
  featured: boolean;
  visible: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema<IGallery> = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true, default: 'Interior' },
    image: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    locationOrSpace: { type: String, default: '' },
    aspectRatio: { type: String, default: '16:9' },
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Gallery = mongoose.model<IGallery>('Gallery', GallerySchema);
