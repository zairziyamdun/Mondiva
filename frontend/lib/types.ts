// ===== Product =====
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  oldPrice?: number
  discount?: number
  images: string[]
  category: string
  categorySlug: string
  brand: string
  colors: string[]
  sizes: string[]
  rating: number
  reviewCount: number
  isNew: boolean
  isPopular: boolean
  inStock: boolean
  createdAt: string
}

// ===== User =====
export type UserRole = "user" | "moderator" | "admin" | "logistics"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  avatar?: string
  createdAt: string
}

// ===== Order =====
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled"

export interface OrderItem {
  productId: string
  name: string
  image: string
  size: string
  color: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  address: string
  deliveryMethod: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

// ===== Review =====
export interface Review {
  id: string
  userId: string
  userName: string
  productId: string
  rating: number
  text: string
  isApproved: boolean
  createdAt: string
}

// ===== Return =====
export type ReturnStatus = "pending" | "approved" | "rejected" | "refunded"

export interface ReturnRequest {
  id: string
  orderId: string
  userId: string
  reason: string
  status: ReturnStatus
  createdAt: string
}

// ===== Cart =====
export interface CartItem {
  productId: string
  name: string
  image: string
  size: string
  color: string
  quantity: number
  price: number
}

// ===== Category =====
export interface Category {
  id: string
  name: string
  slug: string
  image: string
}
