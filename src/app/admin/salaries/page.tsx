"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

export default function AdminSalariesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher("/api/admin/salaries")
      .then((res) => setItems(res?.salaries || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Salaries</h3>
      <p className="text-sm text-zinc-500">Manage worker salary records.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Salary Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-emerald-600" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-sm text-zinc-500 py-8">
              No salary records.
            </p>
          ) : (
            items.map((s: any) => (
              <div
                key={s._id}
                className="border-b p-3 flex justify-between text-sm"
              >
                <div>
                  <div className="font-medium">{s.workerName}</div>
                  <div className="text-zinc-500">{s.month}</div>
                </div>
                <div className="font-semibold">৳{s.amount}</div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
