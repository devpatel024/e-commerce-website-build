export type Category = 'jewellery' | 'clothes'
export type ProductSubcategory = 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'tops' | 'bottoms' | 'dresses' | 'accessories'

export interface Product {
  id: string
  name: string
  price: number
  category: Category
  subcategory: ProductSubcategory
  description: string
  image: string
  images?: string[]
  stock: number
  variants?: ProductVariant[]
  sizes?: string[]
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
