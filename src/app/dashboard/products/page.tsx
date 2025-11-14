// src/app/dashboard/products/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { Product } from '@/types'
import { fetcher } from '@/lib/fetcher'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    fetcher('/api/products/mine')
      .then((data) => { if (mounted) setProducts(data || []) })
      .catch((err) => { console.error(err); if (mounted) setError('Failed to load products') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  async function handleDelete(id: string) {
    const ok = confirm('Are you sure you want to delete this product? This cannot be undone.')
    if (!ok) return

    try {
      setDeletingId(id)
      // call your delete API (adjust the route if necessary)
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload?.error || `Delete failed (${res.status})`)
      }
      // optimistic UI: remove from list
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err: any) {
      console.error('Delete product error:', err)
      alert(err?.message ?? 'Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">My Products</h3>
        <Link href="/dashboard/products/create">
          <Button size="sm">Create Product</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-zinc-500">Loading...</div>
      ) : error ? (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-sm border">
          <p className="text-red-500">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-sm border">
          <p className="text-zinc-600">No products yet. Start by creating one.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((p) => {
            const thumb =
              Array.isArray((p as any).images) && (p as any).images.length > 0
                ? (p as any).images[0]
                : (p as any).image || (p as any).photo || '/placeholder.png'

            const priceDisplay =
              typeof p.price === 'number' ? p.price.toFixed(2) : String(p.price ?? '0.00')

            return (
              <div key={p._id} className="bg-white dark:bg-zinc-900 p-4 rounded border flex gap-4">
                <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</h4>
                  <p className="text-sm text-zinc-500 mt-1">Price: ৳{priceDisplay}</p>
                  <p className="text-sm text-zinc-500 mt-1">Status: <span className="capitalize">{p.status ?? 'draft'}</span></p>

                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      href={`/dashboard/products/create/${p._id}`}
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      Manage
                    </Link>

                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deletingId === p._id}
                      className="text-sm text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === p._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
