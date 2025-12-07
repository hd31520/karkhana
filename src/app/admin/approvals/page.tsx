// src/app/admin/approvals/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, PackageSearch } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

type ProductStatus = "pending" | "approved" | "rejected";

type AdminPendingProduct = {
  _id: string;
  title: string;
  price: number;
  status: ProductStatus;
  paymentStatus?: "paid" | "unpaid" | "" | undefined;
  createdAt: string;
};

export default function AdminApprovalsPage() {
  const [products, setProducts] = useState<AdminPendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetcher("/api/admin/products?status=pending")
      .then((res) => {
        if (!mounted) return;
        if (res?.error) {
          setError(res.error);
          return;
        }
        setProducts((res?.products as AdminPendingProduct[]) || []);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load pending products");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleStatusChange = async (
    id: string,
    status: ProductStatus
  ) => {
    setActionLoadingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/admin/products/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to update status");
        return;
      }

      // pending list থেকে সরিয়ে দেই
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError("Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getPaymentBadge = (paymentStatus: AdminPendingProduct["paymentStatus"]) => {
    if (paymentStatus === "paid") return <Badge className="bg-emerald-600">Paid</Badge>;
    if (paymentStatus === "unpaid") return <Badge variant="outline">Unpaid</Badge>;
    return <Badge variant="outline">N/A</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Product Approvals
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Review and approve new products submitted by users.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/products">All products</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PackageSearch className="w-4 h-4 text-amber-500" />
            Pending Products
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
              No pending products right now.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-zinc-100 dark:bg-zinc-800">
                  <tr className="text-left">
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Price</th>
                    <th className="p-3 border">Payment</th>
                    <th className="p-3 border">Submitted</th>
                    <th className="p-3 border text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b">
                      <td className="p-3 border max-w-xs truncate">
                        {p.title}
                      </td>
                      <td className="p-3 border">
                        {typeof p.price === "number"
                          ? p.price.toFixed(2)
                          : "-"}
                      </td>
                      <td className="p-3 border">
                        {getPaymentBadge(p.paymentStatus)}
                      </td>
                      <td className="p-3 border">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 border text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                          >
                            <Link href={`/products/${p._id}`}>View</Link>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                            onClick={() => handleStatusChange(p._id, "approved")}
                            disabled={actionLoadingId === p._id}
                          >
                            {actionLoadingId === p._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex items-center gap-1"
                            onClick={() => handleStatusChange(p._id, "rejected")}
                            disabled={actionLoadingId === p._id}
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </Button>
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
