// src/app/products/search/page.tsx
import React from 'react'
import { ProductGrid } from '@/components/products/ProductGrid'

type Props = { searchParams: { q?: string } }

async function fetchSearch(q?: string) {
  const urlBase = process.env.NEXTAUTH_URL ?? ''
  const qs = q ? `?search=${encodeURIComponent(q)}` : ''
  const res = await fetch(`${urlBase}/api/products${qs}`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  return data.products ?? []
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams?.q ?? ''
  const products = await fetchSearch(q)

  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Search results {q ? `for “${q}”` : ''}</h1>
        <p className="mt-2 text-gray-600">{products.length} results found.</p>
      </header>

    
      <ProductGrid products={products} />
    </main>
  )
}
