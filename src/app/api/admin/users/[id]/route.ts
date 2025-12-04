// src/app/api/admin/users/[id]/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import User from '@/models/User'

const allowedRoles = ['admin', 'moderator', 'user'] as const
type Role = (typeof allowedRoles)[number]

// Next.js validator এই ধরনের context expect করছে:
// { params: Promise<{ id: string }> }
type RouteContext = {
  params: Promise<{ id: string }>
}

// ----------------------
// GET /api/admin/users/[id]
// ----------------------
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectToDatabase()

    const { id } = await context.params

    const user = await User.findById(id).select(
      'name email role isActive createdAt updatedAt contactInfo'
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (err: any) {
    console.error('Admin get user error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// ----------------------
// PUT /api/admin/users/[id]
// ----------------------
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectToDatabase()

    const { id } = await context.params
    const body = await request.json()

    const {
      name,
      role,
      isActive,
      phone,
      address,
    } = body as {
      name?: string
      role?: Role
      isActive?: boolean
      phone?: string
      address?: string
    }

    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // basic fields
    if (typeof name === 'string' && name.trim()) {
      user.name = name.trim()
    }

    if (role) {
      user.role = role
    }

    if (typeof isActive === 'boolean') {
      user.isActive = isActive
    }

    // contactInfo IUser টাইপে নেই, তাই safe any-cast
    const u: any = user

    if (!u.contactInfo) {
      u.contactInfo = {}
    }

    if (typeof phone === 'string') {
      u.contactInfo.phone = phone
    }

    if (typeof address === 'string') {
      u.contactInfo.address = address
    }

    await user.save()

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        contactInfo: u.contactInfo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (err: any) {
    console.error('Admin update user error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to update user' },
      { status: 500 }
    )
  }
//   nn
}
