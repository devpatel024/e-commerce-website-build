import { Product, Order, CartItem } from './types'

const PRODUCTS_KEY = 'luxe_products'
const ORDERS_KEY = 'luxe_orders'
const CART_KEY = 'luxe_cart'

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
]
