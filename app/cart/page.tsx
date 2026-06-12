'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getCart, removeFromCart, saveCart, getProductById, initializeStorage } from '@/lib/storage'
import { CartItem, Product } from '@/lib/types'

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartProducts, setCartProducts] = useState<Map<string, Product>>(new Map())

  useEffect(() => {
    initializeStorage()
    const items = getCart()
    setCartItems(items)

    // Load product details
    const products = new Map<string, Product>()
    items.forEach(item => {
      const product = getProductById(item.productId)
      if (product) {
        products.set(item.productId, product)
      }
    })
    setCartProducts(products)
  }, [])

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const updatedItems = [...cartItems]
    updatedItems[index].quantity = newQuantity
    setCartItems(updatedItems)
    saveCart(updatedItems)
  }

  const handleRemove = (index: number) => {
    const item = cartItems[index]
    removeFromCart(item.productId, item.size, item.variant)
    const updated = cartItems.filter((_, i) => i !== index)
    setCartItems(updated)
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const product = cartProducts.get(item.productId)
    return sum + (product?.price || 0) * item.quantity
  }, 0)

  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="font-heading text-3xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-muted-foreground mb-8">Your cart is empty</p>
          <Link
            href="/products"
            className="bg-foreground text-background px-6 py-2 font-medium hover:bg-accent hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
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
              <div className="space-y-6 border border-border p-6">
                {cartItems.map((item, index) => {
                  const product = cartProducts.get(item.productId)
                  if (!product) return null

                  return (
                    <div key={index} className="flex gap-6 border-b border-border pb-6 last:border-0">
                      <div className="relative w-24 h-24 bg-secondary/30 flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.subcategory}
                          {item.size && ` • Size: ${item.size}`}
                        </p>
                        <p className="font-semibold">${product.price}</p>
                      </div>

                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(index, item.quantity - 1)}
                            className="px-2 py-1 border border-border hover:bg-secondary"
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(index, item.quantity + 1)}
                            className="px-2 py-1 border border-border hover:bg-secondary"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold">${product.price * item.quantity}</p>
                        <button
                          onClick={() => handleRemove(index)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6">
                <Link
                  href="/products"
                  className="text-accent hover:text-foreground transition-colors"
                >
                  &larr; Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border p-6 sticky top-4">
                <h2 className="font-heading text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-foreground text-background py-3 font-semibold hover:bg-accent hover:text-white transition-colors mb-3"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => router.push('/products')}
                  className="w-full border border-foreground py-3 font-semibold hover:bg-foreground hover:text-background transition-colors"
                >
                  Continue Shopping
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
