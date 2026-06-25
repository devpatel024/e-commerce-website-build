import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  trend?: {
    direction: 'up' | 'down'
    percentage: number
  }
  icon?: React.ReactNode
}

export default function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  return (
    <div className="bg-background border border-border p-6 rounded-lg hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="font-heading text-3xl font-bold mt-2">{value}</h3>
        </div>
        {icon && <div className="text-accent opacity-50">{icon}</div>}
      </div>

      {trend && (
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {trend.direction === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{trend.percentage}% from last month</span>
        </div>
      )}
    </div>
  )
}
