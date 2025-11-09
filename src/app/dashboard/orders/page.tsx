// src/app/dashboard/orders/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetcher } from '@/lib/fetcher'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetcher('/api/orders/mine').then((d) => { if (mounted) setOrders(d || []) }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">My Orders</h3>
      {loading ? <p>Loading...</p> : orders.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded border">
          <p className="text-zinc-600">You have no orders yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded border">
          <table className="w-full text-sm">
            <thead className="text-left text-zinc-600">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="border-t border-gray-100 dark:border-zinc-800">
                  <td className="p-3">{o.orderNumber}</td>
                  <td className="p-3">৳{o.totalAmount}</td>
                  <td className="p-3 capitalize">{o.status}</td>
                  <td className="p-3">
                    <Link href={`/orders/${o._id}`} className="text-emerald-600 hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
