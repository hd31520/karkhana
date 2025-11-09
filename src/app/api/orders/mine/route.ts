// src/app/api/orders/mine/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import { Order } from '@/models/Order'
import mongoose from 'mongoose'
import { getUserIdFromReq } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()
    const userId = await getUserIdFromReq(req)            // <-- await here
    if (!userId) return NextResponse.json({ message: 'Missing userId' }, { status: 401 })

    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json(orders)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ message: err.message || 'Error' }, { status: 500 })
  }
}
