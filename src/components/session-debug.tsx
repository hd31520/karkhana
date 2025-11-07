// components/session-debug.tsx
'use client'

import { useSession } from 'next-auth/react'

export function SessionDebug() {
  const { data: session, status } = useSession()
  
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md">
      <h3 className="font-bold mb-2">Session Debug:</h3>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}