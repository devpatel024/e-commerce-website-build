'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthContext } from '@/components/AuthProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { getOrders, getProducts, initializeStorage } from '@/lib/storage'
import { Order, Product } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'
import { calculateDashboardStats, DashboardStats } from '@/lib/analytics'
import { RevenueChart } from '@/components/charts/RevenueChart'
import { CategoryRevenueChart } from '@/components/charts/CategoryRevenueChart'
import { TopProductsChart } from '@/components/charts/TopProductsChart'
import { OrderStatusChart } from '@/components/charts/OrderStatusChart'
import { LowStockWidget } from '@/components/charts/LowStockWidget'
import {
  calculateDashboardMetrics,
  getRevenueTrend,
  getCategoryRevenue,
  getTopProducts,
  getOrderStatusBreakdown,
  getLowStockProducts,
  calculatePercentageChange,
} from '@/lib/dashboard-analytics'
import { TrendingUp, Package, Users, ShoppingCart, Download } from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuthContext()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null)
  const [revenueTrend, setRevenueTrend] = useState<any[]>([])
  const [categoryRevenue, setCategoryRevenue] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [orderStatus, setOrderStatus] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && user?.role === 'admin') {
      initializeStorage()
      const ordersData = getOrders()
      const productsData = getProducts()
      setOrders(ordersData)
      setProducts(productsData)
      setStats(calculateDashboardStats(ordersData, productsData))
      
      // Calculate new analytics
      setRevenueTrend(getRevenueTrend(ordersData, 30))
      setCategoryRevenue(getCategoryRevenue(ordersData, productsData))
      setTopProducts(getTopProducts(ordersData, productsData, 5))
      setOrderStatus(getOrderStatusBreakdown(ordersData))
      setLowStockProducts(getLowStockProducts(productsData, 5))
    }
  }, [user, isLoading])

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const convertToCSV = (data: any): string => {
    let csv = 'Dashboard Export\n'
    csv += `Export Date: ${new Date().toLocaleString()}\n\n`
    csv += 'Metrics Summary\n'
    csv += `Total Revenue,${stats?.totalRevenue}\n`
    csv += `Total Orders,${stats?.totalOrders}\n`
    csv += `Average Order Value,${stats?.averageOrderValue}\n`
    csv += `Unique Customers,${stats?.totalCustomers}\n\n`
    
    csv += 'Top Products\n'
    csv += 'Product Name,Revenue,Units Sold\n'
    topProducts.forEach((p: any) => {
      csv += `${p.name},${p.revenue},${p.units}\n`
    })
    
    return csv
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground mb-8">Welcome back! Here's a summary of your store performance.</p>

        {/* Alert for Pending Orders */}
        {orders.filter(o => o.status === 'pending').length > 0 && (
          <div className="mb-8 border-l-4 border-accent bg-accent/5 p-6 rounded-r">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">Action Required</h3>
                <p className="text-sm text-muted-foreground">
                  You have {orders.filter(o => o.status === 'pending').length} pending order{orders.filter(o => o.status === 'pending').length > 1 ? 's' : ''} waiting to be processed.
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="bg-accent text-white px-4 py-2 rounded font-semibold text-sm hover:bg-accent/90 transition-colors whitespace-nowrap ml-4"
              >
                Process Orders →
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Total Orders */}
          <div className="border border-border p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Orders</p>
                <p className="font-heading text-3xl font-bold">{stats?.totalOrders || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">{stats?.pendingOrders} pending</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-accent/30" />
            </div>
          </div>

          {/* Total Revenue */}
          <div className="border border-border p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-fade-in delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
                <p className="font-heading text-3xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</p>
                <p className="text-xs text-green-600 mt-2">+{(stats?.totalRevenue || 0).toFixed(0)} from orders</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600/30" />
            </div>
          </div>

          {/* Average Order Value */}
          <div className="border border-border p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-fade-in delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Avg Order Value</p>
                <p className="font-heading text-3xl font-bold">{formatPrice(stats?.averageOrderValue || 0)}</p>
                <p className="text-xs text-muted-foreground mt-2">Per transaction</p>
              </div>
              <Package className="w-8 h-8 text-blue-600/30" />
            </div>
          </div>

          {/* Total Customers */}
          <div className="border border-border p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-fade-in delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Unique Customers</p>
                <p className="font-heading text-3xl font-bold">{stats?.totalCustomers || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">Total registered</p>
              </div>
              <Users className="w-8 h-8 text-purple-600/30" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold mb-6">Analytics & Insights</h2>
          
          {/* Revenue Trend */}
          <div className="mb-8">
            <RevenueChart data={revenueTrend} />
          </div>

          {/* Category & Status Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <CategoryRevenueChart data={categoryRevenue} />
            <OrderStatusChart data={orderStatus} />
          </div>

          {/* Top Products */}
          <div className="mb-8">
            <TopProductsChart data={topProducts} />
          </div>

          {/* Low Stock Widget */}
          <div className="mb-8">
            <LowStockWidget products={lowStockProducts} />
          </div>

          {/* Export Button */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                const data = {
                  exportedAt: new Date().toISOString(),
                  metrics: stats,
                  orders: orders.length,
                  topProducts,
                  orderStatus,
                }
                const csv = convertToCSV(data)
                downloadCSV(csv, 'dashboard-export.csv')
              }}
              className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded font-semibold text-sm hover:bg-accent/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Dashboard Data
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-2xl font-bold">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-accent hover:text-foreground transition-colors text-sm"
            >
              View all →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="border border-border p-6 text-center text-muted-foreground">
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.slice(-5).reverse().map(order => (
                    <tr key={order.id} className="hover:bg-secondary/30">
                      <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                      <td className="px-6 py-4 text-sm">{order.customer.name}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/admin/products"
            className="border border-border p-6 hover:bg-secondary/30 transition-colors"
          >
            <h4 className="font-semibold mb-2">Manage Products</h4>
            <p className="text-sm text-muted-foreground">Add, edit, or delete products from your catalog</p>
          </Link>
          <Link
            href="/admin/orders"
            className="border border-border p-6 hover:bg-secondary/30 transition-colors"
          >
            <h4 className="font-semibold mb-2">View Orders</h4>
            <p className="text-sm text-muted-foreground">Manage customer orders and track shipments</p>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  )
}
