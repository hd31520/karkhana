// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';
import { getUserIdFromReq } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserIdFromReq(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const created = await Product.create({
      userId: new mongoose.Types.ObjectId(userId),
      title: body.title,
      description: body.description,
      images: body.images || [],
      price: Number(body.price || 0),
      category: body.category || 'general',
      status: 'pending',
      paymentStatus: 'unpaid',
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Error' }, { status: 500 });
  }
}
