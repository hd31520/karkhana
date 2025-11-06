// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/email-dev' // ← Use development email

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
    })

    // Generate verification token
    const verificationToken = await generateVerificationToken(email)
    
    // Send verification email (development mode - logs to console)
    await sendVerificationEmail(email, verificationToken.token)

    // Return user without password
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    }

    return NextResponse.json(
      { 
        message: 'User created successfully! Check your console for verification link.',
        user: userResponse,
        // Include verification URL in response for easy testing
        verificationUrl: `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken.token}&email=${encodeURIComponent(email)}`
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoError' && error.code === 11000) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}