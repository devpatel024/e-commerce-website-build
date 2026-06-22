import { Order, Product } from './types'

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  pendingOrders: number
  shippedOrders: number
  deliveredOrders: number
  totalProducts: number
  outOfStockProducts: number
  totalCustomers: number
  revenueByCategory: Record<string, number>
  topProducts: Product[]
  recentOrders: Order[]
  orderStatusBreakdown: Record<string, number>
}

export function calculateDashboardStats(orders: Order[], products: Product[]): DashboardStats {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => {
    const orderTotal = typeof order.total === 'string' ? parseFloat(order.total) : order.total
    return sum + orderTotal
  }, 0)
  
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const totalProducts = products.length
  const outOfStockProducts = products.filter(p => p.stock === 0).length

  // Get unique customers
  const uniqueCustomers = new Set(orders.map(o => (o as any).customer?.email || (o as any).customerEmail)).size

  // Revenue by category
  const revenueByCategory: Record<string, number> = {}
  products.forEach(product => {
    revenueByCategory[product.category] = 0
  })
  orders.forEach(order => {
    if (order.items) {
      order.items.forEach((item: any) => {
        const product = products.find(p => p.id === item.productId)
        if (product) {
          const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price
          revenueByCategory[product.category] = (revenueByCategory[product.category] || 0) + (itemPrice * item.quantity)
        }
      })
    }
  })

  // Order status breakdown
  const orderStatusBreakdown = {
    pending: pendingOrders,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: shippedOrders,
    delivered: deliveredOrders,
  }

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    totalProducts,
    outOfStockProducts,
    totalCustomers: uniqueCustomers,
    revenueByCategory,
    topProducts: products.slice(0, 5),
    recentOrders: orders.slice(-5).reverse(),
    orderStatusBreakdown,
  }
}
