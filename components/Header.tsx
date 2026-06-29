'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthContext } from './AuthProvider'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { ShoppingBag, LogOut, Menu, X, User, Heart } from 'lucide-react'
import { useState } from 'react'
import SearchBar from './SearchBar'
import AnimatedLogo from './AnimatedLogo'

export default function Header() {
  const router = useRouter()
  const { user, logout } = useAuthContext()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gold-luxury/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <nav className="flex items-center justify-between h-20 transition-all duration-500">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-smooth group">
            <AnimatedLogo size="small" />
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center flex-1 px-8" />

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Wishlist Icon */}
            <button
              onClick={() => {
                if (!user) {
                  router.push('/auth/login')
                } else {
                  router.push('/wishlist')
                }
              }}
              className="relative p-2 text-muted-foreground transition-colors hover:text-foreground"
              title="My Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground w-5 h-5 text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-muted-foreground transition-colors hover:text-foreground"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground w-5 h-5 text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              className="p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary rounded-lg"
              title="My Account"
            >
              <User className="w-6 h-6" />
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-foreground text-background hover:bg-gold-luxury hover:text-foreground transition-all duration-500 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center px-6 py-2 rounded-full bg-foreground text-background hover:bg-gold-luxury hover:text-foreground transition-all duration-500 text-sm font-medium"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/products?category=jewellery"
              className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Jewellery
            </Link>
            <Link
              href="/products?category=clothes"
              className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Clothes
            </Link>
            {user && (
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        )}

        {/* Category Chips Navigation - Below main nav */}
        <div className="hidden md:flex items-center gap-4 pb-6 overflow-x-auto scrollbar-hide">
          <Link
            href="/products"
            className="px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-gold-luxury/30 text-foreground bg-background hover:border-gold-luxury hover:bg-gold-light/20 transition-all duration-500"
          >
            All Products
          </Link>
          <Link
            href="/products?category=jewellery"
            className="px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-gold-luxury/30 text-foreground bg-background hover:border-gold-luxury hover:bg-gold-light/20 transition-all duration-500"
          >
            Jewellery
          </Link>
          <Link
            href="/products?category=clothes"
            className="px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-gold-luxury/30 text-foreground bg-background hover:border-gold-luxury hover:bg-gold-light/20 transition-all duration-500"
          >
            Clothes
          </Link>
          <Link
            href="/products?badge=new"
            className="px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-gold-luxury text-gold-dark bg-gold-light/10 hover:border-gold-dark hover:bg-gold-light/20 transition-all duration-500"
          >
            New Arrivals
          </Link>
          <div className="flex-1 md:flex items-center gap-3 hidden">
            <div className="w-px h-6 bg-border" />
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  )
}
