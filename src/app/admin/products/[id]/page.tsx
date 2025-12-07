// src/app/admin/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

type ProductStatus = "pending" | "approved" | "rejected";

type AdminProductDetail = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  status: ProductStatus;
  featured?: boolean;
  paymentStatus?: "paid" | "unpaid" | "" | undefined;
  createdAt: string;
  updatedAt: string;
};

export default function AdminProductEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [product, setProduct] = useState<AdminProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ProductStatus>("pending");
  const [featured, setFeatured] = useState<"yes" | "no">("no");

  useEffect(() => {
    if (!productId) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    // প্রডাক্ট ডেটা public API থেকেও নিতে পারি, কিন্তু এখানে admin endpoint ব্যবহার করলাম
    fetcher(`/api/admin/products/${productId}`)
      .then((res) => {
        if (!mounted) return;
        if (!res?.product) {
          setError("Product not found");
          setProduct(null);
          return;
        }
        const p = res.product as AdminProductDetail;

        setProduct(p);
        setTitle(p.title || "");
        setDescription(p.description || "");
        setPrice(
          typeof p.price === "number" && !Number.isNaN(p.price)
            ? String(p.price)
            : ""
        );
        setCategory(p.category || "");
        setStatus(p.status || "pending");
        setFeatured(p.featured ? "yes" : "no");
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load product");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [productId]);

  const handleSave = async () => {
    if (!productId) return;

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      setError("Price must be a valid number");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: numericPrice,
          category,
          status,
          featured: featured === "yes",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to update product");
        return;
      }

      setSuccess("Product updated successfully");
      if (data.product) {
        const p = data.product as AdminProductDetail;
        setProduct(p);
      }
    } catch {
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>
        </Button>
        <p className="text-sm text-red-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Edit product
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Update product information, pricing and status.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form Card */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Product info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                {success}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Describe the product"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. furniture, clothing..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(val: ProductStatus) => setStatus(val)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Featured</Label>
              <Select
                value={featured}
                onValueChange={(val: "yes" | "no") => setFeatured(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Is featured?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meta card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge
                className={
                  product.status === "approved"
                    ? "bg-emerald-600"
                    : product.status === "pending"
                    ? "bg-amber-500"
                    : ""
                }
                variant={product.status === "rejected" ? "destructive" : "default"}
              >
                {product.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span>Payment</span>
              {product.paymentStatus === "paid" ? (
                <Badge className="bg-emerald-600">Paid</Badge>
              ) : product.paymentStatus === "unpaid" ? (
                <Badge variant="outline">Unpaid</Badge>
              ) : (
                <Badge variant="outline">N/A</Badge>
              )}
            </div>

            <div>
              <span className="text-zinc-500 block">Created</span>
              {new Date(product.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="text-zinc-500 block">Updated</span>
              {new Date(product.updatedAt).toLocaleString()}
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full mt-2"
            >
              <Link href={`/products/${product._id}`}>View public page</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
