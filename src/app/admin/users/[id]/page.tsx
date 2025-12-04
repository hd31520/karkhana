// src/app/admin/users/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2, ArrowLeft } from 'lucide-react'
import { fetcher } from '@/lib/fetcher'

type UserRole = 'admin' | 'moderator' | 'user'

type AdminUserDetail = {
  _id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
  contactInfo?: {
    phone?: string
    address?: string
  }
}

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const userId = params.id

  const [user, setUser] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole>('user')
  const [isActive, setIsActive] = useState(true)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (!userId) return

    let mounted = true
    setLoading(true)
    setError(null)
    setSuccess(null)

    fetcher(`/api/admin/users/${userId}`)
      .then((res) => {
        if (!mounted) return
        if (!res?.user) {
          setError('User not found')
          setUser(null)
          return
        }

        const u = res.user as AdminUserDetail
        setUser(u)
        setName(u.name || '')
        setRole(u.role || 'user')
        setIsActive(Boolean(u.isActive))
        setPhone(u.contactInfo?.phone || '')
        setAddress(u.contactInfo?.address || '')
      })
      .catch(() => {
        if (!mounted) return
        setError('Failed to load user')
        setUser(null)
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [userId])

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          isActive,
          phone,
          address,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Failed to update user')
        return
      }

      setSuccess('User updated successfully')

      if (data.user) {
        setUser(data.user)
      }
    } catch {
      setError('Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push('/admin/users')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Button>
        <p className="text-sm text-red-500">User not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            User details
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            View and update this user&apos;s information, role and status.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push('/admin/users')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-md px-3 py-2">
                {success}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="User name"
                />
              </div>

              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>

              {/* Role Dropdown */}
              <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(val: UserRole) => setRole(val)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active / Inactive */}
              <div className="space-y-1">
                <Label>Status</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={(checked: boolean) =>
                      setIsActive(checked)
                    }
                  />
                  <span className="text-sm">
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Phone + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801..."
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meta card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Meta</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Role</span>
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Status</span>
              {user.isActive ? (
                <Badge className="bg-emerald-600">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>

            <div>
              <span className="text-zinc-500">Created</span>
              <p>{new Date(user.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <span className="text-zinc-500">Updated</span>
              <p>{new Date(user.updatedAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
