// src/app/api/dashboard/summary/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const pendingPayments = await Order.countDocuments({ 'payment.status': { $ne: 'succeeded' } });
    return NextResponse.json({ products, orders, pendingPayments });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}
