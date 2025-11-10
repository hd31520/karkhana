// src/app/products/page.tsx
import React from 'react'
import { ProductGrid } from '@/components/products/ProductGrid'

type ProductType = {
  _id: string
  title: string
  price: number
  images?: string[]
  category?: string
  status?: string
  seo?: { slug?: string }
}

async function fetchProducts() {
  // relative fetch to your Next.js API route
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ''}/api/products`, { cache: 'no-store' })
  if (!res.ok) {
    console.error('Failed to fetch products', res.status)
    return []
  }
  const data = await res.json()
  // assume api returns { products: [...] }
  return data.products ?? data ?? []
}

export default async function ProductsPage() {
  const products: ProductType[] = await fetchProducts()

  return (
    <main className="max-w-7xl mx-auto py-12 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-gray-600">সব প্রোডাক্ট ব্রাউজ করুন — ক্যাটাগরি ও অনুসন্ধানের জন্য উপরের বার ব্যবহার করুন।</p>
      </header>

      <section>
        {/* ProductGrid is client component */}
        
        <ProductGrid products={products} />
      </section>
    </main>
  )
}
