// src/app/api/products/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/database'
// import Product from '@/models/Product'
import mongoose from 'mongoose'
import { Product } from '@/models/Product'

/**
 * Route handlers for /api/products/:id
 *
 * NOTE: context.params may be a Promise<{ id: string }>, so we `await` it.
 */

// helper to get id from context (handles Promise or plain)
async function resolveId(context: { params: any }) {
  const params = await Promise.resolve(context.params)
  return params?.id as string | undefined
}

// GET -> returns plain object (lean)
export async function GET(
  _request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await resolveId(context)
    if (!id) return NextResponse.json({ error: 'Missing id param' }, { status: 400 })

    await connectToDatabase()

    // try find by seo.slug first, then by ObjectId
    let product = await Product.findOne({ 'seo.slug': id }).lean()
    if (!product && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean()
    }

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    return NextResponse.json({ product })
  } catch (err) {
    console.error('GET /api/products/:id error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT -> update allowed fields; requires actorId/actorRole in body (or integrate auth)
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await resolveId(context)
    if (!id) return NextResponse.json({ error: 'Missing id param' }, { status: 400 })

    await connectToDatabase()

    const payload = await request.json().catch(() => ({}))
    const { actorId, actorRole, ...updates } = payload

    // find document (non-lean) so we can save
    const productDoc =
      (await Product.findOne({ 'seo.slug': id })) ||
      (mongoose.Types.ObjectId.isValid(id) ? await Product.findById(id) : null)

    if (!productDoc) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    // authorization check (simple placeholder)
    const ownerId = productDoc.userId?.toString?.()
    const isOwner = actorId && ownerId && actorId === ownerId
    const isAdmin = actorRole === 'admin' || actorRole === 'superadmin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 })
    }

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
    ] as const

    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        // @ts-ignore dynamic assignment
        productDoc[key] = updates[key]
      }
    }

    await productDoc.save()

    // return updated product (lean-like)
    const updated = await Product.findById(productDoc._id).lean()
    return NextResponse.json({ success: true, product: updated })
  } catch (err) {
    console.error('PUT /api/products/:id error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE -> delete product document; requires actorId/actorRole in body
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await resolveId(context)
    if (!id) return NextResponse.json({ error: 'Missing id param' }, { status: 400 })

    await connectToDatabase()

    const body = await request.json().catch(() => ({}))
    const { actorId, actorRole } = body

    const productDoc =
      (await Product.findOne({ 'seo.slug': id })) ||
      (mongoose.Types.ObjectId.isValid(id) ? await Product.findById(id) : null)

    if (!productDoc) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const ownerId = productDoc.userId?.toString?.()
    const isOwner = actorId && ownerId && actorId === ownerId
    const isAdmin = actorRole === 'admin' || actorRole === 'superadmin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 })
    }

    await productDoc.deleteOne()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/products/:id error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
