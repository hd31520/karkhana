import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { getCurrentUser } from '@/lib/auth/session';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent deleting yourself
    if (params.id === user._id.toString()) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const moderator = await User.findOneAndDelete({
      _id: params.id,
      role: 'platform_moderator'
    });

    if (!moderator) {
      return NextResponse.json({ error: 'Moderator not found' }, { status: 404 });
    }

    // TODO: Also delete user from Firebase Auth

    return NextResponse.json({
      success: true,
      message: 'Moderator deleted successfully'
    });

  } catch (error) {
    console.error('Delete moderator error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}