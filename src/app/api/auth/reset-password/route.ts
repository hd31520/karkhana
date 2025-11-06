// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import PasswordResetToken from '@/models/PasswordResetToken'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Find valid reset token
    const resetToken = await PasswordResetToken.findOne({
      token,
      expires: { $gt: new Date() }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Update user password
    const user = await User.findOne({ email: resetToken.email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      )
    }

    user.password = password
    await user.save()

    // Delete used reset token
    await PasswordResetToken.deleteOne({ token })

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}