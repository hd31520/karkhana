// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
// import Product from '@/models/Product'; // default export is typical; change if yours exports differently
import mongoose from 'mongoose';
import { getUserIdFromReq } from '@/lib/auth';
import { Product } from '@/models/Product';

type ParamsOrPromise = { id: string } | Promise<{ id: string }>;

/** Utility to safely unwrap params whether sync or Promise (fixes build-time validator mismatch). */
async function getIdFromParams(params: ParamsOrPromise) {
  const resolved = await Promise.resolve(params);
  return resolved.id;
}

export async function GET(_req: NextRequest, { params }: { params: ParamsOrPromise }) {
  try {
    await connectToDatabase();

    const id = await getIdFromParams(params);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }

    const p = await Product.findById(id).lean();
    if (!p) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    return NextResponse.json(p);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: ParamsOrPromise }) {
  try {
    await connectToDatabase();

    const userId = await getUserIdFromReq(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const id = await getIdFromParams(params);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }

    const body = await req.json();

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    // Ensure owner
    if (product.userId.toString() !== userId) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    // Apply allowed updates only (optional): you can restrict fields here
    Object.assign(product, body);
    await product.save();

    // Return a plain JS object (serializable)
    const updated = await Product.findById(id).lean();
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: ParamsOrPromise }) {
  try {
    await connectToDatabase();

    const userId = await getUserIdFromReq(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const id = await getIdFromParams(params);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    if (product.userId.toString() !== userId) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Error' }, { status: 500 });
  }
}
