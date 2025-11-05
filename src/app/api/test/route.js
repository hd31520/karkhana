import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/db/memoryDb';

export async function GET() {
  try {
    const tenantCount = memoryDb.tenants.countDocuments();
    const productCount = memoryDb.products.countDocuments();
    const userCount = memoryDb.users.countDocuments();
    
    return NextResponse.json({ 
      success: true, 
      message: 'API is working with memory database',
      database: {
        tenants: tenantCount,
        products: productCount,
        users: userCount,
        status: 'operational'
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}