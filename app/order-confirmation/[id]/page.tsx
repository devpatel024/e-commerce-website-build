'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getOrders, initializeStorage } from '@/lib/storage'
import { Order } from '@/lib/types'
import { useCart } from '@/context/CartContext'

export default function OrderConfirmation() {
  const params = useParams()
  const { removeOrderedItems } = useCart()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    initializeStorage()
    const orders = getOrders()
    const found = orders.find(o => o.id === params.id)
    setOrder(found || null)

    // Clear ordered products from cart
    if (found) {
      const orderedProductIds = found.items.map(item => item.productId)
      removeOrderedItems(orderedProductIds)
    }
  }, [params.id, removeOrderedItems])

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Order not found</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">✓</div>
            <h1 className="font-heading text-4xl font-bold mb-2">Order Confirmed</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase! Your order has been successfully placed.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              A confirmation email has been sent to <span className="font-semibold">{order.customer.email}</span>
            </p>
            <p className="text-xs text-accent font-semibold">
              Your cart has been cleared. Ready to shop again?
            </p>
          </div>

          {/* Order Details */}
          <div className="border border-border p-8 mb-8">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">Order Number</p>
                <p className="font-semibold text-lg">{order.id}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">Order Date</p>
                <p className="font-semibold text-lg">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">Status</p>
                <p className="font-semibold text-lg capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">Total Amount</p>
                <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-t border-border pt-8">
              <h2 className="font-semibold mb-4">Shipping Address</h2>
              <p className="text-muted-foreground">
                {order.customer.name}<br />
                {order.customer.address}<br />
                {order.customer.city}, {order.customer.postalCode}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold mb-6">Order Items</h2>
            <div className="border border-border divide-y divide-border">
              {order.items.map((item, index) => (
                <div key={index} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold mb-1">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                      {item.size && ` • Size: ${item.size}`}
                    </p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-secondary/30 p-6 mb-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(order.total / 1.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${(order.total - order.total / 1.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-secondary/50 border border-border p-6 mb-8">
            <h3 className="font-semibold mb-3">What&apos;s Next?</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>✓ Order received and confirmed</li>
              <li>→ We&apos;ll process your order within 24 hours</li>
              <li>→ You&apos;ll receive a tracking number via email</li>
              <li>→ Estimated delivery: 5-7 business days</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Link
                href="/account"
                className="flex-1 bg-accent text-white py-3 font-semibold text-center hover:bg-accent/90 transition-colors"
              >
                View Your Orders
              </Link>
              <Link
                href="/products"
                className="flex-1 bg-foreground text-background py-3 font-semibold text-center hover:bg-accent hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
            <Link
              href="/"
              className="border border-foreground py-3 font-semibold text-center hover:bg-foreground hover:text-background transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
