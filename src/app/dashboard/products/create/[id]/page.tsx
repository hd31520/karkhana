// src/app/dashboard/products/[id]/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Product } from '@/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { fetcher } from '@/lib/fetcher'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    let mounted = true
    fetcher(`/api/products/${id}`).then((data) => { if (mounted) setProduct(data) }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  async function save() {
    if (!product) return
    setSaving(true)
    const res = await fetch(`/api/products/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    setSaving(false)
    if (!res.ok) {
      alert('Save failed')
      return
    }
    alert('Saved')
  }

  async function remove() {
    if (!product || !confirm('Are you sure to delete this product?')) return
    const res = await fetch(`/api/products/${product._id}`, { method: 'DELETE' })
    if (res.ok) router.push('/dashboard/products')
    else alert('Delete failed')
  }

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="max-w-3xl">
      <h3 className="text-lg font-medium mb-4">Edit Product</h3>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded border space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Title</label>
          <Input value={product.title} onChange={(e) => setProduct({ ...product, title: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Description</label>
          <Textarea value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} rows={5} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Price</label>
            <Input type="number" value={String(product.price)} onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Category</label>
            <Input value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="destructive" onClick={remove}>Delete</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
        </div>
      </div>
    </div>
  )
}
