import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  smallLabel?: string;
  image: string;
  mobileImage?: string;
  ctaText?: string;
  ctaLink?: string;
  position: 'hero' | 'middle' | 'promotional';
  displayOrder: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema<IBanner> = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    smallLabel: { type: String, default: '' },
    image: { type: String, required: true },
    mobileImage: { type: String, default: '' },
    ctaText: { type: String, default: 'Explore Collection' },
    ctaLink: { type: String, default: '/catalog' },
    position: { type: String, enum: ['hero', 'middle', 'promotional'], default: 'hero' },
    displayOrder: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Banner = mongoose.model<IBanner>('Banner', BannerSchema);
