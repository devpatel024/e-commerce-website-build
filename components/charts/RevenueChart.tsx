'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { RevenueTrendData } from '@/lib/dashboard-analytics'

interface RevenueChartProps {
  data: RevenueTrendData[]
  title?: string
}

export function RevenueChart({ data, title = 'Revenue Trend (Last 30 Days)' }: RevenueChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
            formatter={(value) => `$${value}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="var(--accent)" 
            strokeWidth={2}
            dot={{ fill: 'var(--accent)' }}
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
