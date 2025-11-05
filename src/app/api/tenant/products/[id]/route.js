import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import { getCurrentUser } from '@/lib/auth/session';

// Get single product
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await Product.findOne({
      _id: params.id,
      tenantId: user.tenantId._id
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update product
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || !user.tenantId || !['boss', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    const product = await Product.findOneAndUpdate(
      {
        _id: params.id,
        tenantId: user.tenantId._id
      },
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || !user.tenantId || user.role !== 'boss') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await Product.findOneAndDelete({
      _id: params.id,
      tenantId: user.tenantId._id
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}