// src/app/admin/layout.tsx
'use client'

import React from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Admin Dashboard
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage users, products, approvals, salaries and analytics.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user && (
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  {user.name}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  {user.role || 'admin'}
                </span>
              </div>
            )}
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Back to site
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
