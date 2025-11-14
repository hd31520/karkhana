// src/app/dashboard/products/create/page.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

// Zod schema (keep price as string in form)
const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(1, 'Price is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
    'Price must be a positive number'
  ),
  category: z.string().min(1, 'Category is required'),
})

type FormValues = {
  title: string
  description: string
  price: string
  category: string
}

type FileWithPreview = { file: File; preview: string; id: string }

export default function CreateProductPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', price: '', category: '' },
  })

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [userId, setUserId] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // keep track of created preview URLs so we can revoke them on unmount
  const previewsRef = useRef<string[]>([])

  // Get current user ID (adjust endpoint if your auth/session endpoint differs)
  useEffect(() => {
    let mounted = true
    async function getCurrentUser() {
      try {
        const res = await fetch('/api/auth/session')
        const session = await res.json()
        if (!mounted) return
        if (session?.user?.id) {
          setUserId(session.user.id)
        } else {
          throw new Error('No user session found')
        }
      } catch (err) {
        console.error('Failed to get user session:', err)
        setError('You must be logged in to create products')
      } finally {
        if (mounted) setLoadingUser(false)
      }
    }
    getCurrentUser()
    return () => {
      mounted = false
    }
  }, [])

  // robust id generator
  function makeId() {
    if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
      return (crypto as any).randomUUID()
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files ? Array.from(e.target.files) : []
    if (selected.length === 0) return

    // combine existing + new but cap to 4
    const combinedFileList = [...files.map((f) => f.file), ...selected].slice(0, 4)

    // Validate types & size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const invalid = selected.find((f) => !allowedTypes.includes(f.type))
    if (invalid) {
      setError('Invalid file type. Allowed: JPEG, PNG, GIF, WebP')
      return
    }
    const tooLarge = selected.find((f) => f.size > 5 * 1024 * 1024)
    if (tooLarge) {
      setError('One of the files is too large. Maximum size per file: 5MB.')
      return
    }

    // Build FileWithPreview: reuse existing preview/id when file metadata matches, else create new
    const newFiles: FileWithPreview[] = combinedFileList.map((f) => {
      const existing = files.find(
        (x) => x.file.name === f.name && x.file.size === f.size && x.file.lastModified === f.lastModified
      )
      if (existing) return existing
      const preview = URL.createObjectURL(f)
      previewsRef.current.push(preview)
      return { file: f, preview, id: makeId() }
    })

    setError(null)
    setFiles(newFiles)
    // reset input value to allow same file selection again
    e.currentTarget.value = ''
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const removed = prev.find((f) => f.id === id)
      if (removed) {
        try {
          URL.revokeObjectURL(removed.preview)
        } catch (e) {
          // ignore
        }
        // also remove from previewsRef
        previewsRef.current = previewsRef.current.filter((p) => p !== removed.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  // revoke any remaining previews on unmount
  useEffect(() => {
    return () => {
      for (const p of previewsRef.current) {
        try {
          URL.revokeObjectURL(p)
        } catch (e) {
          // ignore
        }
      }
      previewsRef.current = []
    }
  }, [])

  // upload single file using existing server upload route (/api/upload)
  // expects multipart/form-data and returns JSON { url: 'https://...' } on success
  async function uploadSingle(file: FileWithPreview): Promise<string> {
    const fd = new FormData()
    fd.append('image', file.file)

    try {
      setUploadProgress((p) => ({ ...p, [file.id]: 5 }))

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      })

      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || `Upload failed (${res.status})`)
      }

      const json = await res.json()
      const url = json?.url ?? (Array.isArray(json?.urls) ? json.urls[0] : null)
      if (!url) {
        throw new Error(json?.error ?? 'Upload returned no URL')
      }

      setUploadProgress((p) => ({ ...p, [file.id]: 100 }))
      // keep a bit of progress indicator before clearing
      setTimeout(() => {
        setUploadProgress((p) => {
          const copy = { ...p }
          delete copy[file.id]
          return copy
        })
      }, 700)

      return url
    } catch (err: any) {
      setUploadProgress((p) => ({ ...p, [file.id]: 0 }))
      console.error('uploadSingle error', err)
      throw err
    }
  }

  // form submit handler
  async function onSubmit(formData: FormValues) {
    setError(null)

    if (!userId) {
      setError('User authentication required. Please refresh the page.')
      return
    }

    if (files.length === 0) {
      setError('Please attach at least one image (up to 4).')
      return
    }

    try {
      // upload sequentially for simpler progress tracking
      const uploadedUrls: string[] = []
      for (const f of files) {
        setUploadProgress((p) => ({ ...p, [f.id]: 1 }))
        const url = await uploadSingle(f)
        uploadedUrls.push(url)
      }

      // Convert price to number
      const priceValue = parseFloat(formData.price)

      const payload = {
        title: formData.title,
        description: formData.description,
        price: priceValue,
        category: formData.category,
        images: uploadedUrls,
        userId,
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const body = await res.json()
      if (!res.ok) {
        throw new Error(body?.error ?? body?.message ?? `Server error ${res.status}`)
      }

      // success — navigate to dashboard list
      router.push('/dashboard/products')
    } catch (err: any) {
      console.error('Create product error', err)
      setError(err?.message ?? 'Failed to create product')
    }
  }

  if (loadingUser) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Create product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <Input {...register('title')} />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <Textarea {...register('description')} />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price *</label>
            <Input type="number" step="0.01" min="0" {...register('price')} />
            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <Input {...register('category')} />
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Images (1–4)</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            multiple
            onChange={onFilesChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">Max 4 images. Max size per file: 5MB.</p>

          {/* Previews */}
          <div className="mt-3 flex gap-2 flex-wrap">
            {files.map((f) => (
              <div key={f.id} className="relative w-28 h-28 rounded overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.preview} alt={f.file.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="absolute top-1 right-1 bg-white/90 p-1 rounded text-sm"
                >
                  ✕
                </button>

                {/* small progress bar if uploading */}
                {uploadProgress[f.id] !== undefined && (
                  <div className="absolute left-0 bottom-0 w-full">
                    <div className="w-full bg-gray-200 h-1">
                      <div
                        style={{ width: `${Math.min(uploadProgress[f.id] ?? 0, 100)}%` }}
                        className="h-1 bg-blue-600 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/products')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !userId} className="min-w-24">
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}
