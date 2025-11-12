// src/app/dashboard/products/create/[id]/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter, useParams } from 'next/navigation'

// Simple and compatible schema
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

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = (params as { id?: string })?.id
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', price: '', category: '' },
  })

  const [loading, setLoading] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get current user ID with multiple fallback options
    async function getCurrentUser() {
      try {
        console.log('Fetching user session...')
        const res = await fetch('/api/auth/session')
        
        if (!res.ok) {
          throw new Error(`Session fetch failed: ${res.status}`)
        }
        
        const session = await res.json()
        console.log('Session data:', session)
        
        // Try different possible locations for user ID
        const userIdentifier = 
          session?.user?.id || 
          session?.user?.email || 
          session?.id ||
          session?.userId ||
          session?.user?.name;
        
        if (userIdentifier) {
          console.log('Found user identifier:', userIdentifier)
          setUserId(userIdentifier)
        } else {
          console.warn('No user identifier found in session:', session)
          throw new Error('No user session found. Please log in.')
        }
      } catch (err) {
        console.error('Failed to get user session:', err)
        setError('You must be logged in to edit products')
        setLoading(false)
      }
    }

    if (!id) {
      setLoading(false)
      setError('Missing product id')
      return
    }

    // Load product data and user session
    async function loadData() {
      setLoading(true)
      setError(null)
      
      try {
        // Get user session first
        await getCurrentUser()
        
        // Then load product data
        console.log('Fetching product data for ID:', id)
        const productRes = await fetch(`/api/products/${id}`)
        
        if (!productRes.ok) {
          const errorText = await productRes.text().catch(() => 'Unknown error')
          throw new Error(`Failed to fetch product: ${productRes.status} - ${errorText}`)
        }
        
        const productData = await productRes.json()
        console.log('Product data received:', productData)
        
        const product = productData.product ?? productData
        
        if (!product) {
          throw new Error('Product not found in response')
        }
        
        if (!product.title || !product.description || product.price === undefined) {
          console.warn('Incomplete product data:', product)
        }
        
        setValue('title', product.title ?? '')
        setValue('description', product.description ?? '')
        setValue('price', product.price?.toString() ?? '0') // Convert number to string for form
        setValue('category', product.category ?? '')
        setCurrentImage(product.image ?? null)
        
        console.log('Form values set successfully')
      } catch (e) {
        console.error('Error loading product:', e)
        setError((e as Error).message || 'Failed to load product data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, setValue])

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
    if (f) {
      const objectUrl = URL.createObjectURL(f)
      setPreview(objectUrl)
    } else {
      setPreview(null)
    }
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
      
      const data = await res.json()

      if (!res.ok) {
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
      setError('User authentication required. Please refresh the page and ensure you are logged in.')
      return
    }

    // Validate all required fields are filled
    if (!data.title.trim() || !data.description.trim() || !data.category.trim()) {
      setError('Please fill in all required fields')
      return
    }

    try {
      let imageUrl = currentImage
      if (imageFile) {
        console.log('Uploading new image...')
        imageUrl = await uploadToImgBB(imageFile)
        console.log('Image uploaded successfully:', imageUrl)
      }

      // Convert price from string to number for API
      const priceValue = parseFloat(data.price)

      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        price: priceValue,
        category: data.category.trim(),
        image: imageUrl ?? null,
        userId: userId,
      }

      console.log('Submitting update payload:', payload)

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const responseData = await res.json()
      console.log('Update response:', { status: res.status, data: responseData })

      if (!res.ok) {
        // Provide more detailed error information
        const errorMessage = responseData.error || 
                           responseData.message || 
                           responseData.details ||
                           `Server returned ${res.status}`
        throw new Error(errorMessage)
      }

      console.log('Product updated successfully, redirecting...')
      router.push('/dashboard/products')
      router.refresh()
    } catch (err: any) {
      console.error('Update error:', err)
      setError(err?.message ?? 'Failed to update product. Please try again.')
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return
    
    if (!userId) {
      setError('User authentication required for deletion.')
      return
    }
    
    try {
      const res = await fetch(`/api/products/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result?.error || result?.message || 'Delete failed')
      }
      
      console.log('Product deleted successfully')
      router.push('/dashboard/products')
      router.refresh()
    } catch (e: any) {
      console.error('Delete error:', e)
      setError(e?.message || 'Failed to delete product')
    }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-4">Loading product data...</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <Input 
            {...register('title')} 
            placeholder="Enter product title"
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <Textarea 
            {...register('description')} 
            placeholder="Enter product description"
            rows={4}
          />
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
              placeholder="0.00"
            />
            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <Input 
              {...register('category')} 
              placeholder="Enter category"
            />
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
          
          <div className="mt-2">
            {preview ? (
              <div className="flex flex-col items-start gap-2">
                <img src={preview} alt="preview" className="max-h-40 object-contain rounded border" />
                <p className="text-xs text-gray-500">New image preview</p>
              </div>
            ) : currentImage ? (
              <div className="flex flex-col items-start gap-2">
                <img src={currentImage} alt="current" className="max-h-40 object-contain rounded border" />
                <p className="text-xs text-gray-500">Current product image</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No image selected</p>
            )}
          </div>
        </div>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              <strong>Debug Info:</strong> User ID: {userId ? `"${userId}"` : 'Not found'}, 
              Product ID: {id}, 
              Fields filled: {Object.keys(errors).length === 0 ? 'All' : 'Some missing'}
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm font-medium">Error: {error}</p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-red-700 text-xs mt-1">
                Check browser console for detailed error information.
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/dashboard/products')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isSubmitting || !userId}
          >
            Delete Product
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !userId}
            className="min-w-24 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}