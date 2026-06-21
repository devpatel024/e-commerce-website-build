export type Category = 'jewellery' | 'clothes'
export type ProductSubcategory = 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'tops' | 'bottoms' | 'dresses' | 'accessories'
export type ProductBadge = 'new' | 'bestseller' | 'sale' | 'trending' | 'limited' | 'exclusive'

export interface ProductReview {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  comment: string
  createdAt: string
  helpful: number
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: Category
  subcategory: ProductSubcategory
  description: string
  image: string
  images?: string[]
  stock: number
  variants?: ProductVariant[]
  sizes?: string[]
  rating?: number
  reviewCount?: number
  reviews?: ProductReview[]
  badge?: ProductBadge
  tags?: string[]
  details?: Record<string, string>
}

export interface ProductVariant {
  id: string
  name: string
  value: string
}

export interface CartItem {
  productId: string
  quantity: number
  size?: string
  variant?: string
}

export interface Order {
  id: string
  createdAt: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  items: OrderItem[]
  total: number
  customer: {
    name: string
    email: string
    address: string
    city: string
    postalCode: string
  }
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  size?: string
  variant?: string
}

export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface AuthSession {
  user: User
  token: string
}

export interface UserPreferences {
  userId: string
  wishlist: string[]
  favorites: string[]
  recentlyViewed: string[]
  savedAddresses?: Address[]
}

export interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}
