// src/components/products/ProductCard.tsx
'use client'

import React from 'react'
import Link from 'next/link'

interface Product {
  _id: string
  title: string
  price: number
  images?: string[]
  category?: string
  status?: string
  seo?: { slug?: string }
}

export function ProductCard({ product }: { product: Product }) {
  const img = product.images && product.images[0] ? product.images[0] : '/images/banner.png'
  const slug = product.seo?.slug ?? product._id
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
      <Link href={`/products/${slug}`}>
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img src={img} alt={product.title} className="object-cover w-full h-full" />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="text-lg font-semibold line-clamp-2">{product.title}</h3>
        </Link>
        <p className="mt-2 text-sm text-gray-500">{product.category ?? 'Uncategorized'}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xl font-bold">৳ {product.price?.toFixed ? product.price.toFixed(2) : product.price}</div>
          <Link href={`/products/${slug}`}>
            <button className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50">View</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
