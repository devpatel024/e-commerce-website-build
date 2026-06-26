/**
 * Cache headers for Next.js static assets and API routes
 * These headers control browser caching behavior
 */

export const CACHE_HEADERS = {
  // Long-term cache for static assets (images, fonts, etc.)
  // Use fingerprinting or versioning in filename to invalidate
  STATIC_ASSETS: {
    'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
  },

  // Short-term cache for HTML pages
  HTML_PAGE: {
    'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1 hour
  },

  // API responses that can be cached briefly
  API_CACHE_SHORT: {
    'Cache-Control': 'public, max-age=60, s-maxage=60', // 1 minute
  },

  // API responses that should be cached longer
  API_CACHE_MEDIUM: {
    'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes
  },

  // Product data that changes infrequently
  PRODUCT_DATA: {
    'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1 hour
  },

  // User-specific data - no cache
  NO_CACHE: {
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },

  // Stale-while-revalidate pattern for better perceived performance
  STALE_WHILE_REVALIDATE: {
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=86400', // Cache 60s, stale for 1 day
  },
}

/**
 * Next.js response configuration for different content types
 */
export const NEXT_RESPONSE_CONFIG = {
  // For product listings - cache aggressively
  productList: {
    headers: CACHE_HEADERS.PRODUCT_DATA,
  },

  // For product details - cache with revalidation option
  productDetail: {
    headers: CACHE_HEADERS.PRODUCT_DATA,
  },

  // For user data - never cache
  userData: {
    headers: CACHE_HEADERS.NO_CACHE,
  },

  // For checkout - never cache sensitive data
  checkout: {
    headers: CACHE_HEADERS.NO_CACHE,
  },
}

/**
 * Image optimization settings for Next.js Image component
 */
export const IMAGE_CONFIG = {
  // Standard product images
  product: {
    priority: false,
    quality: 75, // Compress to 75% quality
    placeholder: 'blur', // Use blur while loading
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },

  // Hero/featured images
  hero: {
    priority: true, // Load immediately
    quality: 85,
    sizes: '100vw',
  },

  // Thumbnail images
  thumbnail: {
    priority: false,
    quality: 60, // Lower quality for thumbnails
    sizes: '(max-width: 640px) 50vw, 25vw',
  },
}

/**
 * Revalidation times for Next.js Data Cache
 */
export const REVALIDATION_TIMES = {
  // Static content rarely changes
  STATIC: 86400, // 24 hours

  // Product data changes moderately often
  PRODUCT: 3600, // 1 hour

  // User-specific data should be fresh
  USER: 300, // 5 minutes

  // Orders and checkout should be immediate
  CHECKOUT: 0, // No cache (revalidate immediately)

  // Search results should be reasonably fresh
  SEARCH: 600, // 10 minutes
}
