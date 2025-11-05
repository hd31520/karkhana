import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/db/memoryDb';

export async function POST(request) {
  try {
    const { email, password, name, subdomain, businessName } = await request.json();

    // Demo mode - simulate successful registration without Firebase
    const tenant = memoryDb.tenants.create({
      subdomain: subdomain.toLowerCase(),
      businessName,
      ownerUid: `demo-${Date.now()}`,
      subscriptionStatus: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    const user = memoryDb.users.create({
      firebaseUid: `demo-${Date.now()}`,
      email,
      name,
      tenantId: tenant._id,
      role: 'boss'
    });

    return NextResponse.json({
      success: true,
      message: 'Demo registration successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subdomain: tenant.subdomain
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Demo registration failed' },
      { status: 500 }
    );
  }
}