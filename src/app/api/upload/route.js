import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/db/memoryDb';

export async function GET() {
  try {
    // Test memory database
    const tenantCount = memoryDb.tenants.countDocuments();
    const productCount = memoryDb.products.countDocuments();
    
    return NextResponse.json({ 
      success: true, 
      message: 'API is working with memory database',
      memoryDb: {
        tenants: tenantCount,
        products: productCount,
        status: 'operational'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}