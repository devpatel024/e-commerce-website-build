'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface CartItem {
  productId: string
  name: string
  price: number | string
  image: string
  quantity: number
  size?: string
  variant?: string
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  removeOrderedItems: (productIds: string[]) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedCart = localStorage.getItem('luxe_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.log('[v0] Error parsing cart from localStorage:', e)
      }
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('luxe_cart', JSON.stringify(items))
    }
  }, [items, mounted])

  // Listen for storage changes from other tabs
  useEffect(() => {
    if (!mounted) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'luxe_cart' && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue))
        } catch (err) {
          console.log('[v0] Error parsing cart from storage event:', err)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [mounted])

  const addToCart = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.productId === item.productId && i.size === item.size && i.variant === item.variant
      )

      if (existingItemIndex >= 0) {
        const newItems = [...prevItems]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity,
        }
        return newItems
      }

      return [...prevItems, item]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const removeOrderedItems = useCallback((productIds: string[]) => {
    setItems((prevItems) => 
      prevItems.filter((item) => !productIds.includes(item.productId))
    )
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, itemCount, addToCart, removeFromCart, updateQuantity, clearCart, removeOrderedItems }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
