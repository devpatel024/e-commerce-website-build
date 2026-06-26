'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TopProductData } from '@/lib/dashboard-analytics'

interface TopProductsChartProps {
  data: TopProductData[]
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const chartData = data.map(item => ({
    name: item.name.length > 20 ? item.name.substring(0, 17) + '...' : item.name,
    fullName: item.name,
    revenue: item.revenue,
    units: item.units,
  }))

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Top Selling Products</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" stroke="var(--muted-foreground)" />
          <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" width={190} />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Revenue']}
            contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
          />
          <Bar dataKey="revenue" fill="var(--accent)" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
