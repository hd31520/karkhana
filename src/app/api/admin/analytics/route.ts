// src/app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
// import Product from "@/models/Product";
// import Order from "@/models/Order";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.find({});

    // কিছু স্কিমা তে total না থেকে totalAmount / grandTotal ই থাকতে পারে
    const revenue = (orders as any[]).reduce((sum: number, o: any) => {
      const val =
        typeof o.total === "number"
          ? o.total
          : typeof o.totalAmount === "number"
          ? o.totalAmount
          : typeof o.grandTotal === "number"
          ? o.grandTotal
          : 0;

      return sum + val;
    }, 0);

    return NextResponse.json({
      users,
      products,
      revenue,
    });
  } catch (err: any) {
    console.error("Admin analytics error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load analytics" },
      { status: 500 }
    );
  }
}
