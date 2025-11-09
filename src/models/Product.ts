// src/models/Product.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentStatus: 'paid' | 'unpaid';
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
}, { timestamps: true });

export const Product: Model<IProduct> = (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);
