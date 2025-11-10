// src/app/api/products/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
// import Product from '@/models/Product'
import mongoose from 'mongoose'
import { Product } from '@/models/Product'

// GET: list products with filtering, search, pagination
// POST: create product (expects userId in body for now)

export async function GET(req: Request) {
  try {
    await connectToDatabase()
    const url = new URL(req.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '24', 10)))
    const skip = (page - 1) * limit

    const category = url.searchParams.get('category') || undefined
    const featured = url.searchParams.get('featured') // 'true' | 'false' | null
    const search = url.searchParams.get('search') || undefined
    const status = url.searchParams.get('status') || undefined
    const minPrice = url.searchParams.get('minPrice')
    const maxPrice = url.searchParams.get('maxPrice')

    const q: any = {}

    if (category) q.category = category
    if (status) q.status = status
    if (featured === 'true') q.featured = true
    if (featured === 'false') q.featured = false

    // price filters
    if (minPrice || maxPrice) {
      q.price = {}
      if (minPrice) q.price.$gte = Number(minPrice)
      if (maxPrice) q.price.$lte = Number(maxPrice)
    }

    // text search (requires text index on title/description)
    if (search) {
      // prefer text search if index exists, else fallback to regex
      q.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const [items, total] = await Promise.all([
      Product.find(q)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(q),
    ])

    return NextResponse.json({
      products: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error('GET /api/products error:', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()

    // REQUIRED FIELDS: title, description, price, userId
    const { title, description, price, images = [], category = 'general', seo = {}, userId } = body

    if (!title || !description || price == null || !userId) {
      return NextResponse.json({ error: 'Missing required fields: title, description, price, userId' }, { status: 400 })
    }

    // simple userId validation (should be ObjectId or string)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      // allow string but warn
      console.warn('POST /api/products: provided userId is not valid ObjectId:', userId)
    }

    const product = new Product({
      userId,
      title,
      description,
      images,
      price: Number(price),
      category,
      seo,
      status: 'pending',
      paymentStatus: 'unpaid',
    })

    await product.save()

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (err) {
    console.error('POST /api/products error:', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
