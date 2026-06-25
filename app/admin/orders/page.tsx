'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/price-formatter'
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react'

interface OrderData {
  id: string
  userId: string
  status: string
  items: any
  subtotal: string
  total: string
  customerName: string
  customerEmail: string
  address: string
  city: string
  postalCode: string
  country: string
  createdAt: string
  updatedAt: string
}

export default function AdminOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderData[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/orders')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch orders')
      }

      setOrders(data.data || [])
    } catch (err) {
      console.error('[v0] Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId)
      setError(null)
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to update order')
      }

      // Update local state
      setOrders(orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)))
      setSuccessMessage(data.message)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('[v0] Error updating order:', err)
      setError(err instanceof Error ? err.message : 'Failed to update order')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const filteredOrders = orders.filter(order => {
    const statusMatch = filterStatus === 'all' || order.status === filterStatus
    const searchMatch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    return statusMatch && searchMatch
  })

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">LUXE Admin - Orders</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 text-sm font-medium border border-border hover:bg-secondary transition-colors"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Success</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        <h2 className="font-heading text-3xl font-bold mb-8">Orders Management</h2>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4 bg-secondary/30 p-6 rounded-lg">
          <div>
            <label className="text-sm font-medium mb-2 block">Search Orders</label>
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
            />
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <div>
              <label className="text-sm font-medium mr-2">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-border bg-background text-foreground"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium border border-border hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && orders.length === 0 && (
          <div className="border border-border p-12 text-center text-muted-foreground">
            <p>Loading orders...</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && filteredOrders.length === 0 ? (
          <div className="border border-border p-12 text-center text-muted-foreground">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const isExpanded = expandedOrder === order.id
              const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
              
              return (
                <div key={order.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full bg-secondary/30 p-6 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 flex-1">
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Order ID</p>
                          <p className="font-semibold text-sm font-mono">{order.id.slice(0, 8)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Customer</p>
                          <p className="font-semibold text-sm">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Total</p>
                          <p className="font-semibold text-sm">{formatPrice(parseFloat(order.total))}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold">Date</p>
                          <p className="font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Order Details */}
                  {isExpanded && (
                    <div className="p-6 border-t border-border space-y-6 bg-background">
                      {/* Items */}
                      <div>
                        <h3 className="font-semibold mb-4">Items ({Array.isArray(items) ? items.length : 0})</h3>
                        {Array.isArray(items) && items.length > 0 ? (
                          <div className="space-y-2">
                            {items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm p-2 bg-secondary/30 rounded">
                                <span>{item.name || item.productName || 'Item'} x {item.quantity || 1}</span>
                                <span>{formatPrice(parseFloat(item.price || 0) * (item.quantity || 1))}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No items recorded</p>
                        )}
                      </div>

                      {/* Totals */}
                      <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span>{formatPrice(parseFloat(order.subtotal))}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{formatPrice(parseFloat(order.total))}</span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="border-t border-border pt-6">
                        <h3 className="font-semibold mb-3">Shipping Address</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong className="text-foreground">{order.customerName}</strong></p>
                          <p>{order.address}</p>
                          <p>{order.city}, {order.postalCode}</p>
                          <p>{order.country}</p>
                          <p><strong className="text-foreground">Email:</strong> {order.customerEmail}</p>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="border-t border-border pt-6">
                        <h3 className="font-semibold mb-3">Update Status</h3>
                        <div className="flex gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingOrderId === order.id}
                            className="px-4 py-2 border border-border bg-background text-foreground disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {updatingOrderId === order.id && (
                            <span className="py-2 text-sm text-muted-foreground">Updating...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
