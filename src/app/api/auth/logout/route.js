// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request) {
  try {
    // Check if Firebase Admin is properly initialized
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Authentication service not configured' },
        { status: 503 }
      );
    }

    const { idToken } = await request.json();
    
    if (idToken) {
      // Revoke the user's tokens
      await adminAuth.revokeRefreshTokens(idToken);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error with token revocation, still return success
    // as the client-side will clear the token anyway
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out (token clearance may be delayed)' 
    });
  }
}