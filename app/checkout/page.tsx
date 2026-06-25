'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getCart, clearCart, getProductById, saveOrder, initializeStorage, validateCoupon, calculateDiscount, getCouponByCode } from '@/lib/storage'
import { CartItem, Order } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'
import { useAuthContext } from '@/components/AuthProvider'
import { useCart } from '@/context/CartContext'
import { useAddresses } from '@/context/AddressContext'
import { Loader2 } from 'lucide-react'
import { useCallback, useMemo } from 'react'

function CheckoutPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useAuthContext()
  const { clearCart: clearCartContext } = useCart()
  const { addresses, getDefaultAddress } = useAddresses()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'manual'>('manual')
  const [isGuestCheckout, setIsGuestCheckout] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponError, setCouponError] = useState('')

  useEffect(() => {
    // Load cart regardless of auth status - support guest checkout
    initializeStorage()
    const items = getCart()
    if (items.length === 0 && !authLoading) {
      router.push('/cart')
      return
    }
    setCartItems(items)

    // If user is logged in, pre-fill email and default address
    if (user && !isGuestCheckout) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        name: user.name || '',
      }))
      const defaultAddr = getDefaultAddress()
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id)
        setFormData(prev => ({
          ...prev,
          name: defaultAddr.name,
          address: defaultAddr.street,
          city: defaultAddr.city,
          postalCode: defaultAddr.postalCode,
        }))
      }
    }
  }, [user, authLoading, router, isGuestCheckout, getDefaultAddress])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleApplyCoupon = useCallback(() => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }
    const subtotal = cartItems.reduce((sum, item) => {
      const product = getProductById(item.productId)
      return sum + (product?.price || 0) * item.quantity
    }, 0)
    const result = validateCoupon(couponCode.toUpperCase(), subtotal)
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon)
      setCouponError('')
    } else {
      setAppliedCoupon(null)
      setCouponError(result.error || 'Invalid coupon code')
    }
  }, [couponCode, cartItems])

  const calculateTotal = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const product = getProductById(item.productId)
      return sum + (product?.price || 0) * item.quantity
    }, 0)
    const tax = subtotal * 0.1
    let discount = 0
    if (appliedCoupon) {
      discount = calculateDiscount(appliedCoupon, subtotal)
    }
    return Math.max(0, subtotal + tax - discount)
  }, [cartItems, appliedCoupon])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.postalCode) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)

    // Manual payment validation
    if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
      alert('Please fill in all payment details')
      setIsProcessing(false)
      return
    }

    // Save order immediately without delay
    const order: Order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      items: cartItems.map(item => {
        const product = getProductById(item.productId)
        return {
          productId: item.productId,
          productName: product?.name || '',
          quantity: item.quantity,
          price: product?.price || 0,
          size: item.size,
          variant: item.variant,
        }
      }),
      total: calculateTotal,
      customer: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      userId: user?.id,
      isGuest: !user,
      couponCode: appliedCoupon?.code,
      discount: appliedCoupon ? calculateDiscount(appliedCoupon, cartItems.reduce((sum, item) => {
        const product = getProductById(item.productId)
        return sum + (product?.price || 0) * item.quantity
      }, 0)) : 0,
    }

    saveOrder(order)
    clearCart()
    clearCartContext()
    // Ensure localStorage is cleared for this user's cart
    localStorage.removeItem('luxe_cart')
    setOrderPlaced(true)
    setIsProcessing(false)

    // Quick redirect with minimal delay for UX feedback
    setTimeout(() => {
      router.push(`/order-confirmation/${order.id}`)
    }, 300)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="bg-foreground text-background px-6 py-2 font-semibold hover:bg-accent transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-4 text-4xl">✓</div>
            <h1 className="font-heading text-3xl font-bold mb-2">Order Placed!</h1>
            <p className="text-muted-foreground mb-6">Redirecting to order confirmation...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const total = calculateTotal

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/cart" className="text-accent hover:text-foreground transition-colors mb-8">
            &larr; Back to Cart
          </Link>

          <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Checkout Form */}
            <div>
              {/* Guest Checkout Toggle */}
              {!user && (
                <div className="mb-6 p-4 bg-secondary/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    {isGuestCheckout ? 'Checking out as guest' : 'Have an account?'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsGuestCheckout(!isGuestCheckout)
                      setFormData(prev => ({ ...prev, email: '', name: '' }))
                    }}
                    className="text-sm font-medium text-accent hover:text-foreground transition-colors"
                  >
                    {isGuestCheckout ? 'Sign in instead' : 'Continue as guest'}
                  </button>
                </div>
              )}

              {/* Login Prompt for Non-Guests */}
              {!user && !isGuestCheckout && (
                <div className="mb-6 p-4 bg-secondary/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Sign in to save your address and track orders
                  </p>
                  <Link
                    href={`/auth/login?returnTo=${encodeURIComponent('/checkout')}`}
                    className="text-sm font-medium text-accent hover:text-foreground transition-colors"
                  >
                    Sign in here →
                  </Link>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Saved Addresses for Logged-in Users */}
                {user && addresses.length > 0 && (
                  <div className="border border-border p-6 bg-secondary/30">
                    <h3 className="font-semibold text-sm mb-3">Use Saved Address</h3>
                    <select
                      value={selectedAddressId || ''}
                      onChange={(e) => {
                        const id = e.target.value
                        if (id) {
                          const addr = addresses.find(a => a.id === id)
                          if (addr) {
                            setSelectedAddressId(id)
                            setFormData(prev => ({
                              ...prev,
                              name: addr.name,
                              address: addr.street,
                              city: addr.city,
                              postalCode: addr.postalCode,
                            }))
                          }
                        }
                      }}
                      className="w-full px-4 py-2 border border-border bg-background text-foreground focus:outline-none focus:border-foreground mb-2"
                    >
                      <option value="">Select a saved address...</option>
                      {addresses.map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {addr.name} - {addr.street}, {addr.city} {addr.isDefault ? '(Default)' : ''}
                        </option>
                      ))}
                    </select>
                    <Link
                      href="/account/addresses"
                      className="text-xs font-medium text-accent hover:text-foreground transition-colors"
                    >
                      Manage addresses →
                    </Link>
                  </div>
                )}

                {/* Shipping Information */}
                <div className="border border-border p-6">
                  <h2 className="font-semibold text-lg mb-4">Shipping Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                        className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        required
                        className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                          required
                          className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="10001"
                          required
                          className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="border border-border p-6 bg-secondary/30">
                  <h2 className="font-semibold text-lg mb-4">Promo Code</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Coupon Code (Optional)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value)
                            setCouponError('')
                          }}
                          placeholder="Enter promo code"
                          className="flex-1 px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                          disabled={!!appliedCoupon}
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={!!appliedCoupon || !couponCode.trim()}
                          className="px-4 py-2 bg-foreground text-background font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-sm text-red-500 mt-2">{couponError}</p>}
                      {appliedCoupon && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm font-medium text-green-800">
                            Coupon Applied: {appliedCoupon.code}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setAppliedCoupon(null)
                              setCouponCode('')
                              setCouponError('')
                            }}
                            className="text-xs text-green-600 hover:text-green-800 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="border border-border p-6">
                  <h2 className="font-semibold text-lg mb-4">Payment Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                          className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVC</label>
                        <input
                          type="text"
                          name="cardCVC"
                          value={formData.cardCVC}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                          className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-foreground text-background py-3 font-semibold hover:bg-accent hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="border border-border p-6 sticky top-4">
                <h2 className="font-heading text-lg font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  {cartItems.map((item, index) => {
                    const product = getProductById(item.productId)
                    if (!product) return null

                    return (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {product.name} x {item.quantity}
                        </span>
                        <span>{formatPrice(product.price * item.quantity)}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(total / 1.1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{formatPrice(total - total / 1.1)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="text-muted-foreground">Discount ({appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`})</span>
                      <span>-{formatPrice(calculateDiscount(appliedCoupon, cartItems.reduce((sum, item) => {
                        const product = getProductById(item.productId)
                        return sum + (product?.price || 0) * item.quantity
                      }, 0)))}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t border-border pt-3">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  )
}
