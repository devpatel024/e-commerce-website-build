import { Order, Product } from '@/lib/types'

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  uniqueCustomers: number
  prevPeriodRevenue: number
  prevPeriodOrders: number
}

export interface RevenueTrendData {
  date: string
  revenue: number
}

export interface CategoryRevenueData {
  name: string
  value: number
  percentage: number
}

export interface TopProductData {
  id: string
  name: string
  revenue: number
  units: number
}

export interface OrderStatusData {
  status: string
  count: number
}

export interface LowStockProduct extends Product {
  stockLevel: number
}

export function calculateDashboardMetrics(orders: Order[], dateRange?: { start: Date; end: Date }): DashboardMetrics {
  let filteredOrders = orders
  
  if (dateRange) {
    filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= dateRange.start && orderDate <= dateRange.end
    })
  }

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = filteredOrders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Calculate for previous period
  let prevFiltered = orders
  if (dateRange) {
    const daysDiff = Math.floor((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
    const prevStart = new Date(dateRange.start.getTime() - daysDiff * 24 * 60 * 60 * 1000)
    const prevEnd = new Date(dateRange.start)
    prevFiltered = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= prevStart && orderDate <= prevEnd
    })
  }

  const prevPeriodRevenue = prevFiltered.reduce((sum, order) => sum + order.total, 0)
  const prevPeriodOrders = prevFiltered.length

  // Unique customers (by email)
  const uniqueEmails = new Set(filteredOrders.map(o => o.customer.email))
  const uniqueCustomers = uniqueEmails.size

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    uniqueCustomers,
    prevPeriodRevenue,
    prevPeriodOrders,
  }
}

export function getRevenueTrend(orders: Order[], days: number = 30): RevenueTrendData[] {
  const data: { [key: string]: number } = {}
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    data[dateStr] = 0
  }

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
    if (orderDate in data) {
      data[orderDate] += order.total
    }
  })

  return Object.entries(data).map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Math.round(revenue * 100) / 100,
  }))
}

export function getCategoryRevenue(orders: Order[], products: Product[]): CategoryRevenueData[] {
  const categoryRevenue: { [key: string]: number } = {}

  orders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId)
      if (product) {
        const category = product.category || 'Other'
        categoryRevenue[category] = (categoryRevenue[category] || 0) + item.price * item.quantity
      }
    })
  })

  const total = Object.values(categoryRevenue).reduce((sum, val) => sum + val, 0)

  return Object.entries(categoryRevenue).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
    percentage: total > 0 ? Math.round((value / total) * 100) : 0,
  }))
}

export function getTopProducts(orders: Order[], products: Product[], limit: number = 5): TopProductData[] {
  const productStats: { [key: string]: { revenue: number; units: number; name: string } } = {}

  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productStats[item.productId]) {
        const product = products.find(p => p.id === item.productId)
        productStats[item.productId] = {
          revenue: 0,
          units: 0,
          name: product?.name || 'Unknown Product',
        }
      }
      productStats[item.productId].revenue += item.price * item.quantity
      productStats[item.productId].units += item.quantity
    })
  })

  return Object.entries(productStats)
    .map(([id, stats]) => ({
      id,
      name: stats.name,
      revenue: Math.round(stats.revenue * 100) / 100,
      units: stats.units,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

export function getOrderStatusBreakdown(orders: Order[]): OrderStatusData[] {
  const statusCount: { [key: string]: number } = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  }

  orders.forEach(order => {
    statusCount[order.status] = (statusCount[order.status] || 0) + 1
  })

  return Object.entries(statusCount).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
  }))
}

export function getLowStockProducts(products: Product[], threshold: number = 5): LowStockProduct[] {
  return products
    .filter(p => p.stock <= threshold)
    .map(p => ({ ...p, stockLevel: p.stock }))
    .sort((a, b) => a.stock - b.stock)
}

export function calculatePercentageChange(current: number, previous: number): { change: number; isPositive: boolean } {
  if (previous === 0) return { change: 0, isPositive: current >= 0 }
  const change = ((current - previous) / previous) * 100
  return { change: Math.round(change * 10) / 10, isPositive: change >= 0 }
}
