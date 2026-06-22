'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getOrders, updateOrder, initializeStorage } from '@/lib/storage'
import { Order } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'
import { Eye } from 'lucide-react'

export default function AdminOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all')

  useEffect(() => {
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      router.push('/admin')
      return
    }

    initializeStorage()
    setOrders(getOrders())
  }, [router])

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrder(orderId, { status: newStatus })
    const updated = getOrders()
    setOrders(updated)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    router.push('/admin')
  }

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus)

  const statusColors: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  }

  const paymentStatusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
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
            className="py-4 px-4 border-b-2 border-transparent font-medium text-sm hover:border-foreground"
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
            className="py-4 px-4 border-b-2 border-foreground font-medium text-sm"
          >
            Orders
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold mb-8">Orders</h2>

        {/* Filter */}
        <div className="mb-6 flex gap-4">
          <div>
            <label className="text-sm font-medium mr-2">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Order['status'] | 'all')}
              className="px-4 py-2 border border-border bg-background text-foreground"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredOrders.length} orders
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="border border-border p-6 text-center text-muted-foreground">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="border border-border overflow-hidden">
                {/* Order Header */}
                <div className="bg-secondary/30 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="cursor-pointer hover:opacity-80 transition-opacity flex-1"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 items-center">
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Order ID</p>
                          <p className="font-semibold text-sm">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Customer</p>
                          <p className="font-semibold text-sm">{order.customer.name}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Total</p>
                          <p className="font-semibold text-sm">{formatPrice(order.total)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        {order.paymentStatus && (
                          <div>
                            <p className="text-xs uppercase text-muted-foreground font-semibold">Payment</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${paymentStatusColors[order.paymentStatus]}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Date</p>
                          <p className="font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded font-semibold hover:bg-accent transition-colors whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Order Details */}
                {expandedOrder === order.id && (
                  <div className="p-6 border-t border-border space-y-6">
                    {/* Items */}
                    <div>
                      <h3 className="font-semibold mb-4">Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.productName} x {item.quantity}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold mb-3">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.customer.name}<br />
                        {order.customer.address}<br />
                        {order.customer.city}, {order.customer.postalCode}<br />
                        Email: {order.customer.email}
                      </p>
                    </div>

                    {/* Status Update */}
                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold mb-3">Update Status</h3>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="px-4 py-2 border border-border bg-background text-foreground"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
