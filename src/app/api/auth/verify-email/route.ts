// src/app/api/auth/verify-email/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import VerificationToken from '@/models/VerificationToken'
import { sendWelcomeEmail } from '@/lib/email-dev' // ← Use development email

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Find valid verification token
    const verificationToken = await VerificationToken.findOne({
      token,
      expires: { $gt: new Date() }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Verify user email
    const user = await User.findOne({ email: verificationToken.identifier })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      )
    }

    user.emailVerified = new Date()
    await user.save()

    // Delete used verification token
    await VerificationToken.deleteOne({ token })

    // Send welcome email (development mode - logs to console)
    await sendWelcomeEmail(user.email, user.name)

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Verify email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}