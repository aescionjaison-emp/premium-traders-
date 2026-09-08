import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  filename: string;
  category: string;
  mimeType: string;
  isVideo: boolean;
  size: number;
  publicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema<IMedia> = new Schema(
  {
    url: { type: String, required: true, trim: true },
    filename: { type: String, required: true, trim: true },
    category: {
      type: String,
      default: 'general',
      enum: ['all', 'granite', 'tiles', 'wood', 'electrical', 'homepage', 'general'],
    },
    mimeType: { type: String, default: 'image/jpeg' },
    isVideo: { type: Boolean, default: false },
    size: { type: Number, default: 0 },
    publicId: { type: String, default: '' },
  },
  { timestamps: true }
);

MediaSchema.index({ category: 1, createdAt: -1 });

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
