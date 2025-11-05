import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, name, subdomain, businessName } = await request.json();

    // Basic validation
    if (!email || !password || !name || !subdomain || !businessName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Simulate successful registration
    return NextResponse.json({
      success: true,
      message: 'Registration successful (demo mode)',
      user: {
        id: 'demo-user-id',
        name: name,
        email: email,
        role: 'boss',
        subdomain: subdomain
      }
    });

  } catch (error) {
    console.error('Simple registration error:', error);
    return NextResponse.json(
      { error: 'Demo registration error' },
      { status: 500 }
    );
  }
}