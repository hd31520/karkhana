import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if Firebase environment variables are set
    const hasFirebaseConfig = 
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const hasFirebaseAdmin = 
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_CLIENT_EMAIL;

    return NextResponse.json({ 
      success: true, 
      message: 'Firebase configuration check',
      firebase: {
        clientConfig: hasFirebaseConfig ? '✅ Configured' : '❌ Missing',
        adminConfig: hasFirebaseAdmin ? '✅ Configured' : '❌ Missing',
        status: hasFirebaseConfig ? 'Ready for demo' : 'Not configured'
      },
      currentMode: 'DEMO_MODE - Using memory database',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Firebase test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      currentMode: 'DEMO_MODE - Using memory database',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}