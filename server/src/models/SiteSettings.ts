import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
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
  updatedAt: Date;
}

const SiteSettingsSchema: Schema<ISiteSettings> = new Schema(
  {
    businessName: { type: String, required: true, default: 'AMBROSIA ARCHITECTURAL SHOWROOM' },
    tagline: { type: String, default: 'Premium Tiles, Natural Stone, Fine Woodworks & Luxury Lighting' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    phone: { type: String, default: '+91 98765 43210' },
    whatsapp: { type: String, default: '+919876543210' },
    email: { type: String, default: 'info@ambrosiashowroom.com' },
    address: { type: String, default: 'Plot 42, Architectural Corridor, Ring Road' },
    city: { type: String, default: 'Bengaluru' },
    state: { type: String, default: 'Karnataka' },
    pincode: { type: String, default: '560001' },
    googleMapsUrl: { type: String, default: 'https://maps.google.com' },
    openingHours: { type: String, default: 'Mon - Sat: 9:30 AM – 8:30 PM | Sun: 10:00 AM – 6:00 PM' },
    instagramUrl: { type: String, default: 'https://instagram.com' },
    facebookUrl: { type: String, default: 'https://facebook.com' },
    youtubeUrl: { type: String, default: 'https://youtube.com' },
    seoTitle: { type: String, default: 'Ambrosia Showroom | Premium Tiles, Granite, Wood & Electrical Catalog' },
    seoDescription: { type: String, default: 'Explore luxury large-format tiles, exotic natural granite slabs, teak architectural doors, and minimalist designer switches in our digital showroom.' },
    ogImage: { type: String, default: '' },
    footerText: { type: String, default: 'Curating the finest building and interior materials for architects, designers, and distinguished homeowners across India.' },
    copyrightText: { type: String, default: '© 2026 Ambrosia Architectural Showroom. All Rights Reserved.' },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
