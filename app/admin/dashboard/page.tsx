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
import { TrendingUp, Package, Users, ShoppingCart } from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuthContext()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    if (!isLoading && user?.role === 'admin') {
      initializeStorage()
      const ordersData = getOrders()
      const productsData = getProducts()
      setOrders(ordersData)
      setProducts(productsData)
      setStats(calculateDashboardStats(ordersData, productsData))
    }
  }, [user, isLoading])

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">LUXE Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium border border-border hover:bg-secondary transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          <Link
            href="/admin/dashboard"
            className="py-4 px-4 border-b-2 border-foreground font-medium text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="py-4 px-4 border-b-2 border-transparent font-medium text-sm hover:border-foreground"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="py-4 px-4 border-b-2 border-transparent font-medium text-sm hover:border-foreground"
          >
            Orders
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold mb-8">Dashboard Overview</h2>

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
      </main>
    </div>
    </ProtectedRoute>
  )
}
