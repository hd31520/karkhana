// src/components/admin/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const adminItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/approvals', label: 'Approvals' },
  { href: '/admin/salaries', label: 'Salaries' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/settings', label: 'Settings' },
]

type AdminSidebarProps = {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        // mobile: full width, desktop: 72, border সব সময়ই থাকবে
        'w-full md:w-72 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950',
        className
      )}
    >
      <div className="p-6">
        <h1 className="text-xl font-bold text-emerald-600">karkhana</h1>
        <p className="text-sm text-zinc-500 mt-1">Admin panel</p>

        <nav className="mt-6 space-y-1">
          {adminItems.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm transition-colors',
                  active
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-300'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-zinc-800'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/dashboard">Go to Seller Dashboard</Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}
