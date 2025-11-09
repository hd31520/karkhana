// src/app/dashboard/layout.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Dashboard</h2>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-4">
              <Link href="/dashboard" className="text-sm text-zinc-600 dark:text-zinc-300">Overview</Link>
              <Link href="/dashboard/products" className="text-sm text-zinc-600 dark:text-zinc-300">Products</Link>
            </nav>
            <Avatar className="w-9 h-9"/>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  )
}
