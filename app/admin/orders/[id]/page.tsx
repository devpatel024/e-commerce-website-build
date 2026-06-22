'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getOrders, updateOrder, initializeStorage } from '@/lib/storage'
import { Order } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'
import { ArrowLeft, MapPin, Mail, Package, DollarSign } from 'lucide-react'

export default function AdminOrderDetail() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState<Order['status'] | ''>('')

  useEffect(() => {
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      router.push('/admin')
      return
    }

    initializeStorage()
    const orders = getOrders()
    const foundOrder = orders.find(o => o.id === orderId)
    
    if (foundOrder) {
      setOrder(foundOrder)
      setNewStatus(foundOrder.status)
    }
    setLoading(false)
  }, [orderId, router])

  const handleStatusUpdate = () => {
    if (order && newStatus && newStatus !== order.status) {
      updateOrder(order.id, { status: newStatus as Order['status'] })
      setOrder({ ...order, status: newStatus as Order['status'] })
    }
  }

  if (!typeof window) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <p className="text-muted-foreground">Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="text-4xl font-bold mb-2">Order Details</h1>
          <p className="text-muted-foreground">Manage and track this order</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Order Header */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Order ID</p>
                  <p className="text-2xl font-bold">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Date</p>
                  <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start pb-4 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                        {item.size && ` | Size: ${item.size}`}
                        {item.variant && ` | Variant: ${item.variant}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Unit Price: {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="text-foreground space-y-1">
                <p className="font-semibold">{order.customer.name}</p>
                <p>{order.customer.address}</p>
                <p>
                  {order.customer.city}, {order.customer.postalCode}
                </p>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Customer Contact
              </h2>
              <div>
                <p className="font-semibold">{order.customer.email}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Total */}
            <div className="bg-secondary/50 border border-border rounded-lg p-6">
              <h3 className="font-heading font-bold mb-4">Order Total</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.total * 0.9)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>{formatPrice(order.total * 0.1)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-accent text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Status Management */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-heading font-bold mb-4">Order Status</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                    Current Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                    className="w-full px-3 py-2 border border-border bg-background text-foreground rounded focus:outline-none focus:border-accent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                {newStatus !== order.status && (
                  <button
                    onClick={handleStatusUpdate}
                    className="w-full bg-accent text-white py-2 rounded font-semibold hover:bg-accent/90 transition-colors"
                  >
                    Update Status
                  </button>
                )}
              </div>
            </div>

            {/* Payment Status */}
            {order.paymentStatus && (
              <div className={`border rounded-lg p-6 ${
                order.paymentStatus === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : order.paymentStatus === 'pending'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <h3 className="font-heading font-bold mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Status
                </h3>
                <p className={`text-sm font-semibold ${
                  order.paymentStatus === 'completed'
                    ? 'text-green-800'
                    : order.paymentStatus === 'pending'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </p>
                {order.stripeSessionId && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Session ID: {order.stripeSessionId.substring(0, 20)}...
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full border border-border text-foreground py-2 rounded font-semibold hover:border-foreground transition-colors"
              >
                Print Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
