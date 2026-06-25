'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getOrders, clearCart } from '@/lib/storage'
import { Order } from '@/lib/types'
import { CheckCircle, Package, MapPin, Mail, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

function OrderConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    if (!sessionId) {
      setLoading(false)
      return
    }

    const processPayment = async () => {
      try {
        // Call webhook to process the payment
        const response = await fetch('/api/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'webhook',
            sessionId,
          }),
        })

        const data = await response.json()

        if (data.orderId) {
          // Find the newly created order
          const orders = getOrders()
          const foundOrder = orders.find(o => o.id === data.orderId)
          if (foundOrder) {
            setOrder(foundOrder)
            clearCart()
          }
        } else {
          // Try to find existing order by session ID
          const orders = getOrders()
          const foundOrder = orders.find(o => o.stripeSessionId === sessionId)
          if (foundOrder) {
            setOrder(foundOrder)
            clearCart()
          }
        }
      } catch (error) {
        console.error('Payment processing error:', error)
      } finally {
        setLoading(false)
      }
    }

    processPayment()
  }, [sessionId, mounted])

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn&apos;t find your order. If you believe this is an error, please contact support.
          </p>
          <Link
            href="/products"
            className="inline-block bg-foreground text-white px-8 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg mb-2">
            Thank you for your purchase. Your order has been received.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            A confirmation email with your order slip has been sent to <span className="font-semibold text-foreground">{order.customer.email}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Please check your inbox and spam folder. You can track your order from your account page.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-secondary rounded-lg border border-border p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Order Info */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Order Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono text-foreground">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Package className="w-4 h-4 text-blue-500" />
                    <span className="text-foreground capitalize">{order.status}</span>
                  </div>
                </div>
                {order.paymentStatus && (
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-foreground capitalize">{order.paymentStatus}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Info */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Shipping Address</h2>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                <div className="text-foreground">
                  <p className="font-medium">{order.customer.name}</p>
                  <p>{order.customer.address}</p>
                  <p>{order.customer.city}, {order.customer.postalCode}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                <a href={`mailto:${order.customer.email}`} className="text-blue-500 hover:underline">
                  {order.customer.email}
                </a>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-border pt-8 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-border pt-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${(order.total * 0.9).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="text-foreground">${(order.total * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <DollarSign className="w-5 h-5 text-foreground" />
              <span className="font-bold text-foreground text-2xl">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="px-8 py-3 bg-foreground text-white rounded-lg hover:bg-accent transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="px-8 py-3 bg-secondary text-foreground border border-border rounded-lg hover:bg-background transition-colors font-semibold"
          >
            View My Orders
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-center text-muted-foreground">
          <p>A confirmation email has been sent to {order.customer.email}</p>
          <p className="mt-2 text-sm">
            Questions? <a href="#" className="text-blue-500 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p>Loading...</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
