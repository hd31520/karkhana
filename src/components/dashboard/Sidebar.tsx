// src/components/dashboard/Sidebar.tsx
'use client'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const items = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/products', label: 'My Products' },
    { href: '/dashboard/products/create', label: 'Create Product' },
    { href: '/dashboard/salary', label: 'Salary' },
    { href: '/dashboard/orders', label: 'Orders' },
    { href: '/dashboard/profile', label: 'Profile' },
  ]

  return (
    <aside className="w-72 hidden md:block border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="p-6">
        <h1 className="text-xl font-bold text-emerald-600">Karkhana</h1>
        <p className="text-sm text-zinc-500 mt-1">Seller dashboard</p>

        <nav className="mt-6 space-y-1">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                'block px-3 py-2 rounded-md text-sm text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-zinc-800'
              )}
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6">
          {/* Using Button asChild is fine — Button will render the Link as its child.
              Make sure Link here is the Next.js Link (no <a> inside). */}
          <Button asChild size="sm">
            <Link href="/products">Browse Marketplace</Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}
