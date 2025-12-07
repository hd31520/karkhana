// src/app/admin/layout.tsx
'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Button } from '@/components/ui/button'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleMobile = () => setMobileOpen((prev) => !prev)
  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top bar */}
      <header className="border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-zinc-700 shadow-sm hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 md:hidden"
              onClick={toggleMobile}
              aria-label="Toggle admin sidebar"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>

            <Link href="/admin" className="text-sm font-semibold">
              Karkhana Admin
            </Link>
          </div>

          <div className="hidden text-xs text-zinc-500 md:block">
            Admin Panel
          </div>
        </div>
      </header>

      {/* Desktop layout */}
      <div className="mx-auto flex max-w-6xl">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-72">
          <AdminSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Dark background */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMobile}
          />

          {/* Sidebar drawer */}
          <div className="relative h-full w-72 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
              <span className="text-sm font-semibold">Admin menu</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={closeMobile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <AdminSidebar onItemClick={closeMobile} />
          </div>
        </div>
      )}
    </div>
  )
}
