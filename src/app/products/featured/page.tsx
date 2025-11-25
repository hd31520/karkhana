// src/app/products/featured/page.tsx
import React from 'react'
import { ProductGrid } from '@/components/products/ProductGrid'

async function fetchFeatured() {
  const urlBase = process.env.NEXTAUTH_URL ?? ''
  const res = await fetch(`${urlBase}/api/products?featured=true`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  return data.products ?? []
}

export default async function FeaturedPage() {
  const products = await fetchFeatured()

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Featured Products</h1>
          <p className="mt-2 text-muted-foreground">Our handpicked featured items.</p>
        </header>

        <ProductGrid products={products} />
      </div>
    </main>
  )
}