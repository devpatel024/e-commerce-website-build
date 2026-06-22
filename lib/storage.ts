import { Product, Order, CartItem, UserPreferences, Coupon, BackInStockAlert, OrderNotification, SalesAnalytics } from './types'

const PRODUCTS_KEY = 'luxe_products'
const ORDERS_KEY = 'luxe_orders'
const CART_KEY = 'luxe_cart'
const WISHLIST_KEY = 'luxe_wishlist'
const FAVORITES_KEY = 'luxe_favorites'
const RECENTLY_VIEWED_KEY = 'luxe_recently_viewed'
const USER_PREFS_KEY = 'luxe_user_prefs'
const COUPONS_KEY = 'luxe_coupons'
const BACK_IN_STOCK_KEY = 'luxe_back_in_stock'
const NOTIFICATIONS_KEY = 'luxe_notifications'
const ANALYTICS_KEY = 'luxe_analytics'

// Initialize products in localStorage/memory
export function initializeStorage() {
  if (typeof window !== 'undefined') {
    const existing = localStorage.getItem(PRODUCTS_KEY)
    if (!existing) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SAMPLE_PRODUCTS))
    }
  }
}

// Product operations
export function getProducts(): Product[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(PRODUCTS_KEY)
    return data ? JSON.parse(data) : SAMPLE_PRODUCTS
  }
  return SAMPLE_PRODUCTS
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find(p => p.id === id)
}

export function saveProduct(product: Product): void {
  if (typeof window !== 'undefined') {
    const products = getProducts()
    const index = products.findIndex(p => p.id === product.id)
    if (index >= 0) {
      products[index] = product
    } else {
      products.push(product)
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  }
}

export function deleteProduct(id: string): void {
  if (typeof window !== 'undefined') {
    const products = getProducts().filter(p => p.id !== id)
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  }
}

// Order operations
export function getOrders(): Order[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(ORDERS_KEY)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function saveOrder(order: Order): void {
  if (typeof window !== 'undefined') {
    const orders = getOrders()
    orders.push(order)
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }
}

export function updateOrder(id: string, updates: Partial<Order>): void {
  if (typeof window !== 'undefined') {
    const orders = getOrders()
    const index = orders.findIndex(o => o.id === id)
    if (index >= 0) {
      orders[index] = { ...orders[index], ...updates }
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    }
  }
}

// Cart operations
export function getCart(): CartItem[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(CART_KEY)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }
}

export function addToCart(item: CartItem): void {
  if (typeof window !== 'undefined') {
    const cart = getCart()
    const existing = cart.find(
      c => c.productId === item.productId && c.size === item.size && c.variant === item.variant
    )
    if (existing) {
      existing.quantity += item.quantity
    } else {
      cart.push(item)
    }
    saveCart(cart)
  }
}

export function removeFromCart(productId: string, size?: string, variant?: string): void {
  if (typeof window !== 'undefined') {
    const cart = getCart()
    const filtered = cart.filter(
      c => !(c.productId === productId && c.size === size && c.variant === variant)
    )
    saveCart(filtered)
  }
}

export function clearCart(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CART_KEY)
  }
}

