'use client'

import Link from 'next/link'
import { useAuthContext } from './AuthProvider'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, LogOut, Menu, X, User, Heart } from 'lucide-react'
import { useState } from 'react'
import SearchBar from './SearchBar'

export default function Header() {
  const { user, logout } = useAuthContext()
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20 transition-smooth">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-smooth group">
            <div className="text-2xl font-bold tracking-wider font-heading group-hover:text-accent transition-colors">LUXE</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 flex-1 px-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Shop All
            </Link>
            <Link
              href="/products?category=jewellery"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Jewellery
            </Link>
            <Link
              href="/products?category=clothes"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clothes
            </Link>
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
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
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background hover:bg-accent transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-foreground text-background hover:bg-accent transition-colors text-sm font-medium"
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
              Shop All
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
      </div>
    </header>
  )
}
