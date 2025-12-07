// src/components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const items = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/products', label: 'My Products' },
  { href: '/dashboard/products/create', label: 'Create Product' },
  { href: '/dashboard/salary', label: 'Salary' },
  { href: '/dashboard/orders', label: 'Orders' },
  { href: '/dashboard/profile', label: 'Profile' },
]

type SidebarProps = {
  className?: string
  onItemClick?: () => void // mobile drawer হলে click করলে hide করার জন্য
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'h-full w-full md:w-72 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950',
        className
      )}
    >
      <div className="p-6">
        <h1 className="text-xl font-bold text-emerald-600">karkhana</h1>
        <p className="text-sm text-zinc-500 mt-1">Seller dashboard</p>

        <nav className="mt-6 space-y-1">
          {items.map((it) => {
            const active =
              it.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(it.href)

            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={onItemClick}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm transition-colors',
                  active
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-300'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-zinc-800'
                )}
              >
                {it.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6">
          <Button asChild size="sm" className="w-full">
            <Link href="/products" onClick={onItemClick}>
              Browse Marketplace
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}
