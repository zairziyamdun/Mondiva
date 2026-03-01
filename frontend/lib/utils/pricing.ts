import type { Product } from "@/lib/types"

/**
 * Текущая цена: discountPrice если активна временная скидка, иначе price.
 * Логика синхронизирована с backend (Product virtual currentPrice).
 */
export function getCurrentPrice(product: Pick<Product, "price" | "discountPrice" | "discountStart" | "discountEnd">): number {
  const now = new Date()
  if (
    product.discountPrice != null &&
    product.discountStart &&
    product.discountEnd &&
    now >= new Date(product.discountStart) &&
    now <= new Date(product.discountEnd)
  ) {
    return product.discountPrice
  }
  return product.price
}

/**
 * Есть ли активная временная скидка.
 * Логика синхронизирована с backend (Product virtual hasActiveDiscount).
 */
export function hasActiveDiscount(
  product: Pick<Product, "discountPrice" | "discountStart" | "discountEnd">
): boolean {
  const now = new Date()
  return !!(
    product.discountPrice != null &&
    product.discountStart &&
    product.discountEnd &&
    now >= new Date(product.discountStart) &&
    now <= new Date(product.discountEnd)
  )
}

/**
 * Процент скидки при активной скидке: (1 - discountPrice/price) * 100
 */
export function getDiscountPercent(product: Product): number | null {
  if (!hasActiveDiscount(product) || product.discountPrice == null || product.price <= 0) {
    return null
  }
  return Math.round((1 - product.discountPrice / product.price) * 100)
}
