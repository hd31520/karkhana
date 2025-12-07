// src/app/api/admin/products/[id]/status/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/database";
import { Product } from "@/models/Product";
// import Product from "@/models/Product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ProductStatus = "pending" | "approved" | "rejected";

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    const body = await request.json();

    const { status } = body as {
      status?: ProductStatus;
    };

    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    product.status = status;

    await product.save();

    return NextResponse.json({
      message: "Status updated successfully",
      product: {
        _id: product._id,
        title: product.title,
        price: product.price,
        status: product.status,
        paymentStatus: product.paymentStatus,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (err: any) {
    console.error("Admin product status update error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update product status" },
      { status: 500 }
    );
  }
}
