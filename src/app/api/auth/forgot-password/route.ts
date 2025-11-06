// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { generatePasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/email-dev' // ← Use development email

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const user = await User.findOne({ email: email.toLowerCase() })
    
    // Don't reveal if email exists or not
    if (!user) {
      return NextResponse.json(
        { message: 'If an account with that email exists, you will receive a password reset link.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = await generatePasswordResetToken(email)
    
    // Send reset email (development mode - logs to console)
    await sendPasswordResetEmail(email, resetToken.token)

    return NextResponse.json(
      { 
        message: 'If an account with that email exists, you will receive a password reset link.',
        // Include reset URL in response for easy testing
        resetUrl: `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken.token}`
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}