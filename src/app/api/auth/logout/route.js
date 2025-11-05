import { NextResponse } from 'next/server';
import { logoutUser } from '@/lib/firebase/auth';

export async function POST() {
  try {
    const result = await logoutUser();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Logged out successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Logout failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}