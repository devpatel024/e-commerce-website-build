'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCart } from '@/lib/storage'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const cart = getCart()
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    setCartCount(count)

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedCart = getCart()
      const updatedCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(updatedCount)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-wider font-heading">
            LUXE
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              Shop
            </Link>
            <Link
              href="/products?category=jewellery"
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              Jewellery
            </Link>
            <Link
              href="/products?category=clothes"
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              Clothes
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
            <Link
              href="/cart"
              className="relative inline-block text-sm font-medium transition-colors hover:text-accent"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground w-5 h-5 text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
