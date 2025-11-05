import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Tenant from '@/lib/db/models/Tenant';
import User from '@/lib/db/models/User';
import { getCurrentUser } from '@/lib/auth/session';

// Get all tenants (admin only)
export async function GET(request) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const tenants = await Tenant.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Tenant.countDocuments();

    // Get user counts for each tenant
    const tenantsWithStats = await Promise.all(
      tenants.map(async (tenant) => {
        const userCount = await User.countDocuments({ tenantId: tenant._id });
        return {
          ...tenant.toObject(),
          userCount
        };
      })
    );

    return NextResponse.json({
      success: true,
      tenants: tenantsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get tenants error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}