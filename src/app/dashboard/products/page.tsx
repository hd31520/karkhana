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

  useEffect(() => {
    let mounted = true
    fetcher('/api/products/mine')
      .then((data) => { if (mounted) setProducts(data || []) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

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
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-sm border">
          <p className="text-zinc-600">No products yet. Start by creating one.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((p) => (
            <div key={p._id} className="bg-white dark:bg-zinc-900 p-4 rounded border">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</h4>
                  <p className="text-sm text-zinc-500 mt-1">Price: ৳{p.price}</p>
                  <p className="text-sm text-zinc-500">Status: <span className="capitalize">{p.status}</span></p>
                </div>
                <div className="flex flex-col gap-2">
                  {/* Fixed Link - Option 1: Remove the <a> tag */}
                  <Link 
                    href={`/dashboard/products/create/${p._id}`}
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}