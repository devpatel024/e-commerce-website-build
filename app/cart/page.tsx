'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { X, Plus, Minus } from 'lucide-react'
import { formatPrice } from '@/lib/price-formatter'

export default function CartPage() {
  const router = useRouter()
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()

  const subtotal = items.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
    return sum + price * item.quantity
  }, 0)

  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold mb-4">Shopping Cart</h1>
            <p className="text-muted-foreground mb-8">Your cart is empty. Let&apos;s find something beautiful for you.</p>
            <Link
              href="/products"
              className="inline-block bg-foreground text-background px-6 py-3 font-semibold rounded-lg hover:bg-accent hover:text-white transition-colors"
            >
              Explore Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4 border border-border rounded-lg p-6 bg-card">
                {items.map((item) => {
                  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
                  const itemTotal = price * item.quantity

                  return (
                    <div key={item.productId} className="flex gap-4 p-4 bg-background rounded-lg border border-border hover:border-accent/50 transition-colors">
                      <div className="relative w-24 h-24 bg-secondary/30 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="font-semibold text-foreground hover:text-accent transition-colors">{item.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatPrice(price)} each
                        </p>
                        <p className="text-sm text-accent font-medium">
                          Total: {formatPrice(itemTotal)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:bg-secondary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 hover:bg-secondary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-accent hover:text-foreground transition-colors font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border rounded-lg p-6 bg-card sticky top-24 space-y-6">
                <h2 className="font-heading text-xl font-bold">Order Summary</h2>

                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium">{formatPrice(subtotal * 0.1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="flex justify-between font-heading text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal + subtotal * 0.1)}</span>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-foreground text-background py-3 px-4 font-semibold rounded-lg hover:bg-accent transition-all duration-200 hover:shadow-lg"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => router.push('/products')}
                  className="w-full border border-border text-foreground py-3 px-4 font-semibold rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() => clearCart()}
                  className="w-full border border-red-200 text-red-600 py-2 px-4 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
