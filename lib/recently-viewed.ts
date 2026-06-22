// Recently Viewed Products Management
const RECENTLY_VIEWED_KEY = 'recently_viewed_products'
const MAX_ITEMS = 8

export interface RecentlyViewedItem {
  productId: string
  timestamp: number
}

/**
 * Add a product to recently viewed list
 */
export function addToRecentlyViewed(productId: string): void {
  try {
    const items = getRecentlyViewed()
    
    // Remove if already exists (to move it to the front)
    const filtered = items.filter(item => item.productId !== productId)
    
    // Add to front with current timestamp
    const updated = [
      { productId, timestamp: Date.now() },
      ...filtered,
    ].slice(0, MAX_ITEMS)
    
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('[v0] Failed to add to recently viewed:', error)
  }
}

/**
 * Get all recently viewed products
 */
export function getRecentlyViewed(): RecentlyViewedItem[] {
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('[v0] Failed to get recently viewed:', error)
    return []
  }
}

/**
 * Get recently viewed product IDs
 */
export function getRecentlyViewedIds(): string[] {
  return getRecentlyViewed().map(item => item.productId)
}

/**
 * Clear recently viewed history
 */
export function clearRecentlyViewed(): void {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY)
  } catch (error) {
    console.error('[v0] Failed to clear recently viewed:', error)
  }
}
