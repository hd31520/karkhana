// src/app/admin/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetcher } from '@/lib/fetcher'
import { ArrowUpRight, Users, Package, ShoppingBag, AlertCircle, Wallet } from 'lucide-react'

type AdminSummary = {
  users: number
  products: number
  pendingProducts: number
  orders: number
  totalRevenue: number
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetcher('/api/admin/summary')
      .then((data) => {
        if (!mounted) return
        setStats(data || null)
        setError(null)
      })
      .catch((err: any) => {
        if (!mounted) return
        setError(err?.error || 'Failed to load admin stats')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const formatCurrency = (amount: number | undefined) => {
    if (typeof amount !== 'number') return '—'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Top section */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
          Overview
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          High-level snapshot of users, products, orders and revenue across the entire platform.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              Total Users
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '…' : stats ? stats.users : '—'}
            </div>
            <p className="text-xs text-zinc-500">All registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-500" />
              Total Products
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '…' : stats ? stats.products : '—'}
            </div>
            <p className="text-xs text-zinc-500">All vendor listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Pending Approvals
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '…' : stats ? stats.pendingProducts : '—'}
            </div>
            <p className="text-xs text-zinc-500">Products waiting for review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-emerald-500" />
              Orders
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '…' : stats ? stats.orders : '—'}
            </div>
            <p className="text-xs text-zinc-500">Orders across all vendors</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue + placeholder for future charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-emerald-500" />
                Total Revenue
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? '…' : formatCurrency(stats?.totalRevenue)}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Sum of all successful payments across orders.
            </p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Activity snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">
              You can add charts here later (e.g., revenue over time, new users per month, top
              categories). For now this is a placeholder section in the admin overview.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
