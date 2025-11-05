import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { getCurrentUser } from '@/lib/auth/session';
import { registerUser } from '@/lib/firebase/auth';

export async function GET(request) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const moderators = await User.find({
      role: { $in: ['platform_admin', 'platform_moderator'] }
    }).select('-firebaseUid').sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      moderators
    });

  } catch (error) {
    console.error('Get moderators error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Register user in Firebase
    const firebaseResult = await registerUser(email, password);
    if (!firebaseResult.success) {
      return NextResponse.json(
        { error: firebaseResult.error },
        { status: 400 }
      );
    }

    // Create moderator in database
    const moderator = await User.create({
      firebaseUid: firebaseResult.user.uid,
      email,
      name,
      role: 'platform_moderator'
    });

    return NextResponse.json({
      success: true,
      moderator: {
        _id: moderator._id,
        name: moderator.name,
        email: moderator.email,
        role: moderator.role,
        lastLogin: moderator.lastLogin,
        createdAt: moderator.createdAt
      }
    });

  } catch (error) {
    console.error('Create moderator error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}