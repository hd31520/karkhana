import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/db/memoryDb';

export async function POST(request) {
  try {
    const { subdomain } = await request.json();

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain is required' },
        { status: 400 }
      );
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json({
        available: false,
        message: 'Subdomain can only contain lowercase letters, numbers, and hyphens'
      });
    }

    if (subdomain.length < 3) {
      return NextResponse.json({
        available: false,
        message: 'Subdomain must be at least 3 characters long'
      });
    }

    // Check reserved subdomains
    const reserved = ['www', 'admin', 'api', 'blog', 'help', 'support', 'mail'];
    if (reserved.includes(subdomain)) {
      return NextResponse.json({
        available: false,
        message: 'This subdomain is reserved'
      });
    }

    // Check if subdomain exists
    const existingTenant = memoryDb.tenants.findOne({ 
      subdomain: subdomain.toLowerCase() 
    });

    return NextResponse.json({
      available: !existingTenant,
      message: existingTenant ? 'Subdomain is already taken' : 'Subdomain is available'
    });

  } catch (error) {
    console.error('Check subdomain error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}