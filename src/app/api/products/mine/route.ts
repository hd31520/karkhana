// src/app/api/products/mine/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';
import { getUserIdFromReq } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserIdFromReq(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const products = await Product.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Error' }, { status: 500 });
  }
}
