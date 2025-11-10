// src/app/products/[id]/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'

type Params = { params: { id: string } }

async function fetchProduct(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ''}/api/products/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  const data = await res.json()
  return data.product ?? data ?? null
}

export default async function ProductDetailPage({ params }: Params) {
  const { id } = params
  const product = await fetchProduct(id)

  if (!product) return notFound()

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <img src={product.images?.[0] ?? '/images/banner.png'} alt={product.title} className="object-cover w-full h-96" />
          {/* optionally a gallery */}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="mt-2 text-gray-600">{product.category ?? 'No category'}</p>
          <div className="mt-4 text-3xl font-bold">৳ {product.price?.toFixed ? product.price.toFixed(2) : product.price}</div>

          <div className="mt-6">
            <h3 className="font-semibold">Description</h3>
            <p className="mt-2 text-gray-700">{product.description ?? 'No description provided.'}</p>
          </div>

          <div className="mt-8 flex gap-3">
            <button className="px-4 py-2 rounded-md bg-emerald-600 text-white">Contact Seller</button>
            <button className="px-4 py-2 rounded-md border">Request Quote</button>
          </div>
        </div>
      </div>

      {/* extra info area */}
      <section className="mt-10 bg-white rounded-lg p-6 shadow-sm">
        <h4 className="font-semibold">Product Details</h4>
        <ul className="mt-4 text-sm text-gray-600 space-y-2">
          <li><strong>Status:</strong> {product.status ?? 'N/A'}</li>
          <li><strong>SKU/ID:</strong> {product._id}</li>
        </ul>
      </section>
    </main>
  )
}
