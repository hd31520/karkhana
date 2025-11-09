// src/app/dashboard/profile/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetcher } from '@/lib/fetcher'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({ name: '', email: '', contactInfo: {} })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    fetcher('/api/auth/me').then((d) => { if (mounted) setProfile(d || profile) }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  async function save() {
    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })
    if (!res.ok) return alert('Update failed')
    alert('Profile updated')
    router.refresh()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded border space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Name</label>
          <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Email (cannot change)</label>
          <Input value={profile.email} disabled />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Phone</label>
          <Input value={profile.contactInfo?.phone || ''} onChange={(e) => setProfile({ ...profile, contactInfo: { ...profile.contactInfo, phone: e.target.value } })} />
        </div>

        <div className="flex justify-end">
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  )
}
