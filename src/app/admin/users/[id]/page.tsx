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
import { Loader2, ArrowLeft } from 'lucide-react'
import { fetcher } from '@/lib/fetcher'

type UserRole = 'admin' | 'moderator' | 'user' | 'worker'

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
    const [isActive, setIsActive] = useState<boolean>(true)
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')

    useEffect(() => {
        if (!userId) return

        let mounted = true
        setLoading(true)

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
                setRole(u.role)
                setIsActive(Boolean(u.isActive))
                setPhone(u.contactInfo?.phone || '')
                setAddress(u.contactInfo?.address || '')
            })
            .catch(() => {
                if (!mounted) return
                setError('Failed to load user')
            })
            .finally(() => {
                if (mounted) setLoading(false)
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
            if (data.user) setUser(data.user)
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
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">User details</h3>
                    <p className="text-sm text-zinc-500">
                        View and update this user&apos;s information, role and status.
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/admin/users')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Profile Info</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {error && <p className="text-red-500">{error}</p>}
                        {success && <p className="text-emerald-600">{success}</p>}

                        {/* BASIC INFO */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label>Name</Label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input value={user.email} disabled />
                            </div>

                            {/* ROLE SELECT */}
                            <div>
                                <Label role="role">Role</Label>
                                <Select
                                    value={role}
                                    onValueChange={(val: UserRole) => setRole(val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="moderator">Moderator</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="worker">Worker</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>

                            {/* ACTIVE STATUS — DROPDOWN (NO SWITCH) */}
                            <div>
                                <Label>Status</Label>
                                <Select
                                    value={isActive ? "active" : "inactive"}
                                    onValueChange={(val: "active" | "inactive") =>
                                        setIsActive(val === "active")
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* CONTACT */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label>Phone</Label>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Address</Label>
                                <Input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* SAVE BUTTON */}
                        <div className="pt-4">
                            <Button disabled={saving} onClick={handleSave}>
                                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* META */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Meta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span>Role</span>
                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        </div>

                        <div className="flex justify-between">
                            <span>Status</span>
                            {user.isActive ? (
                                <Badge className="bg-emerald-600">Active</Badge>
                            ) : (
                                <Badge variant="destructive">Inactive</Badge>
                            )}
                        </div>

                        <div>
                            <span className="text-zinc-500 block">Created</span>
                            {new Date(user.createdAt).toLocaleString()}
                        </div>

                        <div>
                            <span className="text-zinc-500 block">Updated</span>
                            {new Date(user.updatedAt).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
