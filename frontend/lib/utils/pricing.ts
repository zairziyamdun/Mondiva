import type { Product } from "@/lib/types"

/**
 * Текущая цена для отображения и расчётов.
 * API возвращает finalPrice (вычисленную на бэкенде из Discount).
 */
export function getCurrentPrice(product: Pick<Product, "price" | "finalPrice">): number {
  return product.finalPrice ?? product.price
}

/**
 * Есть ли активная скидка (oldPrice возвращается только при скидке).
 */
export function hasActiveDiscount(product: Pick<Product, "oldPrice">): boolean {
  return product.oldPrice != null
}

/**
 * Процент скидки (возвращается с API при активной скидке).
 */
export function getDiscountPercent(product: Pick<Product, "discountPercent">): number | null {
  return product.discountPercent != null ? product.discountPercent : null
}
