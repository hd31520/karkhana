'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Define a simple User type
export interface User {
  _id?: string
  name?: string
  email?: string
  image?: string
  role?: 'admin' | 'moderator' | 'user'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch current session user (if available)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session')
        if (res.ok) {
          const data = await res.json()
          if (data?.user) setUser(data.user)
        }
      } catch (err) {
        console.error('Session check failed', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const res = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const sessionRes = await fetch('/api/auth/session')
        const data = await sessionRes.json()
        if (data?.user) setUser(data.user)
        router.push('/dashboard')
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error('Login error', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Register new user
  const register = async (data: { name: string; email: string; password: string }): Promise<boolean> => {
    try {
      setLoading(true)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        // Auto login after register
        await login(data.email, data.password)
        return true
      }
      return false
    } catch (err) {
      console.error('Register error', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    try {
      setLoading(true)
      await fetch('/api/auth/signout', { method: 'POST' })
      setUser(null)
      router.push('/login')
    } catch (err) {
      console.error('Logout error', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
