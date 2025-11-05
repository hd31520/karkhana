import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';
import { getCurrentUser } from '@/lib/auth/session';

// Get all products for current tenant
export async function GET(request) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ tenantId: user.tenantId._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ tenantId: user.tenantId._id });

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new product
export async function POST(request) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || !user.tenantId || !['boss', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, price, imageUrl, category, stock, features, specifications } = await request.json();

    if (!name || !description || !price || !imageUrl) {
      return NextResponse.json(
        { error: 'Name, description, price, and image are required' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      tenantId: user.tenantId._id,
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      category: category || 'General',
      stock: stock ? parseInt(stock) : 0,
      features: features || [],
      specifications: specifications || {}
    });

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}