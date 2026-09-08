import mongoose, { Document, Schema } from 'mongoose';

export interface INavItem {
  label: string;
  url: string;
  categorySlug?: string;
  isExternal?: boolean;
  visible: boolean;
  displayOrder: number;
}

export interface INavigationDoc extends Document {
  items: INavItem[];
  updatedAt: Date;
}

const NavItemSchema = new Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    categorySlug: { type: String, default: '' },
    isExternal: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const NavigationSchema: Schema<INavigationDoc> = new Schema(
  {
    items: { type: [NavItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Navigation = mongoose.model<INavigationDoc>('Navigation', NavigationSchema);
