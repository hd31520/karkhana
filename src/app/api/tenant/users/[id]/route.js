import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { getCurrentUser } from '@/lib/auth/session';

// Update user
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !currentUser.tenantId || currentUser.role !== 'boss') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    const user = await User.findOneAndUpdate(
      {
        _id: params.id,
        tenantId: currentUser.tenantId._id
      },
      updates,
      { new: true, runValidators: true }
    ).select('-firebaseUid');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !currentUser.tenantId || currentUser.role !== 'boss') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent deleting yourself
    if (params.id === currentUser._id.toString()) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const user = await User.findOneAndDelete({
      _id: params.id,
      tenantId: currentUser.tenantId._id
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // TODO: Also delete user from Firebase Auth

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}