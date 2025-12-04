// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find({})
      .select("name email role createdAt isActive")
      .sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("Admin users fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
