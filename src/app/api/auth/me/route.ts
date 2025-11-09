// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/models/User';
import { getUserIdFromReq } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = await getUserIdFromReq(req); // backward-compatible helper

    // If userId exists and is valid ObjectId -> fetch from DB
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId).lean();
      if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 });

      const { password, ...safe } = user as any;
      return NextResponse.json(safe);
    }

    // else try to return session user info (use typed Session)
    // getServerSession can be awkward in some setups so we cast the result to Session|null
    const session = (await getServerSession(authOptions as any)) as Session | null;

    if (session?.user) {
      // session.user should be serializable (id/email/name/role etc.)
      return NextResponse.json(session.user);
    }

    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || 'Error' }, { status: 500 });
  }
}
