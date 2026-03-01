import Discount from "../models/Discount.js"

/**
 * Проверяет пересечение двух периодов
 * (newStart <= existingEnd) AND (newEnd >= existingStart)
 */
export function periodsOverlap(newStart, newEnd, existingStart, existingEnd) {
  const ns = new Date(newStart).getTime()
  const ne = new Date(newEnd).getTime()
  const es = new Date(existingStart).getTime()
  const ee = new Date(existingEnd).getTime()
  return ns <= ee && ne >= es
}

/**
 * Проверяет, есть ли пересечение с другими скидками продукта
 * @param {import("mongoose").Types.ObjectId|string} productId
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @param {string} [excludeId] - ID скидки для исключения (при редактировании)
 */
export async function hasOverlappingDiscount(productId, startDate, endDate, excludeId = null) {
  const discounts = await Discount.find({ productId }).lean()
  for (const d of discounts) {
    if (excludeId && String(d._id) === String(excludeId)) continue
    if (periodsOverlap(startDate, endDate, d.startDate, d.endDate)) return true
  }
  return false
}

/**
 * Проверяет, активна ли скидка: isActive && now между startDate и endDate
 */
function isDiscountActive(discount) {
  if (!discount?.isActive) return false
  const now = new Date()
  return now >= new Date(discount.startDate) && now <= new Date(discount.endDate)
}

/**
 * Вычисляет finalPrice по скидке
 * @param {number} price - базовая цена
 * @param {object} discount - { type, value }
 * @returns {number}
 */
function applyDiscount(price, discount) {
  if (!discount || price <= 0) return price
  let finalPrice
  if (discount.type === "percentage") {
    finalPrice = price - (price * discount.value) / 100
  } else if (discount.type === "fixed") {
    finalPrice = Math.max(0, price - discount.value)
  } else {
    return price
  }
  return Math.round(finalPrice)
}

/**
 * Добавляет finalPrice, oldPrice, discountPercent к продукту
 * @param {object} product - plain product (from lean())
 * @param {object|null} discount - активная скидка или null
 */
export function enrichProductWithPrice(product, discount) {
  const basePrice = product.price ?? 0
  const doc = typeof product.toObject === "function" ? product.toObject() : { ...product }

  if (discount && isDiscountActive(discount)) {
    const finalPrice = applyDiscount(basePrice, discount)
    const discountPercent =
      discount.type === "percentage"
        ? discount.value
        : basePrice > 0
          ? Math.round((1 - finalPrice / basePrice) * 100)
          : 0

    doc.finalPrice = finalPrice
    doc.oldPrice = basePrice
    doc.discountPercent = discountPercent
  } else {
    doc.finalPrice = basePrice
  }

  return doc
}

/**
 * Находит активную скидку для продукта
 * @param {ObjectId|string} productId
 * @returns {Promise<object|null>}
 */
export async function findActiveDiscount(productId) {
  const now = new Date()
  const discount = await Discount.findOne({
    productId,
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).lean()
  return discount
}

/**
 * Находит активные скидки для списка продуктов (оптимизация для getProducts)
 * @param {ObjectId[]} productIds
 * @returns {Promise<Map<string, object>>} productId -> discount
 */
export async function findActiveDiscountsForProducts(productIds) {
  if (!productIds?.length) return new Map()
  const now = new Date()
  const discounts = await Discount.find({
    productId: { $in: productIds },
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).lean()

  const map = new Map()
  for (const d of discounts) {
    const id = String(d.productId)
    if (!map.has(id)) map.set(id, d)
  }
  return map
}
