// src/models/Order.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId | string;
  orderNumber: string;
  items: Array<{ productId: mongoose.Types.ObjectId | string; name: string; price: number; quantity: number }>;
  totalAmount: number;
  status: string;
  payment: any;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [{ productId: Schema.Types.ObjectId, name: String, price: Number, quantity: Number }],
  totalAmount: Number,
  status: { type: String, default: 'pending' },
  payment: { type: Object, default: {} },
}, { timestamps: true });

export const Order: Model<IOrder> = (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);
