// src/components/shared/Navbar.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/contexts/auth-context'
// import { useAuth } from '@/contexts/auth-context'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Featured', href: '/products/featured' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold">
                K
              </div>
              <span className="font-semibold text-lg">Karkhana.shop</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm font-medium ${
                  pathname === n.href ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {!loading && user ? (
                <>
                  <Link href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen((s) => !s)}
                      className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50"
                      aria-expanded={profileOpen}
                    >
                      <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.image} alt={user.name ?? 'avatar'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-gray-600">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      <span className="hidden sm:inline-block text-sm">{user.name}</span>
                    </button>

                    {profileOpen && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-md py-1"
                        onMouseLeave={() => setProfileOpen(false)}
                      >
                        <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Profile
                        </Link>

                        {user.role === 'admin' && (
                          <Link href="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Admin Panel
                          </Link>
                        )}

                        <button
                          onClick={async () => {
                            setProfileOpen(false)
                            await logout()
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Sign up</Button>
                  </Link>
                  <ThemeToggle />
                </>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center">
              <ThemeToggle />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button
                    aria-label="Toggle menu"
                    className="p-2 rounded-md inline-flex items-center justify-center text-gray-700 hover:bg-gray-100"
                  >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <SheetHeader>
                    <div className="flex items-center justify-between w-full">
                      <SheetTitle>Karkhana</SheetTitle>
                      <button onClick={() => setIsOpen(false)} aria-label="Close menu" className="p-1 rounded-md hover:bg-gray-100">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </SheetHeader>

                  <div className="mt-4 space-y-4 px-2">
                    {navItems.map((n) => (
                      <Link
                        key={n.href}
                        href={n.href}
                        onClick={() => setIsOpen(false)}
                        className={`block text-base font-medium px-2 py-2 rounded-md ${
                          pathname === n.href ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                        }`}
                      >
                        {n.label}
                      </Link>
                    ))}

                    <div className="pt-4 border-t">
                      {!loading && user ? (
                        <>
                          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block text-gray-700">
                            Dashboard
                          </Link>
                          <button
                            onClick={async () => {
                              setIsOpen(false)
                              await logout()
                            }}
                            className="block text-left w-full text-red-600 mt-2"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full">
                            <Button variant="outline" className="w-full">Login</Button>
                          </Link>
                          <Link href="/register" onClick={() => setIsOpen(false)} className="block w-full mt-2">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Get Started</Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
