// src/models/Salary.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISalary extends Document {
  userId: mongoose.Types.ObjectId | string;
  period: { month: number; year: number };
  baseSalary: number;
  bonuses: number;
  deductions: number;
  calculation: { grossSalary: number; totalDeductions: number; netSalary: number };
  payment: { status: 'paid' | 'pending' | 'failed'; paidAt?: Date };
  createdAt?: Date;
  updatedAt?: Date;
}

const SalarySchema = new Schema<ISalary>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  period: { month: { type: Number, required: true }, year: { type: Number, required: true } },
  baseSalary: { type: Number, required: true },
  bonuses: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  calculation: {
    grossSalary: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
  },
  payment: { status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' }, paidAt: Date },
}, { timestamps: true });

export const Salary: Model<ISalary> = (mongoose.models.Salary as Model<ISalary>) || mongoose.model<ISalary>('Salary', SalarySchema);
