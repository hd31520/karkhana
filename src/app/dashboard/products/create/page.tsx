// src/app/dashboard/products/create/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

// Fixed schema without z.coerce.number()
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
  title: string;
  description: string;
  price: string; // Keep as string in form, convert to number in submit
  category: string;
}

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

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // Get current user ID
  useEffect(() => {
    async function getCurrentUser() {
      try {
        const res = await fetch('/api/auth/session')
        const session = await res.json()
        
        if (session?.user?.id) {
          setUserId(session.user.id)
        } else {
          throw new Error('No user session found')
        }
      } catch (err) {
        console.error('Failed to get user session:', err)
        setError('You must be logged in to create products')
      } finally {
        setLoadingUser(false)
      }
    }

    getCurrentUser()
  }, [])

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    
    // Validate file size client-side (5MB max)
    if (f && f.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.')
      setImageFile(null)
      setPreview(null)
      return
    }
    
    // Validate file type client-side
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (f && !allowedTypes.includes(f.type)) {
      setError('Invalid file type. Allowed: JPEG, PNG, GIF, WebP')
      setImageFile(null)
      setPreview(null)
      return
    }
    
    setImageFile(f)
    setError(null)
    if (f) setPreview(URL.createObjectURL(f))
    else setPreview(null)
  }

  async function uploadToImgBB(file: File) {
    const fd = new FormData()
    fd.append('image', file)

    setUploadProgress(0)
    
    try {
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        body: fd 
      })

      setUploadProgress(100)
      
      // Parse response
      const data = await res.json()

      if (!res.ok) {
        // Use the simplified error message from our improved API
        throw new Error(data.error || data.message || `Upload failed with status ${res.status}`)
      }

      if (!data.url) {
        throw new Error('No image URL returned from upload service')
      }

      return data.url
    } catch (err: any) {
      setUploadProgress(null)
      throw err
    } finally {
      setTimeout(() => setUploadProgress(null), 1000)
    }
  }

  async function onSubmit(data: FormValues) {
    setError(null)
    
    // Check if user ID is available
    if (!userId) {
      setError('User authentication required. Please refresh the page.')
      return
    }

    try {
      let imageUrl: string | null = null
      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile)
      }

      // Convert price from string to number for API
      const priceValue = parseFloat(data.price)

      const payload = {
        title: data.title,
        description: data.description,
        price: priceValue,
        category: data.category,
        images: imageUrl ? [imageUrl] : [],
        userId: userId, // Include the user ID
      }

      console.log('Submitting payload:', payload)

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || responseData.message || `Server returned ${res.status}`)
      }

      // success — navigate to listing
      router.push('/dashboard/products')
      router.refresh() // Refresh the router cache
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
            <Input 
              type="number" 
              step="0.01" 
              min="0"
              {...register('price')} 
            />
            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <Input {...register('category')} />
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input 
            type="file" 
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
            onChange={onFileChange} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP</p>
          
          {uploadProgress !== null && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
            </div>
          )}
          
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="preview" className="max-h-40 object-contain rounded border" />
            </div>
          )}
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
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !userId}
            className="min-w-24"
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}