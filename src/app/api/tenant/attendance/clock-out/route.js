import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Attendance from '@/lib/db/models/Attendance';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(request) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser(request);
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: user._id,
      date: today
    });

    if (!attendance) {
      return NextResponse.json(
        { error: 'No clock-in record found for today' },
        { status: 400 }
      );
    }

    if (attendance.clockOut) {
      return NextResponse.json(
        { error: 'Already clocked out today' },
        { status: 400 }
      );
    }

    const clockOutTime = new Date();
    const hoursWorked = (clockOutTime - attendance.clockIn) / (1000 * 60 * 60); // hours

    attendance.clockOut = clockOutTime;
    attendance.hoursWorked = parseFloat(hoursWorked.toFixed(2));
    await attendance.save();

    return NextResponse.json({
      success: true,
      attendance
    });

  } catch (error) {
    console.error('Clock out error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}