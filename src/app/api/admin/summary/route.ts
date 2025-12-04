// src/app/api/admin/summary/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import User from '@/models/User'
import { Product } from '@/models/Product'
import { Order } from '@/models/Order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    await connectToDatabase()

    // Optional: only admin allowed (you can relax this if needed)
    const session = await getServerSession(authOptions as any)
    const role = (session as any)?.user?.role
    if (!role || role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [users, products, pendingProducts, orders, revenueAgg] = await Promise.all([
      User.countDocuments({}),
      Product.countDocuments({}),
      Product.countDocuments({ status: 'pending' }),
      Order.countDocuments({}),
      Order.aggregate([
        { $match: { 'payment.status': 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ])

    const totalRevenue = revenueAgg[0]?.total || 0

    return NextResponse.json({
      users,
      products,
      pendingProducts,
      orders,
      totalRevenue,
    })
  } catch (err: any) {
    console.error('Admin summary error:', err)
    return NextResponse.json(
      { error: err?.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
