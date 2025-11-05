import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { getCurrentUser } from '@/lib/auth/session';
import { registerUser } from '@/lib/firebase/auth';

// Get all users for current tenant
export async function GET(request) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await User.find({ tenantId: user.tenantId._id })
      .populate('reportsTo', 'name email')
      .select('-firebaseUid')
      .sort({ role: 1, name: 1 });

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Invite new user/employee
export async function POST(request) {
  try {
    await dbConnect();
    
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !currentUser.tenantId || currentUser.role !== 'boss') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, name, role, salary, reportsTo, position, phone } = await request.json();

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Email, name, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists in this tenant
    const existingUser = await User.findOne({ 
      email, 
      tenantId: currentUser.tenantId._id 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists in this organization' },
        { status: 400 }
      );
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';

    // Register user in Firebase
    const firebaseResult = await registerUser(email, tempPassword);
    if (!firebaseResult.success) {
      return NextResponse.json(
        { error: firebaseResult.error },
        { status: 400 }
      );
    }

    // Create user in database
    const user = await User.create({
      firebaseUid: firebaseResult.user.uid,
      email,
      name,
      tenantId: currentUser.tenantId._id,
      role: role.toLowerCase(),
      salary: salary ? parseFloat(salary) : 0,
      reportsTo: reportsTo || null,
      position: position || '',
      phone: phone || ''
    });

    // TODO: Send email invitation with temporary password

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        salary: user.salary,
        position: user.position,
        reportsTo: user.reportsTo
      },
      tempPassword // Remove this in production, send via email instead
    });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}