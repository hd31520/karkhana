import { NextResponse } from "next/server";
// import Salary from "@/models/Salary";
import { connectToDatabase } from "@/lib/database";
import { Salary } from "@/models/Salary";

export async function GET() {
  await connectToDatabase();
  const salaries = await Salary.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ salaries });
}
