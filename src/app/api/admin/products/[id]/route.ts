// src/app/api/admin/products/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/database";
import { Product } from "@/models/Product";
// import Product from "@/models/Product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ProductStatus = "pending" | "approved" | "rejected";

// GET /api/admin/products/[id]
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (err: any) {
    console.error("Admin get product error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id]
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    const body = await request.json();

    const {
      title,
      description,
      price,
      category,
      status,
      featured,
    } = body as {
      title?: string;
      description?: string;
      price?: number;
      category?: string;
      status?: ProductStatus;
      featured?: boolean;
    };

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // product কে any হিসেবেও রেফারেন্স রাখি, যাতে অতিরিক্ত ফিল্ড সেট করা যায়
    const p: any = product;

    if (typeof title === "string" && title.trim()) {
      product.title = title.trim();
    }

    if (typeof description === "string") {
      product.description = description;
    }

    if (typeof price === "number" && !Number.isNaN(price)) {
      product.price = price;
    }

    if (typeof category === "string" && category.trim()) {
      product.category = category.trim();
    }

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      product.status = status;
    }

    // এখানে টাইপে featured নেই, তাই p (any) ব্যবহার করছি
    if (typeof featured === "boolean") {
      p.featured = featured;
    }

    await product.save();

    return NextResponse.json({
      message: "Product updated successfully",
      product,
    });
  } catch (err: any) {
    console.error("Admin update product error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}
