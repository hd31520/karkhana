// src/components/layout/public-layout.tsx
import { ReactNode } from 'react'
import PublicNavbar from '../shared/Navbar'
import PublicFooter from '../shared/Footer'


interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}