/**
 * Optimized storage queries that reduce data retrieval overhead
 * Equivalent to database query optimization with field selection
 */

import { Product, Order, CartItem } from './types'
import { getCart, getOrders, getProducts } from './storage'

/**
 * Get only essential product fields for listings
 * Reduces memory footprint compared to full product records
 */
export function getProductsOptimized(
  fields: (keyof Product)[] = ['id', 'name', 'price', 'image', 'category', 'subcategory', 'stock']
): Partial<Product>[] {
  const products = getProducts()
  return products.map(product => {
    const optimized: any = {}
    fields.forEach(field => {
      optimized[field] = product[field]
    })
    return optimized
  })
}

/**
 * Get product by ID with optional field selection
 */
export function getProductByIdOptimized(
  id: string,
  fields: (keyof Product)[] = ['id', 'name', 'price', 'image', 'description', 'stock', 'category']
): Partial<Product> | undefined {
  const products = getProducts()
  const product = products.find(p => p.id === id)

  if (!product) return undefined

  const optimized: any = {}
  fields.forEach(field => {
    optimized[field] = product[field]
  })
  return optimized
}

/**
 * Get multiple products by IDs efficiently
 * Avoids multiple searches through the entire products array
 */
export function getProductsByIdsOptimized(
  ids: string[],
  fields: (keyof Product)[] = ['id', 'name', 'price', 'image', 'stock']
): Partial<Product>[] {
  const products = getProducts()
  const idSet = new Set(ids)

  return products
    .filter(p => idSet.has(p.id))
    .map(product => {
      const optimized: any = {}
      fields.forEach(field => {
        optimized[field] = product[field]
      })
      return optimized
    })
}

/**
 * Calculate cart totals in parallel - avoids sequential lookups
 */
export function calculateCartTotalsOptimized(): {
  subtotal: number
  tax: number
  total: number
  itemCount: number
} {
  const cart = getCart()
  const products = getProducts()
  const productMap = new Map(products.map(p => [p.id, p]))

  let subtotal = 0
  let itemCount = 0

  // Single pass through cart
  cart.forEach(item => {
    const product = productMap.get(item.productId)
    if (product) {
      subtotal += product.price * item.quantity
      itemCount += item.quantity
    }
  })

  const tax = subtotal * 0.1
  const total = subtotal + tax

  return { subtotal, tax, total, itemCount }
}

/**
 * Get orders with optimized field selection
 */
export function getOrdersOptimized(
  fields: (keyof Order)[] = ['id', 'status', 'total', 'createdAt', 'customer']
): Partial<Order>[] {
  const orders = getOrders()
  return orders.map(order => {
    const optimized: any = {}
    fields.forEach(field => {
      optimized[field] = order[field]
    })
    return optimized
  })
}

/**
 * Get orders by user ID (filtered before processing)
 */
export function getOrdersByUserOptimized(
  userEmail: string,
  fields: (keyof Order)[] = ['id', 'status', 'total', 'createdAt']
): Partial<Order>[] {
  const orders = getOrders()
  return orders
    .filter(o => o.customer?.email === userEmail)
    .map(order => {
      const optimized: any = {}
      fields.forEach(field => {
        optimized[field] = order[field]
      })
      return optimized
    })
}

/**
 * Search products with indexed field selection for faster results
 */
export function searchProductsOptimized(
  query: string,
  fields: (keyof Product)[] = ['id', 'name', 'price', 'image']
): Partial<Product>[] {
  const products = getProducts()
  const lowerQuery = query.toLowerCase()

  return products
    .filter(
      p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    )
    .map(product => {
      const optimized: any = {}
      fields.forEach(field => {
        optimized[field] = product[field]
      })
      return optimized
    })
}

/**
 * Filter products by category with minimal field selection
 */
export function getProductsByCategoryOptimized(
  category: string,
  fields: (keyof Product)[] = ['id', 'name', 'price', 'image', 'subcategory']
): Partial<Product>[] {
  const products = getProducts()
  return products
    .filter(p => p.category === category)
    .map(product => {
      const optimized: any = {}
      fields.forEach(field => {
        optimized[field] = product[field]
      })
      return optimized
    })
}

/**
 * Memoization helper - cache product lookups
 */
let productCache: Map<string, Product> | null = null

export function getProductMapCached(): Map<string, Product> {
  if (!productCache) {
    const products = getProducts()
    productCache = new Map(products.map(p => [p.id, p]))
  }
  return productCache
}

export function invalidateProductCache() {
  productCache = null
}
