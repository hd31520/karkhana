import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Attendance from '@/lib/db/models/Attendance';
import { getCurrentUser } from '@/lib/auth/session';

// Clock in
export async function POST(request) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already clocked in today
    const existingAttendance = await Attendance.findOne({
      userId: user._id,
      date: today
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Already clocked in today' },
        { status: 400 }
      );
    }

    const attendance = await Attendance.create({
      userId: user._id,
      tenantId: user.tenantId._id,
      date: today,
      clockIn: new Date(),
      status: 'present'
    });

    return NextResponse.json({
      success: true,
      attendance
    });

  } catch (error) {
    console.error('Clock in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get attendance records
export async function GET(request) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month')) || new Date().getMonth() + 1;
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();

    let query = { tenantId: user.tenantId._id };
    
    // If user is boss or manager, they can see team attendance
    if (['boss', 'manager'].includes(user.role)) {
      if (user.role === 'manager') {
        // Manager can only see their team
        query.userId = { $in: await getTeamUserIds(user._id) };
      }
      // Boss can see all users in tenant
    } else {
      // Employee can only see their own attendance
      query.userId = user._id;
    }

    // Filter by month and year
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    query.date = {
      $gte: startDate,
      $lte: endDate
    };

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email role')
      .sort({ date: -1, clockIn: -1 });

    return NextResponse.json({
      success: true,
      attendance
    });

  } catch (error) {
    console.error('Get attendance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get team user IDs for managers
async function getTeamUserIds(managerId) {
  const User = require('@/lib/db/models/User').default;
  const teamUsers = await User.find({ reportsTo: managerId }).select('_id');
  return teamUsers.map(user => user._id);
}