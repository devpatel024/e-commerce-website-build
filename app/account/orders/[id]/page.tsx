'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getOrders, getProductById, initializeStorage } from '@/lib/storage'
import { Order } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'
import { ArrowLeft, MapPin, Mail, Phone, Package, DollarSign, Truck, CheckCircle } from 'lucide-react'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Try to fetch from database first
        const response = await fetch(`/api/admin/orders`)
        const data = await response.json()
        
        if (data.success && data.data) {
          const orders = data.data
          const dbOrder = orders.find((o: any) => o.id === orderId)
          
          if (dbOrder) {
            // Transform database order to frontend type
            let items: any[] = []
            try {
              if (dbOrder.items) {
                items = typeof dbOrder.items === 'string' ? JSON.parse(dbOrder.items) : dbOrder.items
              }
            } catch (e) {
              console.log('[v0] Error parsing items')
            }

            const transformedOrder: Order = {
              id: dbOrder.id,
              createdAt: dbOrder.createdAt,
              status: dbOrder.status || 'pending',
              items: items || [],
              total: typeof dbOrder.total === 'string' ? parseFloat(dbOrder.total) : dbOrder.total,
              customer: {
                name: dbOrder.customerName,
                email: dbOrder.customerEmail,
                address: dbOrder.address,
                city: dbOrder.city,
                postalCode: dbOrder.postalCode,
                country: dbOrder.country,
              },
              userId: dbOrder.userId,
            }
            setOrder(transformedOrder)
            setLoading(false)
            return
          }
        }
      } catch (error) {
        console.log('[v0] Error fetching from database, falling back to localStorage')
      }

      // Fallback to localStorage
      initializeStorage()
      const orders = getOrders()
      const foundOrder = orders.find(o => o.id === orderId)
      setOrder(foundOrder || null)
      setLoading(false)
    }

    fetchOrder()
  }, [orderId])

  // Auto-sync order status every 5 seconds
  useEffect(() => {
    if (!order || loading) return

    const syncInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/admin/orders`)
        const data = await response.json()

        if (data.success && data.data) {
          const dbOrder = data.data.find((o: any) => o.id === orderId)
          if (dbOrder && dbOrder.status !== order.status) {
            // Status changed, update it
            let items: any[] = []
            try {
              if (dbOrder.items) {
                items = typeof dbOrder.items === 'string' ? JSON.parse(dbOrder.items) : dbOrder.items
              }
            } catch (e) {
              console.log('[v0] Error parsing items')
            }

            setOrder(prev => prev ? {
              ...prev,
              status: dbOrder.status,
              items: items || prev.items
            } : null)
          }
        }
      } catch (error) {
        // Silent fail on sync errors
        console.log('[v0] Sync error (non-critical)')
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(syncInterval)
  }, [order, orderId, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t find the order you&apos;re looking for.
              </p>
              <Link
                href="/account"
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusSteps = [
    { status: 'pending', label: 'Order Placed', icon: Package },
    { status: 'processing', label: 'Processing', icon: Package },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
  ]

  const statusIndex = statusSteps.findIndex(s => s.status === order.status)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Account
            </Link>
            <h1 className="text-4xl font-bold mb-2">Order Details</h1>
            <p className="text-muted-foreground">Order ID: {order.id}</p>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h2 className="font-heading text-xl font-bold mb-6">Order Status</h2>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index <= statusIndex
                const isCurrent = index === statusIndex

                return (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                        isCompleted
                          ? 'bg-accent text-white'
                          : 'bg-secondary text-muted-foreground'
                      } ${isCurrent ? 'ring-2 ring-accent ring-offset-2' : ''}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className={`text-xs font-semibold text-center ${
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Order Summary */}
            <div className="md:col-span-2 space-y-8">
              {/* Items */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-heading text-xl font-bold mb-4">Order Items</h2>
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
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
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
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Billing Summary */}
              <div className="bg-secondary/50 border border-border rounded-lg p-6">
                <h3 className="font-heading font-bold mb-4">Order Summary</h3>
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
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-heading font-bold mb-4">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{order.customer.email}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <a
                  href={`/api/orders/${order.id}/invoice`}
                  className="block w-full text-center bg-foreground text-background py-2 rounded font-semibold hover:bg-accent transition-colors"
                >
                  Download Invoice
                </a>
                <button
                  onClick={() => window.print()}
                  className="w-full border border-border text-foreground py-2 rounded font-semibold hover:border-foreground transition-colors"
                >
                  Print Order
                </button>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h3 className="font-heading font-bold mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about your order, please contact our support team.
            </p>
            <a href="mailto:support@ads.com" className="text-accent font-semibold hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
