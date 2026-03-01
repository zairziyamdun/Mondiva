// ===== Product (синхронизировано с backend Mongoose schema) =====
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  oldPrice?: number
  discount?: number
  discountPrice?: number
  discountStart?: string
  discountEnd?: string
  stock: number
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

// ===== API response types (backend returns _id) =====

export interface ApiProduct {
  _id: string
  name: string
  slug: string
  description?: string
  price: number
  oldPrice?: number
  discount?: number
  discountPrice?: number
  discountStart?: string
  discountEnd?: string
  stock?: number
  images?: string[]
  category?: string
  categorySlug?: string
  brand?: string
  colors?: string[]
  sizes?: string[]
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isPopular?: boolean
  createdAt?: string
}

export interface ApiCategory {
  _id: string
  name: string
  slug: string
  image?: string
}

export interface ApiUser {
  _id?: string
  id?: string
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar?: string
  createdAt?: string
}

export interface ApiOrderItem {
  productId: string
  name: string
  image: string
  size: string
  color: string
  quantity: number
  price: number
}

export interface ApiOrder {
  _id: string
  userId: string
  items: ApiOrderItem[]
  total: number
  status: OrderStatus
  address: string
  deliveryMethod: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface ApiReview {
  _id: string
  userId: string
  userName: string
  productId: string
  rating: number
  text: string
  isApproved: boolean
  createdAt: string
}

export interface ApiReturnRequest {
  _id: string
  orderId: string
  userId: string
  reason: string
  status: ReturnStatus
  createdAt: string
}

// ===== Normalizers: _id → id for UI =====

function toId(obj: { _id: string } | { id?: string; _id?: string }): string {
  if (!obj) return ""
  return "id" in obj && obj.id ? obj.id : "_id" in obj ? obj._id : ""
}

export function normalizeProduct(api: ApiProduct | null | undefined): Product | null {
  if (!api) return null
  const id = toId(api)
  return {
    id,
    name: api.name,
    slug: api.slug,
    description: api.description ?? "",
    price: api.price,
    oldPrice: api.oldPrice,
    discount: api.discount,
    discountPrice: api.discountPrice,
    discountStart: api.discountStart,
    discountEnd: api.discountEnd,
    stock: typeof api.stock === "number" ? api.stock : 0,
    images: api.images ?? [],
    category: api.category ?? "",
    categorySlug: api.categorySlug ?? "",
    brand: api.brand ?? "",
    colors: api.colors ?? [],
    sizes: api.sizes ?? [],
    rating: api.rating ?? 0,
    reviewCount: api.reviewCount ?? 0,
    isNew: api.isNew ?? false,
    isPopular: api.isPopular ?? false,
    createdAt: api.createdAt ?? new Date().toISOString(),
  }
}

export function normalizeCategory(api: ApiCategory | null | undefined): Category | null {
  if (!api) return null
  return {
    id: toId(api),
    name: api.name,
    slug: api.slug,
    image: api.image ?? "",
  }
}

export function normalizeUser(api: ApiUser | null | undefined): User | null {
  if (!api) return null
  return {
    id: api._id ?? api.id ?? "",
    email: api.email,
    name: api.name,
    phone: api.phone,
    role: api.role,
    avatar: api.avatar,
    createdAt: api.createdAt ?? "",
  }
}

export function normalizeOrder(api: ApiOrder | null | undefined): Order | null {
  if (!api) return null
  return {
    id: toId(api),
    userId: typeof api.userId === "string" ? api.userId : String(api.userId),
    items: api.items,
    total: api.total,
    status: api.status,
    address: api.address,
    deliveryMethod: api.deliveryMethod,
    paymentMethod: api.paymentMethod,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  }
}

export function normalizeReview(api: ApiReview | null | undefined): Review | null {
  if (!api) return null
  return {
    id: toId(api),
    userId: String(api.userId),
    userName: api.userName,
    productId: String(api.productId),
    rating: api.rating,
    text: api.text,
    isApproved: api.isApproved,
    createdAt: api.createdAt,
  }
}

export function normalizeReturnRequest(api: ApiReturnRequest | null | undefined): ReturnRequest | null {
  if (!api) return null
  return {
    id: toId(api),
    orderId: String(api.orderId),
    userId: String(api.userId),
    reason: api.reason,
    status: api.status,
    createdAt: api.createdAt,
  }
}
