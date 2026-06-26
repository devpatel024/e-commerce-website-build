'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { OrderStatusData } from '@/lib/dashboard-analytics'

interface OrderStatusChartProps {
  data: OrderStatusData[]
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Orders by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="status" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
          />
          <Legend />
          <Bar dataKey="count" fill="var(--accent)" name="Order Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