// Wishlist operations
export function getWishlist(): string[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(WISHLIST_KEY)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function addToWishlist(productId: string): void {
  if (typeof window !== 'undefined') {
    const wishlist = getWishlist()
    if (!wishlist.includes(productId)) {
      wishlist.push(productId)
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
    }
  }
}

export function removeFromWishlist(productId: string): void {
  if (typeof window !== 'undefined') {
    const wishlist = getWishlist().filter(id => id !== productId)
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().includes(productId)
}

// Favorites operations
export function getFavorites(): string[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(FAVORITES_KEY)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function addToFavorites(productId: string): void {
  if (typeof window !== 'undefined') {
    const favorites = getFavorites()
    if (!favorites.includes(productId)) {
      favorites.push(productId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  }
}

export function removeFromFavorites(productId: string): void {
  if (typeof window !== 'undefined') {
    const favorites = getFavorites().filter(id => id !== productId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }
}

export function isInFavorites(productId: string): boolean {
  return getFavorites().includes(productId)
}

// Recently viewed operations
export function getRecentlyViewed(): string[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(RECENTLY_VIEWED_KEY)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function addToRecentlyViewed(productId: string): void {
  if (typeof window !== 'undefined') {
    let viewed = getRecentlyViewed()
    viewed = viewed.filter(id => id !== productId)
    viewed.unshift(productId)
    viewed = viewed.slice(0, 20) // Keep last 20
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(viewed))
  }
}

// Coupon operations
export function getCoupons(): Coupon[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(COUPONS_KEY)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function saveCoupon(coupon: Coupon): void {
  if (typeof window !== 'undefined') {
    const coupons = getCoupons()
    const index = coupons.findIndex(c => c.id === coupon.id)
    if (index >= 0) {
      coupons[index] = coupon
    } else {
      coupons.push(coupon)
    }
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons))
  }
}

export function deleteCoupon(id: string): void {
  if (typeof window !== 'undefined') {
    const coupons = getCoupons().filter(c => c.id !== id)
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons))
  }
}

export function getCouponByCode(code: string): Coupon | undefined {
  const coupons = getCoupons()
  return coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive)
}

// Back-in-stock alert operations
export function getBackInStockAlerts(): BackInStockAlert[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(BACK_IN_STOCK_KEY)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function addBackInStockAlert(alert: BackInStockAlert): void {
  if (typeof window !== 'undefined') {
    const alerts = getBackInStockAlerts()
    alerts.push(alert)
    localStorage.setItem(BACK_IN_STOCK_KEY, JSON.stringify(alerts))
  }
}

export function removeBackInStockAlert(id: string): void {
  if (typeof window !== 'undefined') {
    const alerts = getBackInStockAlerts().filter(a => a.id !== id)
    localStorage.setItem(BACK_IN_STOCK_KEY, JSON.stringify(alerts))
  }
}

// Order notification operations
export function getNotifications(): OrderNotification[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(NOTIFICATIONS_KEY)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function saveNotification(notification: OrderNotification): void {
  if (typeof window !== 'undefined') {
    const notifications = getNotifications()
    notifications.push(notification)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
  }
}

// Analytics operations
export function getAnalytics(): SalesAnalytics[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(ANALYTICS_KEY)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function saveAnalytics(analytics: SalesAnalytics): void {
  if (typeof window !== 'undefined') {
    const allAnalytics = getAnalytics()
    const index = allAnalytics.findIndex(a => a.date === analytics.date)
    if (index >= 0) {
      allAnalytics[index] = analytics
    } else {
      allAnalytics.push(analytics)
    }
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(allAnalytics))
  }
}

// Sample products
export const SAMPLE_PRODUCTS: Product[] = [
  // Jewellery - Rings
  {
    id: 'ring-001',
    name: 'Emerald Engagement Ring',
    price: 2800,
    category: 'jewellery',
    subcategory: 'rings',
    description: 'Stunning emerald-cut diamond engagement ring with 18K gold band. Timeless elegance.',
    image: '/images/ring-1.png',
    stock: 5,
    sizes: ['6', '7', '8', '9', '10'],
  },
  {
    id: 'ring-002',
    name: 'Minimalist Gold Band',
    price: 580,
    category: 'jewellery',
    subcategory: 'rings',
    description: 'Simple yet sophisticated gold band. Perfect for everyday wear.',
    image: '/images/ring-2.png',
    stock: 12,
    sizes: ['6', '7', '8', '9', '10'],
  },
  {
    id: 'ring-003',
    name: 'Ruby Statement Ring',
    price: 1950,
    category: 'jewellery',
    subcategory: 'rings',
    description: 'Bold ruby center stone with diamond accents. Make a statement.',
    image: '/images/ring-3.png',
    stock: 4,
    sizes: ['6', '7', '8', '9', '10'],
  },
  {
    id: 'ring-004',
    name: 'Sapphire Cocktail Ring',
    price: 2100,
    category: 'jewellery',
    subcategory: 'rings',
    description: 'Luxurious sapphire cocktail ring with white diamond halo.',
    image: '/images/ring-4.png',
    stock: 6,
    sizes: ['6', '7', '8', '9', '10'],
  },

  // Jewellery - Necklaces
  {
    id: 'necklace-001',
    name: 'Pearl Pendant Necklace',
    price: 650,
    category: 'jewellery',
    subcategory: 'necklaces',
    description: 'Elegant pearl pendant on delicate gold chain. Versatile and timeless.',
    image: '/images/necklace-1.png',
    stock: 15,
  },
  {
    id: 'necklace-002',
    name: 'Diamond Solitaire Necklace',
    price: 1800,
    category: 'jewellery',
    subcategory: 'necklaces',
    description: 'Single brilliant diamond solitaire on 18K white gold chain.',
    image: '/images/necklace-2.png',
    stock: 8,
  },
  {
    id: 'necklace-003',
    name: 'Gold Layered Chain',
    price: 420,
    category: 'jewellery',
    subcategory: 'necklaces',
    description: 'Multi-strand layered gold chains. Modern and chic.',
    image: '/images/necklace-3.png',
    stock: 20,
  },
  {
    id: 'necklace-004',
    name: 'Emerald Chunky Choker',
    price: 920,
    category: 'jewellery',
    subcategory: 'necklaces',
    description: 'Bold emerald stone choker. Perfect for evening wear.',
    image: '/images/necklace-4.png',
    stock: 7,
  },

  // Jewellery - Earrings
  {
    id: 'earring-001',
    name: 'Diamond Stud Earrings',
    price: 1200,
    category: 'jewellery',
    subcategory: 'earrings',
    description: 'Classic diamond stud earrings. Essential for any collection.',
    image: '/images/earring-1.png',
    stock: 18,
  },
  {
    id: 'earring-002',
    name: 'Pearl Drop Earrings',
    price: 380,
    category: 'jewellery',
    subcategory: 'earrings',
    description: 'Elegant pearl drops on gold wires. Sophisticated and refined.',
    image: '/images/earring-2.png',
    stock: 16,
  },
  {
    id: 'earring-003',
    name: 'Sapphire Statement Drops',
    price: 850,
    category: 'jewellery',
    subcategory: 'earrings',
    description: 'Bold blue sapphire drops. Make an elegant statement.',
    image: '/images/earring-3.png',
    stock: 9,
  },
  {
    id: 'earring-004',
    name: 'Gold Hoop Earrings',
    price: 280,
    category: 'jewellery',
    subcategory: 'earrings',
    description: 'Timeless gold hoops. Versatile and always in style.',
    image: '/images/earring-4.png',
    stock: 22,
  },

  // Jewellery - Bracelets
  {
    id: 'bracelet-001',
    name: 'Diamond Tennis Bracelet',
    price: 3200,
    category: 'jewellery',
    subcategory: 'bracelets',
    description: 'Luxurious diamond tennis bracelet in 18K gold. A true classic.',
    image: '/images/bracelet-1.png',
    stock: 3,
  },
  {
    id: 'bracelet-002',
    name: 'Gold Bangle',
    price: 420,
    category: 'jewellery',
    subcategory: 'bracelets',
    description: 'Simple yet elegant gold bangle. Perfect everyday accessory.',
    image: '/images/bracelet-2.png',
    stock: 14,
  },
  {
    id: 'bracelet-003',
    name: 'Pearl Beaded Bracelet',
    price: 560,
    category: 'jewellery',
    subcategory: 'bracelets',
    description: 'Delicate pearl beads on silk thread. Understated luxury.',
    image: '/images/bracelet-3.png',
    stock: 11,
  },
  {
    id: 'bracelet-004',
    name: 'Ruby Link Bracelet',
    price: 1680,
    category: 'jewellery',
    subcategory: 'bracelets',
    description: 'Stunning ruby gemstones linked with diamonds.',
    image: '/images/bracelet-4.png',
    stock: 5,
  },

  // Clothes - Tops
  {
    id: 'top-001',
    name: 'Silk Charmeuse Blouse',
    price: 280,
    category: 'clothes',
    subcategory: 'tops',
    description: 'Luxurious silk blouse with elegant drape. Perfect for any occasion.',
    image: '/images/top-1.png',
    stock: 18,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'top-002',
    name: 'White Cotton T-Shirt',
    price: 95,
    category: 'clothes',
    subcategory: 'tops',
    description: 'Premium quality white cotton tee. The wardrobe essential.',
    image: '/images/top-2.png',
    stock: 30,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'top-003',
    name: 'Black Satin Camisole',
    price: 165,
    category: 'clothes',
    subcategory: 'tops',
    description: 'Elegant black satin camisole. Versatile and chic.',
    image: '/images/top-3.png',
    stock: 12,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'top-004',
    name: 'Cashmere Turtleneck',
    price: 420,
    category: 'clothes',
    subcategory: 'tops',
    description: 'Luxurious cashmere turtleneck. Sophisticated and warm.',
    image: '/images/top-4.png',
    stock: 8,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },

  // Clothes - Bottoms
  {
    id: 'bottom-001',
    name: 'Black Tailored Trousers',
    price: 320,
    category: 'clothes',
    subcategory: 'bottoms',
    description: 'Impeccably tailored black trousers. Perfect for work or evening.',
    image: '/images/bottom-1.png',
    stock: 15,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'bottom-002',
    name: 'High-Waisted Jeans',
    price: 185,
    category: 'clothes',
    subcategory: 'bottoms',
    description: 'Classic high-waisted denim. Flattering and timeless.',
    image: '/images/bottom-2.png',
    stock: 22,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'bottom-003',
    name: 'Camel Wool Skirt',
    price: 380,
    category: 'clothes',
    subcategory: 'bottoms',
    description: 'Elegant camel wool midi skirt. Sophisticated and feminine.',
    image: '/images/bottom-3.png',
    stock: 10,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'bottom-004',
    name: 'White Linen Pants',
    price: 240,
    category: 'clothes',
    subcategory: 'bottoms',
    description: 'Breathable linen pants in classic white. Perfect for summer.',
    image: '/images/bottom-4.png',
    stock: 18,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },

  // Clothes - Dresses
  {
    id: 'dress-001',
    name: 'Black Evening Gown',
    price: 980,
    category: 'clothes',
    subcategory: 'dresses',
    description: 'Stunning black silk evening gown. Perfect for special occasions.',
    image: '/images/dress-1.png',
    stock: 4,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'dress-002',
    name: 'White Minimalist Dress',
    price: 420,
    category: 'clothes',
    subcategory: 'dresses',
    description: 'Clean, modern white dress. Elegantly simple.',
    image: '/images/dress-2.png',
    stock: 9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'dress-003',
    name: 'Champagne Midi Dress',
    price: 650,
    category: 'clothes',
    subcategory: 'dresses',
    description: 'Soft champagne silk midi dress. Romantic and elegant.',
    image: '/images/dress-3.png',
    stock: 7,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'dress-004',
    name: 'Navy Wrap Dress',
    price: 380,
    category: 'clothes',
    subcategory: 'dresses',
    description: 'Classic navy wrap dress. Versatile and flattering.',
    image: '/images/dress-4.png',
    stock: 13,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },

  // Clothes - Accessories
  {
    id: 'accessory-001',
    name: 'Silk Scarf',
    price: 180,
    category: 'clothes',
    subcategory: 'accessories',
    description: 'Luxurious silk scarf in various prints. Elevate any outfit.',
    image: '/images/accessory-1.png',
    stock: 25,
  },
  {
    id: 'accessory-002',
    name: 'Leather Belt',
    price: 220,
    category: 'clothes',
    subcategory: 'accessories',
    description: 'Premium leather belt. A timeless accessory.',
    image: '/images/accessory-2.png',
    stock: 19,
  },
  {
    id: 'accessory-003',
    name: 'Designer Sunglasses',
    price: 480,
    category: 'clothes',
    subcategory: 'accessories',
    description: 'Chic designer sunglasses. Style and protection.',
    image: '/images/accessory-3.png',
    stock: 14,
  },
  {
    id: 'accessory-004',
    name: 'Cashmere Shawl',
    price: 540,
    category: 'clothes',
    subcategory: 'accessories',
    description: 'Soft cashmere shawl. Luxury wrapped around you.',
    image: '/images/accessory-4.png',
    stock: 11,
  },

  // Additional Jewellery - Premium Rings
  {
    id: 'ring-005',
    name: 'Platinum Diamond Ring',
    price: 5200,
    originalPrice: 6500,
    category: 'jewellery',
    subcategory: 'rings',
    description: 'Exquisite platinum band with brilliant-cut diamonds. Heirloom quality.',
    image: '/images/ring-5.png',
    stock: 2,
    sizes: ['6', '7', '8', '9', '10'],
    badge: 'exclusive',
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: 'ring-006',
    name: 'Vintage Opal Ring',
    price: 1450,
    category: 'jewellery',
    subcategory: 'rings',
    description: 'Stunning vintage-inspired opal with intricate filigree detailing.',
    image: '/images/ring-6.png',
    stock: 3,
    sizes: ['6', '7', '8', '9', '10'],
    badge: 'trending',
    rating: 4.7,
    reviewCount: 15,
  },
  {
    id: 'ring-007',
    name: 'Modern Geometric Ring',
    price: 780,
    category: 'jewellery',
    subcategory: 'rings',
    description: 'Contemporary geometric design in 14K rose gold.',
    image: '/images/ring-7.png',
    stock: 8,
    sizes: ['6', '7', '8', '9', '10'],
    badge: 'new',
    rating: 4.6,
    reviewCount: 12,
  },
  {
    id: 'ring-008',
    name: 'Aquamarine Solitaire',
    price: 2300,
    originalPrice: 3100,
    category: 'jewellery',
    subcategory: 'rings',
    description: 'Beautiful aquamarine gemstone with diamond side stones.',
    image: '/images/ring-8.png',
    stock: 4,
    sizes: ['6', '7', '8', '9', '10'],
    badge: 'sale',
    rating: 4.8,
    reviewCount: 22,
  },

  // Additional Jewellery - Premium Necklaces
  {
    id: 'necklace-005',
    name: 'Moonstone Pendant',
    price: 1150,
    category: 'jewellery',
    subcategory: 'necklaces',
    description: 'Enchanting moonstone pendant with ethereal glow.',
    image: '/images/necklace-5.png',
    stock: 6,
    badge: 'trending',
    rating: 4.8,
    reviewCount: 35,
  },
  {
    id: 'necklace-006',
    name: 'Rose Gold Chain',
    price: 920,
    originalPrice: 1200,
    category: 'jewellery',
    subcategory: 'necklaces',
    description: 'Delicate rose gold chain with unique link design.',
    image: '/images/necklace-6.png',
    stock: 11,
    badge: 'sale',
    rating: 4.7,
    reviewCount: 18,
  },
  {
    id: 'necklace-007',
    name: 'Turquoise Boho Necklace',
    price: 580,
    category: 'jewellery',
    subcategory: 'necklaces',
    description: 'Bohemian style with turquoise stones and brass accents.',
    image: '/images/necklace-7.png',
    stock: 14,
    badge: 'new',
    rating: 4.5,
    reviewCount: 8,
  },
  {
    id: 'necklace-008',
    name: 'Gold Locket Necklace',
    price: 1800,
    category: 'jewellery',
    subcategory: 'necklaces',
    description: 'Vintage-inspired locket in 18K gold. Perfect for keepsakes.',
    image: '/images/necklace-8.png',
    stock: 5,
    badge: 'exclusive',
    rating: 4.9,
    reviewCount: 42,
  },

  // Additional Jewellery - Premium Earrings
  {
    id: 'earring-005',
    name: 'Rose Gold Huggie Hoops',
    price: 720,
    category: 'jewellery',
    subcategory: 'earrings',
    description: 'Modern hugging hoops in rose gold with diamond accents.',
    image: '/images/earring-5.png',
    stock: 13,
    badge: 'new',
    rating: 4.6,
    reviewCount: 9,
  },
  {
    id: 'earring-006',
    name: 'Chandelier Earrings',
    price: 980,
    originalPrice: 1300,
    category: 'jewellery',
    subcategory: 'earrings',
    description: 'Glamorous chandelier drops perfect for evening wear.',
    image: '/images/earring-6.png',
    stock: 7,
    badge: 'sale',
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: 'earring-007',
    name: 'Amethyst Geode Earrings',
    price: 650,
    category: 'jewellery',
    subcategory: 'earrings',
    description: 'Natural amethyst geode slices in minimalist gold settings.',
    image: '/images/earring-7.png',
    stock: 10,
    badge: 'trending',
    rating: 4.7,
    reviewCount: 19,
  },
  {
    id: 'earring-008',
    name: 'Baroque Pearl Earrings',
    price: 1200,
    category: 'jewellery',
    subcategory: 'earrings',
    description: 'Unique baroque pearls with contemporary mounting.',
    image: '/images/earring-8.png',
    stock: 5,
    badge: 'exclusive',
    rating: 4.9,
    reviewCount: 31,
  },

  // Additional Jewellery - Premium Bracelets
  {
    id: 'bracelet-005',
    name: 'Sapphire Link Bracelet',
    price: 2800,
    originalPrice: 3600,
    category: 'jewellery',
    subcategory: 'bracelets',
    description: 'Stunning sapphire stones linked with white gold.',
    image: '/images/bracelet-5.png',
    stock: 2,
    badge: 'sale',
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: 'bracelet-006',
    name: 'Turquoise Bead Bracelet',
    price: 420,
    category: 'jewellery',
    subcategory: 'bracelets',
    description: 'Vibrant turquoise beads with adjustable string.',
    image: '/images/bracelet-6.png',
    stock: 20,
    badge: 'new',
    rating: 4.5,
    reviewCount: 11,
  },
  {
    id: 'bracelet-007',
    name: 'Rose Gold Bangle Set',
    price: 890,
    category: 'jewellery',
    subcategory: 'bracelets',
    description: 'Set of three rose gold bangles with textured finishes.',
    image: '/images/bracelet-7.png',
    stock: 9,
    badge: 'trending',
    rating: 4.7,
    reviewCount: 16,
  },
  {
    id: 'bracelet-008',
    name: 'Diamond Charm Bracelet',
    price: 4200,
    category: 'jewellery',
    subcategory: 'bracelets',
    description: 'Luxury charm bracelet with diamond accents and interchangeable charms.',
    image: '/images/bracelet-8.png',
    stock: 1,
    badge: 'exclusive',
    rating: 5.0,
    reviewCount: 33,
  },

  // Additional Clothes - Premium Tops
  {
    id: 'top-005',
    name: 'Silk Blend Blouse',
    price: 450,
    originalPrice: 580,
    category: 'clothes',
    subcategory: 'tops',
    description: 'Premium silk blend with luxurious drape and subtle sheen.',
    image: '/images/top-5.png',
    stock: 14,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'sale',
    rating: 4.7,
    reviewCount: 21,
  },
  {
    id: 'top-006',
    name: 'Linen Summer Top',
    price: 180,
    category: 'clothes',
    subcategory: 'tops',
    description: 'Breathable linen perfect for warm weather.',
    image: '/images/top-6.png',
    stock: 28,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'new',
    rating: 4.4,
    reviewCount: 7,
  },
  {
    id: 'top-007',
    name: 'Merino Wool Sweater',
    price: 380,
    category: 'clothes',
    subcategory: 'tops',
    description: 'Fine merino wool sweater that breathes and regulates temperature.',
    image: '/images/top-7.png',
    stock: 11,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'trending',
    rating: 4.8,
    reviewCount: 26,
  },
  {
    id: 'top-008',
    name: 'Silk Wrap Top',
    price: 520,
    category: 'clothes',
    subcategory: 'tops',
    description: 'Versatile wrap top in pure silk with adjustable fit.',
    image: '/images/top-8.png',
    stock: 9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'exclusive',
    rating: 4.9,
    reviewCount: 34,
  },

  // Additional Clothes - Premium Bottoms
  {
    id: 'bottom-005',
    name: 'Wide-Leg Trousers',
    price: 420,
    originalPrice: 560,
    category: 'clothes',
    subcategory: 'bottoms',
    description: 'Contemporary wide-leg trousers in Italian wool.',
    image: '/images/bottom-5.png',
    stock: 12,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'sale',
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: 'bottom-006',
    name: 'Leather Leggings',
    price: 580,
    category: 'clothes',
    subcategory: 'bottoms',
    description: 'Soft vegan leather leggings for a modern look.',
    image: '/images/bottom-6.png',
    stock: 8,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'trending',
    rating: 4.7,
    reviewCount: 23,
  },
  {
    id: 'bottom-007',
    name: 'Cotton Blend Shorts',
    price: 240,
    category: 'clothes',
    subcategory: 'bottoms',
    description: 'Comfortable and stylish cotton blend shorts.',
    image: '/images/bottom-7.png',
    stock: 26,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'new',
    rating: 4.3,
    reviewCount: 5,
  },
  {
    id: 'bottom-008',
    name: 'Silk Pajama Pants',
    price: 350,
    category: 'clothes',
    subcategory: 'bottoms',
    description: 'Luxurious silk pajama pants for ultimate comfort.',
    image: '/images/bottom-8.png',
    stock: 15,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'exclusive',
    rating: 4.8,
    reviewCount: 29,
  },

  // Additional Clothes - Premium Dresses
  {
    id: 'dress-005',
    name: 'Cocktail Shift Dress',
    price: 750,
    originalPrice: 950,
    category: 'clothes',
    subcategory: 'dresses',
    description: 'Elegant shift dress perfect for cocktail events.',
    image: '/images/dress-5.png',
    stock: 6,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'sale',
    rating: 4.7,
    reviewCount: 20,
  },
  {
    id: 'dress-006',
    name: 'Maxi Beach Dress',
    price: 380,
    category: 'clothes',
    subcategory: 'dresses',
    description: 'Flowy maxi dress perfect for beach vacation.',
    image: '/images/dress-6.png',
    stock: 18,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'new',
    rating: 4.5,
    reviewCount: 10,
  },
  {
    id: 'dress-007',
    name: 'Silk Slip Dress',
    price: 620,
    category: 'clothes',
    subcategory: 'dresses',
    description: 'Minimalist silk slip dress, versatile and elegant.',
    image: '/images/dress-7.png',
    stock: 11,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'trending',
    rating: 4.8,
    reviewCount: 27,
  },
  {
    id: 'dress-008',
    name: 'Embroidered Ball Gown',
    price: 1850,
    category: 'clothes',
    subcategory: 'dresses',
    description: 'Stunning embroidered ball gown for special occasions.',
    image: '/images/dress-8.png',
    stock: 2,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'exclusive',
    rating: 5.0,
    reviewCount: 38,
  },

  // Additional Accessories
  {
    id: 'accessory-005',
    name: 'Wool Hat',
    price: 160,
    category: 'clothes',
    subcategory: 'accessories',
    description: 'Premium wool hat in classic styles.',
    image: '/images/accessory-5.png',
    stock: 22,
    badge: 'new',
    rating: 4.4,
    reviewCount: 8,
  },
  {
    id: 'accessory-006',
    name: 'Leather Gloves',
    price: 280,
    originalPrice: 380,
    category: 'clothes',
    subcategory: 'accessories',
    description: 'Soft lambskin leather gloves for warmth and style.',
    image: '/images/accessory-6.png',
    stock: 16,
    badge: 'sale',
    rating: 4.6,
    reviewCount: 14,
  },
  {
    id: 'accessory-007',
    name: 'Silk Hair Scarf',
    price: 220,
    category: 'clothes',
    subcategory: 'accessories',
    description: 'Pure silk hair scarf for protection and elegance.',
    image: '/images/accessory-7.png',
    stock: 20,
    badge: 'trending',
    rating: 4.7,
    reviewCount: 17,
  },
  {
    id: 'accessory-008',
    name: 'Premium Pashmina',
    price: 890,
    category: 'clothes',
    subcategory: 'accessories',
    description: 'Luxurious pashmina wrap in rich colors.',
    image: '/images/accessory-8.png',
    stock: 8,
    badge: 'exclusive',
    rating: 4.9,
    reviewCount: 32,
  },
]
