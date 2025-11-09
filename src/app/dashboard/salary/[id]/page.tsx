// src/app/dashboard/salary/[id]/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetcher } from '@/lib/fetcher'

export default function SalaryDetailPage() {
  const params = useParams()
  const id = params?.id
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let mounted = true
    fetcher(`/api/salaries/${id}`).then((d) => { if (mounted) setData(d) }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!data) return <div>Salary not found</div>

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Salary Slip — {data.period.month}/{data.period.year}</h3>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded border">
        <p><strong>Gross:</strong> ৳{data.calculation.grossSalary}</p>
        <p><strong>Deductions:</strong> ৳{data.calculation.totalDeductions}</p>
        <p><strong>Net:</strong> ৳{data.calculation.netSalary}</p>

        <div className="mt-4">
          <h4 className="font-semibold">Attendance</h4>
          <p>Working Days: {data.attendance.workingDays}</p>
          <p>Present: {data.attendance.presentDays}</p>
          <p>Overtime Hours: {data.attendance.overtimeHours}</p>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Payment</h4>
          <p>Status: <span className="capitalize">{data.payment.status}</span></p>
          {data.payment.paidAt && <p>Paid at: {new Date(data.payment.paidAt).toLocaleString()}</p>}
        </div>
      </div>
    </div>
  )
}
