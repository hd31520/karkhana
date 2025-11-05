import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Tenant from '@/lib/db/models/Tenant';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { subdomain } = params;

    const tenant = await Tenant.findOne({ 
      subdomain: subdomain.toLowerCase(),
      subscriptionStatus: 'active'
    }).select('businessName contactInfo');

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      tenant
    });

  } catch (error) {
    console.error('Get contact info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}