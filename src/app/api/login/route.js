import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/db/memoryDb';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt:', { email });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For demo purposes, accept any password for demo user
    const user = memoryDb.users.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get tenant info
    const tenant = memoryDb.tenants.findOne({ _id: user.tenantId });

    return NextResponse.json({
      success: true,
      message: 'Login successful (demo mode)',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        subdomain: tenant?.subdomain,
        businessName: tenant?.businessName
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed: ' + error.message },
      { status: 500 }
    );
  }
}