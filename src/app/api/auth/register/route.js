import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/db/memoryDb';

export async function POST(request) {
  try {
    const { email, password, name, subdomain, businessName } = await request.json();

    console.log('Registration attempt:', { email, name, subdomain, businessName });

    // Validate required fields
    if (!email || !password || !name || !subdomain || !businessName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if subdomain is available
    const existingTenant = memoryDb.tenants.findOne({ subdomain: subdomain.toLowerCase() });
    if (existingTenant) {
      return NextResponse.json(
        { error: 'Subdomain is already taken' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = memoryDb.users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create tenant in memory database
    const tenant = memoryDb.tenants.create({
      subdomain: subdomain.toLowerCase(),
      businessName,
      ownerUid: `demo-${Date.now()}`,
      subscriptionStatus: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Create user in memory database
    const user = memoryDb.users.create({
      firebaseUid: `demo-${Date.now()}`,
      email,
      name,
      tenantId: tenant._id,
      role: 'boss'
    });

    console.log('Demo registration completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now login to your dashboard.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subdomain: tenant.subdomain
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed: ' + error.message },
      { status: 500 }
    );
  }
}