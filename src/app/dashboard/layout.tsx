'use client'

import { useState, type ReactNode } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Menu, X } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top bar */}
      <header className="border-b bg-white dark:bg-zinc-900">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            className="md:hidden p-2 border rounded-md"
            onClick={() => setOpen((p) => !p)}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <span className="text-sm font-semibold">Seller Dashboard</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-72">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile overlay sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full w-72 bg-white dark:bg-zinc-950">
            <Sidebar onItemClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
