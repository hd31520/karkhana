import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/db/memoryDb';

export async function GET(request, { params }) {
  try {
    const { subdomain } = await params;

    console.log('Fetching info for subdomain:', subdomain);

    const tenant = memoryDb.tenants.findOne({ 
      subdomain: subdomain.toLowerCase()
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      tenant: {
        businessName: tenant.businessName,
        contactInfo: tenant.contactInfo || {}
      }
    });

  } catch (error) {
    console.error('Get tenant info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}