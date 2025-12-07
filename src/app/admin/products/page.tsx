// src/app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, PackageSearch } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

type ProductStatus = "pending" | "approved" | "rejected";

type PaymentStatus = "paid" | "unpaid" | "" | undefined;

type AdminProduct = {
  _id: string;
  title: string;
  price: number;
  status: ProductStatus;
  paymentStatus?: PaymentStatus;
  createdAt: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetcher("/api/admin/products")
      .then((res) => {
        if (!mounted) return;
        if (res?.error) {
          setError(res.error);
          return;
        }
        setProducts((res?.products as AdminProduct[]) || []);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load products");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const getStatusBadge = (status: ProductStatus) => {
    if (status === "approved") {
      return <Badge className="bg-emerald-600">Approved</Badge>;
    }
    if (status === "pending") {
      return <Badge className="bg-amber-500">Pending</Badge>;
    }
    return <Badge variant="destructive">Rejected</Badge>;
  };

  const getPaymentBadge = (paymentStatus: PaymentStatus) => {
    if (paymentStatus === "paid") {
      return <Badge className="bg-emerald-600">Paid</Badge>;
    }
    if (paymentStatus === "unpaid") {
      return <Badge variant="outline">Unpaid</Badge>;
    }
    return <Badge variant="outline">N/A</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Products
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            View and manage all products on Karkhana.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* ভবিষ্যতে admin create route থাকলে এখানে লিংক দিতে পারো */}
          <Button asChild variant="outline" size="sm">
            <Link href="/products">View public catalog</Link>
          </Button>
        </div>
      </div>

      {/* Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PackageSearch className="w-4 h-4 text-emerald-600" />
            All Products
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-500 text-center py-8">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">
              No products found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-zinc-100 dark:bg-zinc-800">
                  <tr className="text-left">
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Price</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Payment</th>
                    <th className="p-3 border">Created</th>
                    <th className="p-3 border text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p: AdminProduct) => (
                    <tr key={p._id} className="border-b">
                      <td className="p-3 border max-w-xs truncate">
                        {p.title}
                      </td>
                      <td className="p-3 border">
                        {typeof p.price === "number"
                          ? `${p.price.toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="p-3 border">{getStatusBadge(p.status)}</td>
                      <td className="p-3 border">
                        {getPaymentBadge(p.paymentStatus)}
                      </td>
                      <td className="p-3 border">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 border text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/products/${p._id}`}>View</Link>
                          </Button>
                          {/* ভবিষ্যতে approve/edit route করলে এখানে আরেকটা button add করতে পারো */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
