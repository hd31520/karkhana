// src/app/dashboard/products/create/page.tsx
'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { fetcher } from '@/lib/fetcher'
import { useRouter } from 'next/navigation'

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0),
  category: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

export default function CreateProductPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', price: 0, category: '' }
  })

  async function onSubmit(data: FormValues) {
    // simple API call — backend should accept JSON or FormData if image upload
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      alert('Create failed: ' + (err.message || res.statusText))
      return
    }
    const created = await res.json()
    router.push(`/dashboard/products/${created._id}`)
  }

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Create Product</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded border">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Title</label>
          <Input {...register('title')} />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Description</label>
          <Textarea {...register('description')} rows={4} />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Price (BDT)</label>
            <Input type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Category</label>
            <Input {...register('category')} />
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create'}</Button>
        </div>
      </form>
    </div>
  )
}
