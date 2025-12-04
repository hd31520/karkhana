// src/app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetcher } from "@/lib/fetcher";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher("/api/admin/users")
      .then((res) => {
        setUsers(res.users || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Users
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage all users, roles & permissions.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-emerald-600" />
            All Users
          </CardTitle>

          <Button asChild size="sm">
            <Link href="/admin/users/create">Add User</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin w-6 h-6 text-emerald-600" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-center text-zinc-500 py-10">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-zinc-100 dark:bg-zinc-800">
                  <tr className="text-left">
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Role</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Joined</th>
                    <th className="p-3 border text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b">
                      <td className="p-3 border">{u.name}</td>
                      <td className="p-3 border">{u.email}</td>
                      <td className="p-3 border capitalize">
                        <Badge variant="outline">{u.role}</Badge>
                      </td>
                      <td className="p-3 border">
                        {u.isActive ? (
                          <Badge className="bg-emerald-600">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </td>
                      <td className="p-3 border">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 border text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/users/${u._id}`}>View</Link>
                        </Button>
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
