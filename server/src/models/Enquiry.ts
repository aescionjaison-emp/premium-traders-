import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  product?: mongoose.Types.ObjectId;
  productName?: string;
  productSku?: string;
  category?: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema: Schema<IEnquiry> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, default: '' },
    productSku: { type: String, default: '' },
    category: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['NEW', 'CONTACTED', 'CLOSED'], default: 'NEW' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
