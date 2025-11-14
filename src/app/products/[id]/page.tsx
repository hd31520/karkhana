// src/app/products/[id]/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { connectToDatabase } from '@/lib/database'    // adjust if needed
import { Product } from '@/models/Product'           // adjust if needed
import mongoose from 'mongoose'

type Params = { params: { id: string } }

/** Helper: recursively pull URLs/strings from various shapes */
function extractImageUrls(raw: any): string[] {
  const urls: string[] = []

  if (!raw) return urls

  // raw is array
  if (Array.isArray(raw)) {
    for (const it of raw) {
      urls.push(...extractImageUrls(it))
    }
    return urls.filter(Boolean)
  }

  // raw is string
  if (typeof raw === 'string') {
    return [raw].filter(Boolean)
  }

  // raw is object: try common keys
  if (typeof raw === 'object') {
    // direct url-like keys
    const candidates = ['url', 'src', 'path', 'publicUrl', 'secure_url', 'link']
    for (const k of candidates) {
      if (typeof raw[k] === 'string' && raw[k].trim()) urls.push(raw[k].trim())
    }

    // nested arrays/objects
    for (const v of Object.values(raw)) {
      if (Array.isArray(v) || typeof v === 'object' || typeof v === 'string') {
        urls.push(...extractImageUrls(v))
      }
    }
  }

  // dedupe & filter
  const unique = Array.from(new Set(urls.filter(Boolean)))
  return unique
}

/** Ensure absolute URL if possible (simple heuristic) */
function ensureAbsolute(url: string): string {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('//')) return 'https:' + url
  if (url.startsWith('/')) return url
  return 'https://' + url
}

async function fetchProduct(id: string): Promise<any | null> {
  try {
    await connectToDatabase()

    // fetch by slug first, then by ObjectId
    let product = await Product.findOne({ 'seo.slug': id }).lean()
    if (!product && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean()
    }
    return product ?? null
  } catch (err) {
    console.error('fetchProduct DB error:', err)
    return null
  }
}

export default async function ProductDetailPage({ params }: Params) {
  const { id } = params
  const product = (await fetchProduct(id)) as any

  if (!product) {
    notFound()
  }

  // — LOG the fetched product server-side so you can inspect fields
  console.log('DEBUG product fetched for detail page:', {
    _id: product?._id,
    title: product?.title,
    imagesFieldType: typeof product?.images,
    imagesFieldSample: Array.isArray(product?.images) ? product.images.slice(0,3) : product?.images,
    fallbackImage: product?.image ?? product?.photo ?? null,
    seo: product?.seo ?? null,
  })

  const idString = product?._id?.toString?.() ?? String(product?._id ?? 'unknown-id')

  // Extract images from many possible shapes:
  let images: string[] = []
  const probes = [product.images, product.image, product.photo, product.gallery, product.images_gallery, product.photos, product.pictures]

  for (const p of probes) {
    if (!p) continue
    images.push(...extractImageUrls(p))
  }

  if (images.length === 0) {
    const scanned = extractImageUrls(product)
    images.push(...scanned)
  }

  images = images.map((u) => ensureAbsolute(u)).filter(Boolean)
  images = Array.from(new Set(images))

  const priceDisplay =
    typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price ?? 'N/A'

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/products" className="text-sm text-blue-600 hover:underline">
          ← Back to products
        </Link>
      </div>

      <h1 className="text-2xl font-semibold">{product.title}</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: image gallery */}
        <div>
          {images.length > 0 ? (
            <div className="space-y-4">
              {/* main image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0]}
                alt={product.title ?? 'Product image'}
                className="w-full h-96 object-cover rounded-lg"
              />

              {/* thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto mt-2">
                  {images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={`${product.title ?? 'Product'} ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Right: details */}
        <div>
          <p className="text-lg font-medium">Price: {priceDisplay}</p>

          <p className="mt-4 text-sm text-gray-700">{product.description ?? 'No description'}</p>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Add to cart</button>
            <button className="px-4 py-2 border rounded">Contact seller</button>
          </div>

          <section className="mt-8 bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold">Product Information</h4>
            <ul className="mt-3 text-sm text-gray-600 space-y-2">
              <li><strong>Status:</strong> {product.status ?? 'N/A'}</li>
              <li><strong>SKU/ID:</strong> {idString}</li>
              {product.category && <li><strong>Category:</strong> {product.category}</li>}
              {product.brand && <li><strong>Brand:</strong> {product.brand}</li>}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
