'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuthContext } from '@/components/AuthProvider'

interface WishlistContextType {
  itemCount: number
  items: string[]
  isInWishlist: (productId: string) => boolean
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  getWishlist: () => string[]
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const { user } = useAuthContext()

  // Initialize from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const wishlistKey = user ? `luxe_wishlist_${user.id}` : 'luxe_wishlist_guest'
    const savedWishlist = localStorage.getItem(wishlistKey)
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (e) {
        console.log('[v0] Error parsing wishlist from localStorage:', e)
      }
    }
  }, [user])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (mounted && user) {
      const wishlistKey = `luxe_wishlist_${user.id}`
      localStorage.setItem(wishlistKey, JSON.stringify(items))
    } else if (mounted && !user) {
      localStorage.setItem('luxe_wishlist_guest', JSON.stringify(items))
    }
  }, [items, mounted, user])

  // Listen for storage changes from other tabs
  useEffect(() => {
    if (!mounted) return

    const handleStorageChange = (e: StorageEvent) => {
      const wishlistKey = user ? `luxe_wishlist_${user.id}` : 'luxe_wishlist_guest'
      if (e.key === wishlistKey && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue))
        } catch (err) {
          console.log('[v0] Error parsing wishlist from storage event:', err)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [mounted, user])

  const isInWishlist = useCallback((productId: string) => {
    return items.includes(productId)
  }, [items])

  const addToWishlist = useCallback((productId: string) => {
    setItems((prevItems) => {
      if (prevItems.includes(productId)) return prevItems
      return [...prevItems, productId]
    })
  }, [])

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((id) => id !== productId))
  }, [])

  const getWishlist = useCallback(() => {
    return items
  }, [items])

  return (
    <WishlistContext.Provider
      value={{
        itemCount: items.length,
        items,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        getWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
