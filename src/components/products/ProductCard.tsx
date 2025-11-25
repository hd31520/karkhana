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
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-all duration-300 hover:border-primary/20">
      <Link href={`/products/${slug}`}>
        <div className="h-48 w-full bg-muted flex items-center justify-center overflow-hidden">
          <img 
            src={img} 
            alt={product.title} 
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300" 
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="text-lg font-semibold line-clamp-2 text-foreground hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="mt-2 text-sm text-muted-foreground">
          {product.category ?? 'Uncategorized'}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xl font-bold text-foreground">
            ৳ {product.price?.toFixed ? product.price.toFixed(2) : product.price}
          </div>
          
          <Link href={`/products/${slug}`}>
            <button className="px-3 py-1 rounded-md border border-border text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}