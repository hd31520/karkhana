// src/app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
// import Product from '@/models/Product'
import mongoose from 'mongoose'
import { Product } from '@/models/Product'

/**
 * Handles single product operations
 * GET  /api/products/:id     → Fetch single product (by id or slug)
 * PUT  /api/products/:id     → Update product (requires actorId or actorRole)
 * DELETE /api/products/:id   → Delete product (requires actorId or actorRole)
 */

async function findByIdOrSlug(id: string) {
  // Try finding by SEO slug first
  let product = await Product.findOne({ 'seo.slug': id }).lean()
  if (!product && mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id).lean()
  }
  return product
}

// 🟢 GET PRODUCT DETAILS
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const { id } = params
    const product = await findByIdOrSlug(id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ product })
  } catch (err) {
    console.error('GET /api/products/:id error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// 🟡 UPDATE PRODUCT
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const { id } = params
    const payload = await req.json()
    const { actorId, actorRole, ...updates } = payload

    const productDoc =
      (await Product.findOne({ 'seo.slug': id })) ||
      (mongoose.Types.ObjectId.isValid(id) ? await Product.findById(id) : null)

    if (!productDoc) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Simple permission check (replace later with real auth)
    const ownerId = productDoc.userId?.toString?.()
    const isOwner = actorId && ownerId && actorId === ownerId
    const isAdmin = actorRole === 'admin' || actorRole === 'superadmin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 })
    }

    // Apply only allowed fields
    const allowedFields = [
      'title',
      'description',
      'price',
      'images',
      'category',
      'status',
      'paymentStatus',
      'featured',
      'seo',
    ]

    for (const key of allowedFields) {
      if (key in updates) {
        // @ts-ignore dynamic assignment
        productDoc[key] = updates[key]
      }
    }

    await productDoc.save()

    return NextResponse.json({ success: true, product: productDoc })
  } catch (err) {
    console.error('PUT /api/products/:id error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// 🔴 DELETE PRODUCT
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const { id } = params
    const body = await req.json().catch(() => ({}))
    const { actorId, actorRole } = body

    const productDoc =
      (await Product.findOne({ 'seo.slug': id })) ||
      (mongoose.Types.ObjectId.isValid(id) ? await Product.findById(id) : null)

    if (!productDoc) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const ownerId = productDoc.userId?.toString?.()
    const isOwner = actorId && ownerId && actorId === ownerId
    const isAdmin = actorRole === 'admin' || actorRole === 'superadmin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 })
    }

    // ✅ deleteOne() is the correct replacement for remove()
    await productDoc.deleteOne()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/products/:id error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
