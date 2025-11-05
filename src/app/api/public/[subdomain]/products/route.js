import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/db/memoryDb';

export async function GET(request, { params }) {
  try {
    const { subdomain } = await params;

    console.log('Fetching products for subdomain:', subdomain);

    // Get tenant by subdomain from memory database
    const tenant = memoryDb.tenants.findOne({ 
      subdomain: subdomain.toLowerCase()
    });

    if (!tenant) {
      console.log('Tenant not found for subdomain:', subdomain);
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Get products for this tenant
    const products = memoryDb.products.find({ 
      tenantId: tenant._id,
      isActive: true 
    });

    console.log(`Found ${products.length} products for tenant:`, tenant.businessName);

    return NextResponse.json({
      success: true,
      products: products,
      tenant: {
        businessName: tenant.businessName,
        contactInfo: tenant.contactInfo || {}
      }
    });

  } catch (error) {
    console.error('Get public products error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}