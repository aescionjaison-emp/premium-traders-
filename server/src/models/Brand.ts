import mongoose, { Document, Schema } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  logo: string;
  category?: string;
  visible: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema: Schema<IBrand> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    category: { type: String, default: 'General' },
    visible: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Brand = mongoose.model<IBrand>('Brand', BrandSchema);
