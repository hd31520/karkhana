// src/app/products/page.tsx
import React from 'react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { connectToDatabase } from '@/lib/database' // adjust if needed
import { Product } from '@/models/Product'        // adjust if needed

type ProductType = {
  _id: string
  title: string
  price: number
  images: string[]
  category?: string
  status?: string
  seo?: { slug?: string }
  description?: string
}

async function fetchProductsFromDb(): Promise<ProductType[]> {
  try {
    await connectToDatabase()
    const raw: any[] = await Product.find({}).sort({ createdAt: -1 }).lean()
    if (!raw) return []

    const normalized: ProductType[] = raw.map((p: any) => {
      const idStr = p?._id?.toString?.() ?? String(p?._id ?? '')

      // build images array of strings
      let images: string[] = []
      if (Array.isArray(p.images)) {
        images = p.images.map((it: any) => (typeof it === 'string' ? it : it?.url || '')).filter(Boolean)
      } else if (typeof p.image === 'string') {
        images = [p.image]
      } else if (typeof p.photo === 'string') {
        images = [p.photo]
      }

      // ensure price is a number (fallback to 0)
      let priceNum: number = 0
      if (typeof p.price === 'number') priceNum = p.price
      else if (typeof p.price === 'string' && p.price.trim() !== '') {
        const parsed = Number(p.price)
        priceNum = Number.isFinite(parsed) ? parsed : 0
      } else {
        priceNum = 0
      }

      return {
        _id: idStr,
        title: p.title ?? '',
        price: priceNum,
        images,
        category: p.category,
        status: p.status,
        seo: p.seo,
        description: p.description,
      }
    })

    return normalized
  } catch (err) {
    console.error('fetchProductsFromDb error:', err)
    return []
  }
}

export default async function ProductsPage() {
  const products: ProductType[] = await fetchProductsFromDb()

  return (
    <main className="max-w-7xl mx-auto py-12 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-gray-600">
          সব প্রোডাক্ট ব্রাউজ করুন — ক্যাটাগরি ও অনুসন্ধানের জন্য উপরের বার ব্যবহার করুন।
        </p>
      </header>

      <section>
        {/* ProductGrid is a client component and expects an array of products with numeric price */}
        <ProductGrid products={products} />
      </section>
    </main>
  )
}
