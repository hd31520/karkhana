// src/app/api/admin/products/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/database";
import { Product } from "@/models/Product";
// import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status"); // e.g. 'pending'

    const filter: Record<string, unknown> = {};

    if (status === "pending" || status === "approved" || status === "rejected") {
      filter.status = status;
    }

    const products = await Product.find(filter)
      .select("title price status paymentStatus createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (err: any) {
    console.error("Admin products fetch error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
