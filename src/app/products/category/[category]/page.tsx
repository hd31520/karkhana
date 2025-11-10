// src/app/products/category/[category]/page.tsx
import React from 'react'
import { ProductGrid } from '@/components/products/ProductGrid'

type Props = { params: { category: string } }

async function fetchProductsByCategory(category: string) {
  const urlBase = process.env.NEXTAUTH_URL ?? ''
  const res = await fetch(`${urlBase}/api/products?category=${encodeURIComponent(category)}`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  return data.products ?? []
}

export default async function CategoryPage({ params }: Props) {
  const category = params.category
  const products = await fetchProductsByCategory(category)

  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Category: {category}</h1>
        <p className="mt-2 text-gray-600">Showing {products.length} products in “{category}”.</p>
      </header>


      <ProductGrid products={products} />
    </main>
  )
}
