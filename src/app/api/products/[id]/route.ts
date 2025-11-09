// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';
import { getUserIdFromReq } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const p = await Product.findById(params.id).lean();
    if (!p) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(p);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = await getUserIdFromReq(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    if (product.userId.toString() !== userId) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    Object.assign(product, body);
    await product.save();
    return NextResponse.json(product);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = await getUserIdFromReq(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    if (product.userId.toString() !== userId) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Error' }, { status: 500 });
  }
}
