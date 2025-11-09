// src/app/api/salaries/mine/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
// import { Salary } from 'src/models/Salary';
import mongoose from 'mongoose';
import { getUserIdFromReq } from '@/lib/auth';
import { Salary } from '@/models/Salary';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getUserIdFromReq(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const rows = await Salary.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ 'period.year': -1, 'period.month': -1 }).lean();
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Error' }, { status: 500 });
  }
}
