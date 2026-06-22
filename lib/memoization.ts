import React, { useMemo, useCallback, useRef, useEffect } from 'react'
import { Product, CartItem } from './types'

/**
 * Memoized cart total calculation
 * Prevents recalculation on every render if cart items haven't changed
 */
export function useCartTotals(cartItems: CartItem[], getProductById: (id: string) => Product | undefined) {
  return useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const product = getProductById(item.productId)
      return sum + (product?.price || 0) * item.quantity
    }, 0)
    return {
      subtotal,
      tax: subtotal * 0.1,
      total: subtotal * 1.1,
    }
  }, [cartItems, getProductById])
}

/**
 * Memoized product filtering
 * Prevents filter recalculation if query and products haven't changed
 */
export function useFilteredProducts(
  products: Product[],
  category?: string,
  subcategory?: string,
  searchTerm?: string,
  minPrice: number = 0,
  maxPrice: number = 10000
) {
  return useMemo(() => {
    let filtered = products

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch) ||
          p.category.toLowerCase().includes(lowerSearch)
      )
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category)
    }

    if (subcategory && subcategory !== 'all') {
      filtered = filtered.filter(p => p.subcategory === subcategory)
    }

    filtered = filtered.filter(
      p => parseFloat(p.price.toString()) >= minPrice && parseFloat(p.price.toString()) <= maxPrice
    )

    return filtered
  }, [products, category, subcategory, searchTerm, minPrice, maxPrice])
}

/**
 * Stable callback wrapper
 * Ensures callback reference doesn't change unless dependencies actually change
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, deps)

  return useCallback((...args: any[]) => callbackRef.current(...args), []) as T
}

/**
 * Memoized sorted products
 * Prevents re-sorting if products and sort option haven't changed
 */
export function useSortedProducts(
  products: Product[],
  sortBy?: 'price-low' | 'price-high' | 'newest' | 'rating' | 'popular'
) {
  return useMemo(() => {
    const sorted = [...products]

    if (sortBy === 'price-low') {
      sorted.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()))
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()))
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => b.id.localeCompare(a.id))
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'popular') {
      sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    }

    return sorted
  }, [products, sortBy])
}

/**
 * Previous value hook - useful for detecting changes
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * Debounced value - prevents excessive re-renders during fast input changes
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Memoized product map for fast lookups
 */
export function useProductMap(products: Product[]) {
  return useMemo(() => new Map(products.map(p => [p.id, p])), [products])
}
