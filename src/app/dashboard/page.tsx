// src/app/dashboard/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetcher } from '@/lib/fetcher'

export default function DashboardPage() {
  const [stats, setStats] = useState<{ products: number; orders: number; pendingPayments: number } | null>(null)

  useEffect(() => {
    let mounted = true
    fetcher('/api/dashboard/summary').then((d) => {
      if (!mounted) return
      setStats(d || { products: 0, orders: 0, pendingPayments: 0 })
    }).catch(() => {})
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">Welcome back</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.products : '—'}</div>
            <p className="text-sm text-zinc-500">Total products you've listed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.orders : '—'}</div>
            <p className="text-sm text-zinc-500">Orders received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.pendingPayments : '—'}</div>
            <p className="text-sm text-zinc-500">Unsettled payments</p>
          </CardContent>
        </Card>
      </div>

      <section>
        <h4 className="text-md font-semibold text-zinc-800 dark:text-zinc-100 mb-3">Recent Activity</h4>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded shadow-sm border border-gray-100 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">Recent activity list will appear here. (Implement /api/dashboard/activity)</p>
        </div>
      </section>
    </div>
  )
}
