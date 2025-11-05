import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Tenant from '@/lib/db/models/Tenant';
import { getCurrentUser } from '@/lib/auth/session';

// Update tenant status (admin only)
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscriptionStatus } = await request.json();

    const tenant = await Tenant.findByIdAndUpdate(
      params.id,
      { subscriptionStatus },
      { new: true, runValidators: true }
    );

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      tenant
    });

  } catch (error) {
    console.error('Update tenant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}