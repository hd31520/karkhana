"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher("/api/admin/analytics")
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Analytics</h3>
      <p className="text-sm text-zinc-500">Business overview & metrics.</p>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              ৳{data?.revenue || 0}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {data?.users || 0}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products Listed</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {data?.products || 0}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
