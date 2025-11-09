// src/app/dashboard/salary/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetcher } from '@/lib/fetcher'

interface SalaryRow {
  _id: string
  period: { month: number; year: number }
  netSalary: number
  status: 'paid' | 'pending'
}

export default function SalaryOverviewPage() {
  const [rows, setRows] = useState<SalaryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetcher('/api/salaries/mine').then((d) => { if (mounted) setRows(d || []) }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Salary Overview</h3>

      {loading ? <p className="text-sm text-zinc-500">Loading...</p> : (
        rows.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded border">
            <p className="text-zinc-600">No salary records yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded border">
            <table className="w-full text-sm">
              <thead className="text-left text-zinc-600">
                <tr>
                  <th className="p-3">Period</th>
                  <th className="p-3">Net Salary (BDT)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r._id} className="border-t border-gray-100 dark:border-zinc-800">
                    <td className="p-3">{r.period.month}/{r.period.year}</td>
                    <td className="p-3">৳{r.netSalary}</td>
                    <td className="p-3 capitalize">{r.status}</td>
                    <td className="p-3">
                      <Link href={`/dashboard/salary/${r._id}`} className="text-emerald-600 hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}
