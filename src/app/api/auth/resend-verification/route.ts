// src/app/api/auth/resend-verification/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/email'

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
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate new verification token
    const verificationToken = await generateVerificationToken(email)
    
    // Send verification email
    await sendVerificationEmail(email, verificationToken.token)

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}