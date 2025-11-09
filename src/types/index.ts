// src/types/index.ts
export interface Product {
  _id: string
  userId: string
  title: string
  description: string
  images: string[]
  price: number
  category: string
  status: 'pending' | 'approved' | 'rejected'
  paymentStatus: 'paid' | 'unpaid'
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}
