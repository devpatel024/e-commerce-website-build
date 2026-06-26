'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { CategoryRevenueData } from '@/lib/dashboard-analytics'

interface CategoryRevenueChartProps {
  data: CategoryRevenueData[]
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

export function CategoryRevenueChart({ data }: CategoryRevenueChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Revenue by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.percent}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `$${value}`}
            contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
