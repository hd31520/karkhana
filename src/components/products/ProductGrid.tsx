// src/components/products/ProductGrid.tsx
'use client'

import React from 'react'
import { ProductCard } from './ProductCard'

interface Product {
  _id: string
  title: string
  price: number
  images?: string[]
  category?: string
  status?: string
  seo?: { slug?: string }
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        কোন প্রোডাক্ট পাওয়া যায়নি।
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )
}